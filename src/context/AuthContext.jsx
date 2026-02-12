import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch additional details (role) from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setCurrentUser({ ...user, ...userData });
          setUserRole(userData.role || 'user');
        } else {
          // Fallback if user exists in Auth but not Firestore (shouldn't happen ideally)
          setCurrentUser(user);
          setUserRole('user');
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // --- LOGIN FUNCTION ---
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Role will be set by the onAuthStateChanged listener
      return userCredential.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  // --- SIGNUP FUNCTION ---
  const signup = async (name, email, password, role = 'user') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create User Document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: role,
        createdAt: new Date().toISOString()
      });

      return user;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
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