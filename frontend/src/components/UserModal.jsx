import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, Briefcase, Shield, Calendar } from 'lucide-react';

const UserModal = ({ user, type, onClose, onDelete, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    phone: '',
    department: '',
    position: '',
    isActive: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        phone: user.phone || '',
        department: user.department || '',
        position: user.position || '',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleDelete = () => {
    onDelete(user._id);
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

  const renderViewContent = () => (
    <div>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <User size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Name</span>
            </div>
            <p style={{ color: '#1f2937' }}>{user.name}</p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Mail size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Email</span>
            </div>
            <p style={{ color: '#1f2937' }}>{user.email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Shield size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Role</span>
            </div>
            <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
              {user.role}
            </span>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Shield size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Status</span>
            </div>
            <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {user.phone && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Phone size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Phone</span>
            </div>
            <p style={{ color: '#1f2937' }}>{user.phone}</p>
          </div>
        )}

        {(user.department || user.position) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {user.department && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Building size={16} style={{ color: '#6b7280' }} />
                  <span style={{ fontWeight: '500', color: '#374151' }}>Department</span>
                </div>
                <p style={{ color: '#1f2937' }}>{user.department}</p>
              </div>
            )}
            
            {user.position && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Briefcase size={16} style={{ color: '#6b7280' }} />
                  <span style={{ fontWeight: '500', color: '#374151' }}>Position</span>
                </div>
                <p style={{ color: '#1f2937' }}>{user.position}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calendar size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Created</span>
            </div>
            <p style={{ color: '#1f2937' }}>{formatDate(user.createdAt)}</p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calendar size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#374151' }}>Last Updated</span>
            </div>
            <p style={{ color: '#1f2937' }}>{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditContent = () => (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              className="form-select"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button type="submit" className="btn btn-primary">
          Update User
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
        <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Delete User</h3>
        <p style={{ color: '#991b1b' }}>
          Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete User
        </button>
        <button onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (type) {
      case 'view': return 'User Details';
      case 'edit': return 'Edit User';
      case 'delete': return 'Delete User';
      default: return 'User';
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

export default UserModal; 