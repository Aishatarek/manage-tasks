import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/actions/authActions';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import TaskDetails from './pages/TaskDetails/TaskDetails';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard/*" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/task/:completed/:taskId" 
            element={isAuthenticated ? <TaskDetails /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;