const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks (admin) or user's tasks (user)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      // Admin can see all tasks
      tasks = await Task.find({})
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Users can only see their assigned tasks
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedBy', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task (admin only)
// @access  Admin only
router.post('/', [
  adminAuth,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignedTo').notEmpty().withMessage('Assigned user is required'),
  body('deadline').notEmpty().withMessage('Deadline is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, assignedTo, deadline, priority, category, notes } = req.body;

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    // Check if deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      deadline: new Date(deadline),
      priority: priority || 'medium',
      category,
      notes
    });

    await task.save();

    // Populate user details for response
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name email');

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task (admin only)
// @access  Admin only
router.put('/:id', [
  adminAuth,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, deadline, priority, category, notes } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (deadline) {
      if (new Date(deadline) <= new Date()) {
        return res.status(400).json({ message: 'Deadline must be in the future' });
      }
      updateFields.deadline = new Date(deadline);
    }
    if (priority) updateFields.priority = priority;
    if (category !== undefined) updateFields.category = category;
    if (notes !== undefined) updateFields.notes = notes;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task (admin only)
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id/accept
// @desc    Accept task (assigned user only)
// @access  Private
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (task.status !== 'pending') {
      return res.status(400).json({ message: 'Task cannot be accepted in current status' });
    }

    await task.acceptTask();
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id/start
// @desc    Start task (assigned user only)
// @access  Private
router.put('/:id/start', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (task.status !== 'accepted') {
      return res.status(400).json({ message: 'Task must be accepted before starting' });
    }

    await task.startTask();
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id/receive
// @desc    Receive task (assigned user only)
// @access  Private
router.put('/:id/receive', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (task.status !== 'pending') {
      return res.status(400).json({ message: 'Task cannot be received in current status' });
    }

    task.status = 'working_on';
    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id/complete
// @desc    Complete task (assigned user only)
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Task is already completed' });
    }

    if (task.status !== 'working_on' && task.status !== 'overdue') {
      return res.status(400).json({ message: 'Task must be working on or overdue to be completed' });
    }

    await task.markCompleted();
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/user/:userId
// @desc    Get tasks assigned to specific user (admin only)
// @access  Admin only
router.get('/user/:userId', adminAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 