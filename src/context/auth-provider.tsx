'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
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
    } finally {
        // A short delay to allow firebase to update auth state
        setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const signOut = async () => {
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
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
