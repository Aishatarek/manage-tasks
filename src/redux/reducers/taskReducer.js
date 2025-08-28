// redux/reducers/taskReducer.js
const initialState = {
  localTasks: [],
  apiTasks: [],
  loading: false,
  error: null,
  filter: "all", // 'all', 'completed', 'pending'
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    // -------- Local Tasks --------
    case "LOAD_LOCAL_TASKS":
      return { ...state, localTasks: action.payload };

    case "ADD_LOCAL_TASK":
      return { ...state, localTasks: [...state.localTasks, action.payload] };

    case "UPDATE_LOCAL_TASK":
      return {
        ...state,
        localTasks: state.localTasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case "DELETE_LOCAL_TASK":
      return {
        ...state,
        localTasks: state.localTasks.filter(
          (task) => task.id !== action.payload
        ),
      };

    case "REORDER_LOCAL_TASKS":
      return { ...state, localTasks: action.payload };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    // -------- API Tasks --------
    case "FETCH_API_TASKS_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_API_TASKS_SUCCESS":
      return { ...state, loading: false, apiTasks: action.payload, error: null };

    case "FETCH_API_TASKS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "ADD_API_TASK":
      return { ...state, apiTasks: [...state.apiTasks, action.payload] };

    case "UPDATE_API_TASK":
      return {
        ...state,
        apiTasks: state.apiTasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case "DELETE_API_TASK":
      return {
        ...state,
        apiTasks: state.apiTasks.filter((task) => task.id !== action.payload),
      };

    default:
      return state;
  }
};

export default taskReducer;
