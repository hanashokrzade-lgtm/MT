'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User, 
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type UserCredential,
  type AuthError
} from 'firebase/auth';
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { useToast } from '@/hooks/use-toast';
import { LoadingLogo } from '@/components/layout/loading-logo';
import { useIsMobile } from '@/hooks/use-mobile';


// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-7643117538-ce531",
  "appId": "1:1015243920281:web:d3f61595aa3e65c57e7908",
  "storageBucket": "studio-7643117538-ce531.firebasestorage.app",
  "apiKey": "AIzaSyD6bPwUGV-CSAglHG6rUgrMg7KdEb9NBrY",
  "authDomain": "studio-7643117538-ce531.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1015243920281"
};

// Initialize Firebase using a singleton pattern
function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<UserCredential>;
  signInWithEmail: (email: string, pass: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  auth: Auth | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const app = getFirebaseApp();
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    if (!auth) {
      throw new Error("سرویس احراز هویت هنوز آماده نیست.");
    }
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };
  
  const signUpWithEmail = async (name: string, email: string, pass: string): Promise<UserCredential> => {
    if (!auth) {
      throw new Error("سرویس احراز هویت هنوز آماده نیست.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    // Manually refetch the user to get the updated profile
    await userCredential.user.reload();
    // Update the local user state
    setUser(auth.currentUser);
    return userCredential;
  };
  
  const signInWithEmail = async (email: string, pass: string): Promise<UserCredential> => {
    if (!auth) {
      throw new Error("سرویس احراز هویت هنوز آماده نیست.");
    }
    return await signInWithEmailAndPassword(auth, email, pass);
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      toast({
        title: 'خروج موفق',
        description: 'شما با موفقیت از حساب خود خارج شدید.',
      });
    } catch (error) {
       console.error("Sign Out Error: ", error);
      toast({
        title: 'خطا در خروج',
        description: 'متاسفانه مشکلی در فرآیند خروج پیش آمد.',
        variant: 'destructive',
      });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthLoading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    auth,
  };
  
  if (isAuthLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            <LoadingLogo />
        </div>
      )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
