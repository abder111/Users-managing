import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Calendar, Mail, Shield, Users, CheckSquare } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    workingOn: 0,
    completed: 0,
    overdue: 0
  });

  useEffect(() => {
    if (user) {
      fetchTaskStats();
    }
  }, [user]);

  const fetchTaskStats = async () => {
    try {
      const response = await axios.get('/api/tasks');
      const tasks = response.data;
      
      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        workingOn: tasks.filter(t => t.status === 'working_on').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.status === 'overdue').length
      };
      
      setTaskStats(stats);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ color: '#6b7280' }}>
          Here's what's happening with your account
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              background: '#dbeafe',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              color: '#1e40af'
            }}>
              <User size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#1f2937' }}>Profile Information</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Your account details</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Name:</span>
              <span style={{ fontWeight: '500' }}>{user?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Email:</span>
              <span style={{ fontWeight: '500' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Role:</span>
              <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user?.role}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Status:</span>
              <span className={`badge ${user?.isActive ? 'badge-active' : 'badge-inactive'}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              background: '#fef3c7',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              color: '#92400e'
            }}>
              <Calendar size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#1f2937' }}>Account Details</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Registration and activity</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Joined:</span>
              <span style={{ fontWeight: '500' }}>{formatDate(user?.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Last Updated:</span>
              <span style={{ fontWeight: '500' }}>{formatDate(user?.updatedAt)}</span>
            </div>
            {user?.department && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Department:</span>
                <span style={{ fontWeight: '500' }}>{user.department}</span>
              </div>
            )}
            {user?.position && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Position:</span>
                <span style={{ fontWeight: '500' }}>{user.position}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              background: '#d1fae5',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              color: '#065f46'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#1f2937' }}>Permissions</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Your access level</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {user?.role === 'admin' ? (
              <>
                <div style={{ 
                  padding: '0.75rem', 
                  background: '#dbeafe', 
                  borderRadius: '0.375rem',
                  border: '1px solid #bfdbfe'
                }}>
                  <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>
                    Administrator Access
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                    You have full access to manage all users and system settings.
                  </div>
                </div>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  <li style={{ padding: '0.25rem 0' }}>✓ View all users</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Create new users</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Edit user information</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Delete users</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Manage user roles</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Assign tasks to users</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Monitor task progress</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Manage all tasks</li>
                </ul>
              </>
            ) : (
              <>
                <div style={{ 
                  padding: '0.75rem', 
                  background: '#f3f4f6', 
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                    Standard User Access
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    You have access to view your own profile and dashboard.
                  </div>
                </div>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  <li style={{ padding: '0.25rem 0' }}>✓ View your profile</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Access dashboard</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ View assigned tasks</li>
                  <li style={{ padding: '0.25rem 0' }}>✓ Accept and complete tasks</li>
                  <li style={{ padding: '0.25rem 0' }}>✗ Manage other users</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Statistics Card for Users */}
      {user?.role !== 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              background: '#dbeafe',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              color: '#1e40af'
            }}>
              <CheckSquare size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#1f2937' }}>My Tasks Overview</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Your task statistics and progress</p>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{taskStats.total}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Tasks</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#92400e' }}>{taskStats.pending}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#dbeafe', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>{taskStats.workingOn}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Working On</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#d1fae5', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#065f46' }}>{taskStats.completed}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>{taskStats.overdue}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Overdue</div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <a href="/tasks" className="btn btn-primary">
              <CheckSquare size={16} />
              View My Tasks
            </a>
            {taskStats.pending > 0 && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: '#fef3c7', 
                color: '#92400e',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                ⚠️ You have {taskStats.pending} pending task{taskStats.pending > 1 ? 's' : ''} to accept
              </div>
            )}
            {taskStats.overdue > 0 && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: '#fee2e2', 
                color: '#dc2626',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                🚨 You have {taskStats.overdue} overdue task{taskStats.overdue > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="card">
          <h3 style={{ 
            fontWeight: '600', 
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/users" className="btn btn-primary">
              <Users size={16} />
              Manage Users
            </a>
            <a href="/users/new" className="btn btn-success">
              <User size={16} />
              Add New User
            </a>
            <a href="/tasks" className="btn btn-secondary">
              <CheckSquare size={16} />
              Manage Tasks
            </a>
            <a href="/tasks/new" className="btn btn-primary">
              <CheckSquare size={16} />
              Assign Task
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 