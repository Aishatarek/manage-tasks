// redux/actions/taskActions.js
import axios from "axios";

const API_URL = "https://63c44317a90856357534792c.mockapi.io/todos";

// -------- Local Tasks Actions --------
export const loadLocalTasks = () => {
  return (dispatch) => {
    const tasks = JSON.parse(localStorage.getItem("localTasks")) || [];
    dispatch({ type: "LOAD_LOCAL_TASKS", payload: tasks });
  };
};

export const addLocalTask = (task) => {
  return (dispatch, getState) => {
    const tasks = [...getState().tasks.localTasks, task];
    localStorage.setItem("localTasks", JSON.stringify(tasks));
    dispatch({ type: "ADD_LOCAL_TASK", payload: task });
  };
};

export const updateLocalTask = (taskId, updates) => {
  return (dispatch, getState) => {
    const tasks = getState().tasks.localTasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    localStorage.setItem("localTasks", JSON.stringify(tasks));
    dispatch({ type: "UPDATE_LOCAL_TASK", payload: { taskId, updates } });
  };
};

export const deleteLocalTask = (taskId) => {
  return (dispatch, getState) => {
    const tasks = getState().tasks.localTasks.filter(
      (task) => task.id !== taskId
    );
    localStorage.setItem("localTasks", JSON.stringify(tasks));
    dispatch({ type: "DELETE_LOCAL_TASK", payload: taskId });
  };
};

export const reorderLocalTasks = (tasks) => {
  return (dispatch) => {
    localStorage.setItem("localTasks", JSON.stringify(tasks));
    dispatch({ type: "REORDER_LOCAL_TASKS", payload: tasks });
  };
};

// -------- API Tasks Actions (لو عايز تحتفظ بيها للتجربة) --------
export const fetchApiTasks = (searchTerm = "") => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_API_TASKS_REQUEST" });
    try {
      const url = `${API_URL}${searchTerm ? `?title=${searchTerm}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch({ type: "FETCH_API_TASKS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_API_TASKS_FAILURE", payload: error.message });
    }
  };
};

export const addApiTask = (task) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(API_URL, task);
      dispatch({ type: "ADD_API_TASK", payload: response.data });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
};

export const updateApiTask = (taskId, updates) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${API_URL}/${taskId}`, updates);
      dispatch({ type: "UPDATE_API_TASK", payload: response.data });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
};

export const deleteApiTask = (taskId) => {
  return async (dispatch) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      dispatch({ type: "DELETE_API_TASK", payload: taskId });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
};
