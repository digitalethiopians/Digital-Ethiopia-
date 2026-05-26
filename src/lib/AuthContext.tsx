import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { checkAdminStatus, syncUser } from './firestoreService';
import { Language } from './translations';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isAdmin: false, 
  loading: true, 
  language: 'en',
  setLanguage: () => {} 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[AuthContext] State changed:', user?.email, user?.uid);
      setUser(user);
      if (user) {
        const adminStatus = await checkAdminStatus(user);
        console.log('[AuthContext] Admin status:', adminStatus);
        setIsAdmin(adminStatus);
        
        // Use try-catch for syncUser as it might have permission issues on first login
        try {
          await syncUser(user);
        } catch (err) {
          console.warn('[AuthContext] syncUser failed:', err);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, language, setLanguage }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
