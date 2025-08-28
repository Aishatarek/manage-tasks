import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addLocalTask,
  updateLocalTask,
  deleteLocalTask,
  loadLocalTasks,
  reorderLocalTasks,
} from '../../redux/actions/taskActions';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { Helmet } from 'react-helmet';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaGripLines, 
  FaCheckCircle, 
  FaRegCircle, 
  FaSort,
  FaFilter
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const TaskItem = React.memo(
  ({ task, index, onToggleComplete, onEdit, onDelete, onDragStart, onDragOver, onDrop }) => (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`p-4 border rounded-lg mb-3 flex items-center justify-between transition-all duration-300 ${
        task.completed
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200 hover:border-purple-300 shadow-sm"
      }`}
    >
      <div className="flex items-center flex-1">
        <div
          className="mr-3 text-gray-400 hover:text-purple-500 cursor-grab p-2 rounded-lg hover:bg-purple-50"
        >
          <FaGripLines />
        </div>
        
        <button 
          onClick={() => onToggleComplete(task.id, !task.completed)}
          className="mr-3 text-xl transition-colors"
        >
          {task.completed ? (
            <FaCheckCircle className="text-green-500 hover:text-green-600" />
          ) : (
            <FaRegCircle className="text-gray-300 hover:text-purple-500" />
          )}
        </button>
        
        <div className="flex-1">
          <Link
            to={`/task/${task.completed}/${task.id}`}
            className="hover:text-purple-600 transition-colors"
          >
            <h3
              className={`font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>
          </Link>
          <p className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
            task.completed 
              ? "bg-green-100 text-green-800" 
              : "bg-purple-100 text-purple-800"
          }`}>
            {task.completed ? "Completed" : "Pending"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="small"
          onClick={() => onEdit(task)}
          className="flex items-center gap-1 px-3 py-2 border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <FaEdit className="w-3 h-3" /> Edit
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1 px-3 py-2"
        >
          <FaTrash className="w-3 h-3" /> Delete
        </Button>
      </div>
    </div>
  )
);

const TasksList = ({ tasks, onToggleComplete, onEdit, onDelete, onDragStart, onDragOver, onDrop }) => (
  <div>
    {tasks.map((task, index) => (
      <TaskItem
        key={task.id}
        task={task}
        index={index}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-300 text-6xl mb-4">📝</div>
    <p className="text-gray-500 text-lg">No tasks found</p>
    <p className="text-gray-400">Add a new task or try a different filter</p>
  </div>
);

const TaskForm = ({ onSubmit, onCancel, title, setTitle, isEditing }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input
      label="Task Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      autoFocus
      placeholder="Enter task title"
    />
    <div className="flex justify-end space-x-2 mt-4">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700">
        {isEditing ? "Update" : "Add"} Task
      </Button>
    </div>
  </form>
);

const LocalTasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [draggedItem, setDraggedItem] = useState(null);
  
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.localTasks);
  const currentFilter = useSelector(state => state.tasks.filter);

  useEffect(() => {
    dispatch(loadLocalTasks());
  }, [dispatch]);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
    return true;
  });

  // Search functionality
  const searchedTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort functionality - by order by default
  const sortedTasks = [...searchedTasks].sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'status') {
      return sortOrder === 'asc'
        ? (a.completed === b.completed ? 0 : a.completed ? -1 : 1)
        : (a.completed === b.completed ? 0 : a.completed ? 1 : -1);
    } else if (sortBy === 'createdAt') {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      // Default sort by order
      return sortOrder === 'asc'
        ? (a.order || 0) - (b.order || 0)
        : (b.order || 0) - (a.order || 0);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      dispatch(updateLocalTask(editingTask.id, { title }));
      Swal.fire("Updated!", "Task has been updated.", "success");
    } else {
      const newTask = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
        order: tasks.length // Set order to the end of the list
      };
      dispatch(addLocalTask(newTask));
      Swal.fire("Added!", "Task has been added.", "success");
    }
    setTitle('');
    setEditingTask(null);
    setShowModal(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setShowModal(true);
  };

  const handleDelete = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5CF6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLocalTask(taskId));
        Swal.fire("Deleted!", "Task has been deleted.", "success");
      }
    });
  };

  const handleToggleComplete = (taskId, completed) => {
    dispatch(updateLocalTask(taskId, { completed }));
    const status = completed ? "completed" : "pending";
    Swal.fire("Updated!", `Task marked as ${status}.`, "success");
  };

  const handleFilterChange = (newFilter) => {
    dispatch({ type: 'SET_FILTER', payload: newFilter });
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Drag and Drop handlers with persistence
  const handleDragStart = (e, index) => {
    setDraggedItem(sortedTasks[index]);
    e.dataTransfer.effectAllowed = "move";
    e.target.classList.add("bg-purple-50", "border-purple-300");
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    const targetElement = e.currentTarget;
    targetElement.classList.add("bg-gray-100");
    
    setTimeout(() => {
      targetElement.classList.remove("bg-gray-100");
    }, 200);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (draggedItem) {
      const currentIndex = tasks.findIndex(task => task.id === draggedItem.id);
      if (currentIndex === targetIndex) return;
      
      // Create a new array with reordered tasks
      const reorderedTasks = [...tasks];
      
      // Remove the dragged item from its original position
      reorderedTasks.splice(currentIndex, 1);
      
      // Insert the dragged item at the target position
      reorderedTasks.splice(targetIndex, 0, draggedItem);
      
      // Update the order property for all tasks
      const tasksWithUpdatedOrder = reorderedTasks.map((task, index) => ({
        ...task,
        order: index
      }));
      
      // Dispatch the reorder action
      dispatch(reorderLocalTasks(tasksWithUpdatedOrder));
    }
    
    e.target.classList.remove("bg-purple-50", "border-purple-300");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Local Tasks Manager</title>
        <meta
          name="description"
          content="Manage your local tasks with drag and drop functionality"
        />
      </Helmet>

      <div className=" mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Local Tasks</h1>
              <p className="text-gray-600 mt-1">Manage your local tasks efficiently</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg shadow-sm"
            >
              <FaPlus className="w-4 h-4" /> Add Task
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Input
                  label="Search Tasks"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
                <div className="flex space-x-2">
                  <Button
                    variant={currentFilter === 'all' ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handleFilterChange('all')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <FaFilter className="w-3 h-3 mr-1" /> All
                  </Button>
                  <Button
                    variant={currentFilter === 'completed' ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handleFilterChange('completed')}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={currentFilter === 'pending' ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handleFilterChange('pending')}
                  >
                    Pending
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <div className="flex space-x-2">
                  <Button
                    variant={sortBy === 'order' ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handleSortChange('order')}
                  >
                    <FaSort className="w-3 h-3 mr-1" /> 
                    Order {sortBy === 'order' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Button>
                  <Button
                    variant={sortBy === 'title' ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handleSortChange('title')}
                  >
                    Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Button>
                  <Button
                    variant={sortBy === 'createdAt' ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handleSortChange('createdAt')}
                  >
                    Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              {sortedTasks.length === 0 ? (
                <EmptyState />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Your Tasks ({sortedTasks.length})</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaSort className="mr-1 w-3 h-3" />
                      <span>Drag to reorder</span>
                    </div>
                  </div>
                  <TasksList
                    tasks={sortedTasks}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingTask ? "Edit Task" : "Add New Task"}
        >
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            title={title}
            setTitle={setTitle}
            isEditing={!!editingTask}
          />
        </Modal>
      </div>
    </div>
  );
};

export default LocalTasks;