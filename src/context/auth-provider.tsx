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
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsLoading(true);
    let unsubscribe: () => void = () => {};
    try {
        const app = getFirebaseApp();
        const authInstance = getAuth(app);
        setAuth(authInstance);

        unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        });

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
                console.error("Redirect Result Error: ", error);
                toast({
                    title: 'خطا در ورود',
                    description: 'مشکلی در فرآیند ورود با گوگل پیش آمد.',
                    variant: 'destructive',
                });
            })
            .finally(() => {
                // This is crucial for initial load on mobile after redirect
                setIsLoading(false);
            });

    } catch (error) {
        console.error("Firebase initialization error:", error);
        toast({
            title: 'خطای حیاتی در اتصال به سرور',
            description: 'امکان اتصال به سرویس‌های برنامه وجود ندارد. لطفاً صفحه را مجدداً بارگذاری کنید.',
            variant: 'destructive',
        });
        setIsLoading(false);
    }
    
    // Fallback to stop loading after a timeout
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 5000);

    return () => {
        unsubscribe();
        clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;

    const provider = new GoogleAuthProvider();
    
    if (isMobile) {
        // Redirect is better for mobile
        setIsLoading(true); // Show loading indicator before redirecting
        await signInWithRedirect(auth, provider).catch((error) => {
            console.error("Redirect Error: ", error);
             toast({
                title: 'خطا در ورود',
                description: 'هدایت به صفحه گوگل با مشکل مواجه شد.',
                variant: 'destructive',
            });
            setIsLoading(false); // Ensure loading is stopped on error
        });
    } else {
        // Popup is a better UX on desktop
        setIsLoading(true);
        try {
            await signInWithPopup(auth, provider);
            toast({
                title: 'ورود موفق',
                description: 'شما با موفقیت وارد حساب کاربری خود شدید.',
            });
        } catch (error: any) {
            console.error("Authentication Error: ", error);
            let description = 'متاسفانه مشکلی در فرآیند ورود با گوگل پیش آمد.';
            if (error.code === 'auth/unauthorized-domain') {
                description = 'دامنه شما برای ورود مجاز نیست. لطفاً با پشتیبانی تماس بگیرید.'
            } else if (error.code === 'auth/popup-closed-by-user') {
                description = 'پنجره ورود توسط شما بسته شد. لطفاً دوباره تلاش کنید.'
            }
            toast({
                title: 'خطا در ورود',
                description: description,
                variant: 'destructive',
            });
        } finally {
            // This is crucial: always stop loading, whether it succeeds or fails.
            setIsLoading(false);
        }
    }
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

  const value = {
    user,
    isLoading,
    signInWithGoogle,
    signOut,
  };

  if (isLoading && user === null) {
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
