import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, hasFirebaseConfig } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | { uid: string, email: string } | null;
  loading: boolean;
  loginDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  loginDemo: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      // Demo Mode
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginDemo = () => {
    setCurrentUser({ uid: 'demo-123', email: 'client@example.com' });
  };

  const logout = async () => {
    try {
      if (hasFirebaseConfig && auth) {
        await signOut(auth);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, loginDemo, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

