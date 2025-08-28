import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import Button from '../../components/Button';
import { FaArrowLeft, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { updateLocalTask, updateApiTask } from '../../redux/actions/taskActions';
import Swal from 'sweetalert2';

const TaskDetails = () => {
  const { taskId, completed } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [task, setTask] = useState(null);
  const [isLocalTask, setIsLocalTask] = useState(false);
  
  const localTasks = useSelector(state => state.tasks.localTasks);
  const apiTasks = useSelector(state => state.tasks.apiTasks);

  useEffect(() => {
    const localTask = localTasks.find(t => t.id === taskId);
    if (localTask) {
      setTask(localTask);
      setIsLocalTask(true);
      return;
    }
    
    const apiTask = apiTasks.find(t => t.id === taskId);
    if (apiTask) {
      setTask(apiTask);
      setIsLocalTask(false);
      return;
    }
    
    Swal.fire('Error', 'Task not found', 'error');
    navigate('/dashboard');
  }, [taskId, localTasks, apiTasks, navigate]);

  const handleToggleComplete = async () => {
    try {
      if (isLocalTask) {
        await dispatch(updateLocalTask(taskId, { completed: !task.completed }));
      } else {
        await dispatch(updateApiTask(taskId, { completed: !task.completed }));
      }
      
      setTask({ ...task, completed: !task.completed });
      Swal.fire('Success', 'Task status updated', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update task', 'error');
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Task Details - {task.title}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={isLocalTask ? "/dashboard/local" : "/dashboard/api"}>
            <Button variant="secondary" className="flex items-center gap-2">
              <FaArrowLeft className="w-4 h-4" /> Back to Tasks
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              task.completed 
                ? "bg-green-100 text-green-800" 
                : "bg-purple-100 text-purple-800"
            }`}>
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">{task.title}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex items-center">
                <button
                  onClick={handleToggleComplete}
                  className="mr-3 text-2xl transition-colors"
                >
                  {task.completed ? (
                    <FaCheckCircle className="text-green-500 hover:text-green-600" />
                  ) : (
                    <FaRegCircle className="text-gray-300 hover:text-purple-500" />
                  )}
                </button>
                <span className="text-gray-700">
                  {task.completed ? "Completed" : "Mark as complete"}
                </span>
              </div>
            </div>

            {task.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                <p className="text-gray-600">
                  {new Date(task.createdAt).toLocaleDateString()} at{" "}
                  {new Date(task.createdAt).toLocaleTimeString()}
                </p>
              </div>
            )}

            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-600">
                  {new Date(task.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(task.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
              <p className="text-gray-600">{isLocalTask ? "Local Task" : "API Task"}</p>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
          
            
            <Button
              variant="secondary"
              onClick={handleToggleComplete}
            >
              {task.completed ? "Mark as Pending" : "Mark as Completed"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;