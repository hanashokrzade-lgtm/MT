'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut as firebaseSignOut, User, Auth, getRedirectResult, signInWithPopup } from 'firebase/auth';
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
  isAuthLoading: boolean; // Renamed to be specific to initial auth state loading
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Represents initial auth check
  const [auth, setAuth] = useState<Auth | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    try {
        const app = getFirebaseApp();
        const authInstance = getAuth(app);
        setAuth(authInstance);

        unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
          setUser(currentUser);
          setIsAuthLoading(false);
        });

        // Handle redirect result on initial load
        getRedirectResult(authInstance)
            .then((result) => {
                if (result) {
                    toast({
                        title: 'ورود موفق',
                        description: 'شما با موفقیت وارد حساب کاربری خود شدید.',
                    });
                }
            })
            .catch((error) => {
                // This error is often benign, e.g., if the user just loads the page
                // without coming from a redirect. We'll log it but not show a toast.
                console.error("Redirect Result Error: ", error);
            });

    } catch (error) {
        console.error("Firebase initialization error:", error);
        toast({
            title: 'خطای حیاتی در اتصال به سرور',
            description: 'امکان اتصال به سرویس‌های برنامه وجود ندارد. لطفاً صفحه را مجدداً بارگذاری کنید.',
            variant: 'destructive',
        });
        setIsAuthLoading(false);
    }

    return () => {
        unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    if (!auth) {
        throw new Error("سرویس احراز هویت هنوز آماده نیست.");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    toast({
        title: 'ورود موفق',
        description: 'شما با موفقیت وارد حساب کاربری خود شدید.',
    });
    return result.user;
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
    signOut,
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
