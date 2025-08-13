import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Flag, AlertTriangle, CheckSquare, Clock } from 'lucide-react';
import axios from 'axios';

const TaskModal = ({ task, type, onClose, onDelete, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'medium',
    category: '',
    notes: ''
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignedTo: task.assignedTo?._id || '',
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        priority: task.priority || 'medium',
        category: task.category || '',
        notes: task.notes || ''
      });
    }

    // Fetch users for assignment dropdown
    if (type === 'edit' || type === 'create') {
      fetchUsers();
    }
  }, [task, type]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Ensure users is always an array
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckSquare size={20} className="text-green-600" />;
      case 'overdue':
        return <AlertTriangle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-blue-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-secondary',
      accepted: 'badge-blue',
      in_progress: 'badge-yellow',
      completed: 'badge-success',
      overdue: 'badge-danger'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'badge-secondary'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      low: 'badge-green',
      medium: 'badge-blue',
      high: 'badge-orange',
      urgent: 'badge-red'
    };

    return (
      <span className={`badge ${priorityClasses[priority] || 'badge-blue'}`}>
        {priority}
      </span>
    );
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const renderViewContent = () => (
    <div>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            {task.title}
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            {task.description}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <User size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Assigned To</span>
            </div>
            <p style={{ color: '#1f2937' }}>{task.assignedTo?.name}</p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <User size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Assigned By</span>
            </div>
            <p style={{ color: '#1f2937' }}>{task.assignedBy?.name}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {getStatusIcon(task.status)}
              <span style={{ fontWeight: '500', color: '#374151' }}>Status</span>
            </div>
            {getStatusBadge(task.status)}
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Flag size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Priority</span>
            </div>
            {getPriorityBadge(task.priority)}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Calendar size={16} style={{ color: '#6b7280' }} />
            <span style={{ fontWeight: '500', color: '#374151' }}>Deadline</span>
          </div>
          <p style={{ 
            color: isOverdue(task.deadline) && task.status !== 'completed' ? '#dc2626' : '#1f2937',
            fontWeight: isOverdue(task.deadline) && task.status !== 'completed' ? '600' : 'normal'
          }}>
            {formatDate(task.deadline)}
            {isOverdue(task.deadline) && task.status !== 'completed' && (
              <span style={{ marginLeft: '0.5rem', color: '#dc2626' }}>
                (Overdue)
              </span>
            )}
          </p>
        </div>

        {task.category && (
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Category
            </div>
            <p style={{ color: '#1f2937' }}>{task.category}</p>
          </div>
        )}

        {task.notes && (
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Notes
            </div>
            <p style={{ color: '#1f2937' }}>{task.notes}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Created
            </div>
            <p style={{ color: '#1f2937' }}>{formatDate(task.createdAt)}</p>
          </div>
          
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Last Updated
            </div>
            <p style={{ color: '#1f2937' }}>{formatDate(task.updatedAt)}</p>
          </div>
        </div>

        {task.completedAt && (
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Completed At
            </div>
            <p style={{ color: '#1f2937' }}>{formatDate(task.completedAt)}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEditContent = () => (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            rows="4"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Assigned To *</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Deadline *</label>
          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Development, Design, Testing"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              placeholder="Additional notes"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button type="submit" className="btn btn-primary">
          Update Task
        </button>
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );

  const renderDeleteContent = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        background: '#fee2e2', 
        padding: '2rem', 
        borderRadius: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Delete Task</h3>
        <p style={{ color: '#991b1b' }}>
          Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete Task
        </button>
        <button onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (type) {
      case 'view': return 'Task Details';
      case 'edit': return 'Edit Task';
      case 'delete': return 'Delete Task';
      default: return 'Task';
    }
  };

  const getModalContent = () => {
    switch (type) {
      case 'view': return renderViewContent();
      case 'edit': return renderEditContent();
      case 'delete': return renderDeleteContent();
      default: return null;
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{getModalTitle()}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>
        
        {getModalContent()}
      </div>
    </div>
  );
};

export default TaskModal; 