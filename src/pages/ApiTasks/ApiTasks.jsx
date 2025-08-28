import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchApiTasks,
  addApiTask,
  updateApiTask,
  deleteApiTask,
} from "../../redux/actions/taskActions";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import { Helmet } from "react-helmet";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaGripLines,
  FaCheckCircle,
  FaRegCircle,
  FaSort,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  completed: z.boolean().default(false),
});

const TaskItem = React.memo(
  ({
    task,
    index,
    onToggleComplete,
    onEdit,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop,
  }) => (
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
        <div className="mr-3 text-gray-400 hover:text-purple-500 cursor-grab p-2 rounded-lg hover:bg-purple-50">
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
          <p
            className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
              task.completed
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
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

const TasksList = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) => (
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
    <p className="text-gray-400">
      Add a new task or try a different search term
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4">
    <h3 className="text-red-800 font-medium">Error loading tasks</h3>
    <p className="text-red-600">{error}</p>
    <Button
      variant="primary"
      className="mt-2 bg-purple-600 hover:bg-purple-700"
      onClick={onRetry}
    >
      Try Again
    </Button>
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
      <Button
        type="submit"
        variant="primary"
        className="bg-purple-600 hover:bg-purple-700"
      >
        {isEditing ? "Update" : "Add"} Task
      </Button>
    </div>
  </form>
);

const ApiTasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localTasks, setLocalTasks] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  const dispatch = useDispatch();
  const { apiTasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    const savedTasks = localStorage.getItem("reorderedTasks");
    if (savedTasks && apiTasks && apiTasks.length > 0) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const mergedTasks = apiTasks
          .map((apiTask) => {
            const savedTask = parsedTasks.find((t) => t.id === apiTask.id);
            return savedTask ? { ...apiTask, order: savedTask.order } : apiTask;
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setLocalTasks(mergedTasks);
      } catch (e) {
        console.error("Error parsing saved tasks:", e);
        setLocalTasks(apiTasks);
      }
    } else if (apiTasks && apiTasks.length > 0) {
      setLocalTasks(apiTasks);
    }
  }, [apiTasks]);

  const executeSearch = useCallback(
    debounce((term) => {
      dispatch(fetchApiTasks(term));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchApiTasks());
  }, [dispatch]);

  useEffect(() => {
    executeSearch(searchTerm);
  }, [searchTerm, executeSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      taskSchema.parse({ title });

      if (editingTask) {
        await dispatch(updateApiTask(editingTask.id, { title }));
        Swal.fire("Updated!", "Task has been updated.", "success");
      } else {
        await dispatch(addApiTask({ title, completed: false }));
        Swal.fire("Added!", "Task has been added.", "success");
      }

      setTitle("");
      setEditingTask(null);
      setShowModal(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        Swal.fire("Error", err.errors[0].message, "error");
      } else {
        Swal.fire("Error", "An error occurred while saving the task.", "error");
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5CF6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteApiTask(taskId));
        const savedTasks = localStorage.getItem("reorderedTasks");
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          const updatedTasks = parsedTasks.filter((task) => task.id !== taskId);
          localStorage.setItem("reorderedTasks", JSON.stringify(updatedTasks));
        }
        Swal.fire("Deleted!", "Task has been deleted.", "success");
      } catch (err) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the task.",
          "error"
        );
      }
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await dispatch(updateApiTask(taskId, { completed }));
      const status = completed ? "completed" : "pending";
      Swal.fire("Updated!", `Task marked as ${status}.`, "success");
    } catch (err) {
      Swal.fire("Error", "An error occurred while updating the task.", "error");
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(localTasks[index]);
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
      const items = [...localTasks];
      const draggedIndex = items.findIndex(
        (item) => item.id === draggedItem.id
      );

      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);

      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      setLocalTasks(updatedItems);
      localStorage.setItem("reorderedTasks", JSON.stringify(updatedItems));
      setDraggedItem(null);
    }

    e.target.classList.remove("bg-purple-50", "border-purple-300");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setTitle("");
  };

  const handleRetry = () => {
    dispatch(fetchApiTasks());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>API Tasks Manager</title>
        <meta
          name="description"
          content="Manage your API tasks with drag and drop functionality"
        />
      </Helmet>

      <div className="mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
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
            <div className="mb-6">
              <div className="relative">
                <Input
                  label="Search Tasks"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-100"
                />
              </div>
            </div>

            <div>
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={handleRetry} />
              ) : localTasks.length === 0 ? (
                <EmptyState />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaSort className="mr-1 w-3 h-3" />
                      <span>Drag to reorder</span>
                    </div>
                  </div>
                  <TasksList
                    tasks={localTasks}
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

export default ApiTasks;
