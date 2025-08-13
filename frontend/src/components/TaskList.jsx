import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Flag,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import TaskModal from './TaskModal';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, action) => {
    try {
      let endpoint = '';
      switch (action) {
        case 'receive':
          endpoint = `/api/tasks/${taskId}/receive`;
          break;
        case 'complete':
          endpoint = `/api/tasks/${taskId}/complete`;
          break;
        default:
          return;
      }

      const response = await axios.put(endpoint);
      toast.success(`Task ${action}ed successfully`);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} task`);
    }
  };

  const handleDelete = async (taskId) => {
    console.log('handleDelete called with taskId:', taskId);
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      toast.success('Task deleted successfully');
      fetchTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleUpdate = async (taskData) => {
    console.log('handleUpdate called with taskData:', taskData);
    try {
      await axios.put(`/api/tasks/${selectedTask._id}`, taskData);
      toast.success('Task updated successfully');
      fetchTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const openModal = (task, type) => {
    console.log('openModal called:', { task, type, userRole: user?.role });
    setSelectedTask(task);
    setModalType(type);
    setShowModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckSquare size={16} className="text-green-600" />;
      case 'working_on':
        return <Clock size={16} className="text-blue-600" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-secondary',
      working_on: 'badge-blue',
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }



  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Task Management
          </h1>
          <p style={{ color: '#6b7280' }}>
            {user?.role === 'admin' ? 'Manage and assign tasks to users' : 'View and manage your assigned tasks'}
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={16} />
            Assign New Task
          </Link>
        )}
      </div>

      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ minWidth: '120px' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="working_on">Working On</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-select"
              style={{ minWidth: '120px' }}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                {user?.role === 'admin' && <th>Assigned To</th>}
                <th>Status</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} style={{
                  backgroundColor: isOverdue(task.deadline) && task.status !== 'completed' ? '#fef2f2' : undefined
                }}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>
                        {task.title}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280',
                        marginTop: '0.25rem'
                      }}>
                        {task.description.length > 50 
                          ? `${task.description.substring(0, 50)}...` 
                          : task.description
                        }
                      </div>
                    </div>
                  </td>
                  
                  {user?.role === 'admin' && (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} />
                        {task.assignedTo?.name}
                      </div>
                    </td>
                  )}
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getStatusIcon(task.status)}
                      {getStatusBadge(task.status)}
                    </div>
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Flag size={14} />
                      {getPriorityBadge(task.priority)}
                    </div>
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} />
                      <span style={{
                        color: isOverdue(task.deadline) && task.status !== 'completed' ? '#dc2626' : undefined
                      }}>
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  
                  <td>{task.category || '-'}</td>
                  
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        onClick={() => openModal(task, 'view')}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="View Task"
                      >
                        <Eye size={14} />
                      </button>
                      {user?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => openModal(task, 'edit')}
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.5rem' }}
                            title="Edit Task"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => openModal(task, 'delete')}
                            className="btn btn-danger"
                            style={{ padding: '0.25rem 0.5rem' }}
                            title="Delete Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {user?.role !== 'admin' && String(task.assignedTo?._id || task.assignedTo) === String(user?._id) && (
                        <>
                          {task.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(task._id, 'receive')}
                              className="btn btn-primary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', fontWeight: '600' }}
                              title="Receive Task"
                            >
                              📥 Receive
                            </button>
                          )}
                          {task.status === 'working_on' && (
                            <button
                              onClick={() => handleStatusUpdate(task._id, 'complete')}
                              className="btn btn-success"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', fontWeight: '600' }}
                              title="Complete Task"
                            >
                              ✅ Complete
                            </button>
                          )}
                          {task.status === 'completed' && (
                            <span style={{ padding: '0.25rem 0.5rem', background: '#d1fae5', color: '#065f46', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '600' }}>
                              🎉 Completed
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#6b7280'
          }}>
            <CheckSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No tasks found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : user?.role === 'admin' 
                  ? 'Get started by assigning your first task'
                  : 'No tasks have been assigned to you yet'
              }
            </p>
          </div>
        )}
      </div>
      {showModal && (
        <TaskModal
          task={selectedTask}
          type={modalType}
          onClose={() => setShowModal(false)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default TaskList;