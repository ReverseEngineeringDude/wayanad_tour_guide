import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from LocalStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const storedRole = localStorage.getItem('mockRole');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setUserRole(storedRole);
    }
    setLoading(false);
  }, []);

  // --- DUMMY LOGIN FUNCTION ---
  const login = (email, password) => {
    let user = null;
    let role = 'user';

    // 1. Check for Hardcoded Admin
    if (email === 'admin@wayanad.com' && password === 'admin123') {
      user = { uid: 'admin1', email, displayName: 'Super Admin' };
      role = 'admin';
    } 
    // 2. Check for Hardcoded Guide
    else if (email === 'guide@wayanad.com' && password === 'guide123') {
      user = { uid: 'guide1', email, displayName: 'Rahul Guide' };
      role = 'guide';
    } 
    // 3. Check for Normal User (Simulated)
    else {
      // For demo, we accept any other login as a "User" if they signed up previously
      // Or just allow generic login for testing:
      user = { uid: 'user' + Date.now(), email, displayName: email.split('@')[0] };
      role = 'user';
    }

    // Save to State & LocalStorage
    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockRole', role);
    return role; // Return role so Login page knows where to redirect
  };

  // --- DUMMY SIGNUP FUNCTION ---
  const signup = (name, email, password) => {
    const newUser = { uid: 'user' + Date.now(), email, displayName: name };
    
    // Auto-login after signup
    setCurrentUser(newUser);
    setUserRole('user');
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    localStorage.setItem('mockRole', 'user');
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockRole');
  };

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};