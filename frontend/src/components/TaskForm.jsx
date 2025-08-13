import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckSquare, ArrowLeft, User, Calendar, Flag, Tag, FileText } from 'lucide-react';

const TaskForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'medium',
    category: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.filter(user => user.isActive)); // Only active users
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please select a user to assign the task to';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/tasks', formData);
      toast.success('Task assigned successfully');
      navigate('/tasks');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign task';
      toast.error(message);
      
      // Handle validation errors from server
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingUsers) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/tasks')}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeft size={16} />
          Back to Tasks
        </button>
        
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Assign New Task
        </h1>
        <p style={{ color: '#6b7280' }}>
          Create and assign a new task to a user
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">
                <CheckSquare size={16} style={{ marginRight: '0.5rem' }} />
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter task title"
                style={{ borderColor: errors.title ? '#ef4444' : undefined }}
              />
              {errors.title && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={16} style={{ marginRight: '0.5rem' }} />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="4"
                placeholder="Describe the task in detail"
                style={{ borderColor: errors.description ? '#ef4444' : undefined }}
              />
              {errors.description && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.description}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <User size={16} style={{ marginRight: '0.5rem' }} />
                  Assign To *
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="form-select"
                  style={{ borderColor: errors.assignedTo ? '#ef4444' : undefined }}
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && (
                  <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.assignedTo}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Flag size={16} style={{ marginRight: '0.5rem' }} />
                  Priority
                </label>
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
              <label className="form-label">
                <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                Deadline *
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="form-input"
                style={{ borderColor: errors.deadline ? '#ef4444' : undefined }}
                required
              />
              {errors.deadline && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.deadline}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <Tag size={16} style={{ marginRight: '0.5rem' }} />
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Development, Design, Testing, Marketing"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} style={{ marginRight: '0.5rem' }} />
                  Additional Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Any additional notes or instructions"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              ) : (
                'Assign Task'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Task Assignment Guidelines
        </h3>
        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <div>• <strong>Title:</strong> Keep it concise but descriptive</div>
          <div>• <strong>Description:</strong> Provide clear, detailed instructions</div>
          <div>• <strong>Deadline:</strong> Set realistic timeframes</div>
          <div>• <strong>Priority:</strong> Use appropriate urgency levels</div>
          <div>• <strong>Category:</strong> Helps organize and filter tasks</div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm; 