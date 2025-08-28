import { createStore, applyMiddleware, combineReducers } from 'redux';
import  {thunk}  from 'redux-thunk'; 
import { authReducer, taskReducer } from './reducers';

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
