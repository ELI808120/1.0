
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// FIX: Switch from Netlify Identity to Firebase Authentication.
import { firebaseServicesPromise } from '../firebase';
import type { Auth, User } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';

// FIX: Define a new AuthContextType for Firebase Auth.
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    // FIX: Initialize Firebase and set up an auth state listener.
    firebaseServicesPromise.then(({ auth, db }) => {
      setAuth(auth);
      setDb(db);
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          // Fetch user profile from Firestore upon login.
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create a profile for new users (e.g., after signup).
            const newProfile: UserProfile = { hasPaid: false };
            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }).catch(err => {
        console.error("Firebase initialization failed:", err);
        setLoading(false);
    });
  }, []);

  // FIX: Implement login with Firebase email/password authentication.
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth not initialized");
    await signInWithEmailAndPassword(auth, email, password);
  };

  // FIX: Implement signup with Firebase email/password authentication.
  const signup = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth not initialized");
    await createUserWithEmailAndPassword(auth, email, password);
    // The onAuthStateChanged listener will handle creating the user profile.
  };

  const logout = async () => {
    if (!auth) throw new Error("Auth not initialized");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};