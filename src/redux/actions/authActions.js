export const login = (username, password) => {
    return (dispatch) => {
      // Mock authentication
      if (username === 'admin' && password === '1234') {
        const user = { username, isAuthenticated: true };
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid credentials' });
      }
    };
  };
  
  export const logout = () => {
    return (dispatch) => {
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    };
  };
  
  export const checkAuth = () => {
    return (dispatch) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.isAuthenticated) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    };
  };