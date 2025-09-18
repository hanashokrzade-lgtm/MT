'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut as firebaseSignOut, User, Auth } from 'firebase/auth';
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
        const app = getFirebaseApp();
        const authInstance = getAuth(app);
        setAuth(authInstance);

        const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        });
        
        setIsFirebaseInitialized(true);

        return () => unsubscribe();
    } catch (error) {
        console.error("Firebase initialization error:", error);
        toast({
            title: 'خطای حیاتی در اتصال به سرور',
            description: 'امکان اتصال به سرویس‌های برنامه وجود ندارد. لطفاً صفحه را مجدداً بارگذاری کنید.',
            variant: 'destructive',
        });
        setIsLoading(false);
        setIsFirebaseInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'ورود موفق',
        description: 'شما با موفقیت وارد حساب کاربری خود شدید.',
      });
    } catch (error: any) {
      console.error("Authentication Error: ", error);
      toast({
        title: 'خطا در ورود',
        description: 'متاسفانه مشکلی در فرآیند ورود با گوگل پیش آمد.',
        variant: 'destructive',
      });
      // If sign in fails, we should stop loading.
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    setIsLoading(true);
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
    } finally {
      // onAuthStateChanged will handle setting the user and isLoading.
      // No need to setIsLoading(false) here as it might cause a flicker.
    }
  };

  const value = {
    user,
    isLoading,
    signInWithGoogle,
    signOut,
  };

  if (!isFirebaseInitialized || (isLoading && !user)) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">در حال آماده‌سازی...</p>
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
