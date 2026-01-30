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
  type AuthError
} from 'firebase/auth';
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { useToast } from '@/hooks/use-toast';
import { LoadingLogo } from '@/components/layout/loading-logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy, Flame } from 'lucide-react';

// Function to generate the Firebase config dynamically
const getFirebaseConfig = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  // Use custom domain if not on localhost and not already on a firebase domain
  const useCustomDomain = hostname && !hostname.includes('localhost') && !hostname.includes('firebaseapp.com') && !hostname.includes('web.app');
  
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: useCustomDomain ? hostname : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
};

// Initialize Firebase using a singleton pattern
function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(getFirebaseConfig());
    }
    return getApp();
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  auth: Auth | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function MissingConfigError() {
  const [hasCopied, setHasCopied] = useState(false);

  const envVars = `
GEMINI_API_KEY="AIzaSyB_x6BoZ2_gWGpWIDodR3I6kq9RslTn3Bo"
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyD6bPwUGV-CSAglHG6rUgrMg7KdEb9NBrY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="studio-7643117538-ce531.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="studio-7643117538-ce531"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="studio-7643117538-ce531.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1015243920281"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1015243920281:web:d3f61595aa3e65c57e7908"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""
  `.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envVars).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Flame className="text-destructive" />
            پیکربندی Firebase یافت نشد!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>اقدام مورد نیاز</AlertTitle>
            <AlertDescription>
              برنامه شما برای اتصال به سرویس‌های گوگل (مانند ورود) به این کلیدها نیاز دارد. به نظر می‌رسد این متغیرها در محیط استقرار شما (مانند Vercel) تنظیم نشده‌اند.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              لطفاً مراحل زیر را دنبال کنید:
            </p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>مقادیر زیر را با کلیک بر روی دکمه "کپی" کپی کنید.</li>
              <li>به داشبورد پروژه خود در Vercel بروید.</li>
              <li>به بخش <code className="bg-muted p-1 rounded-sm">Settings > Environment Variables</code> بروید.</li>
              <li>مقادیر کپی شده را در آنجا پیست کنید و ذخیره نمایید.</li>
              <li>پروژه خود را دوباره مستقر کنید (Redeploy).</li>
            </ol>
          </div>
          <div className="relative rounded-md bg-muted p-4 font-mono text-xs text-foreground/80">
            <pre className="whitespace-pre-wrap">{envVars}</pre>
            <Button
              size="icon"
              variant="outline"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={copyToClipboard}
            >
              {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [configError, setConfigError] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const config = getFirebaseConfig();
    if (!config.apiKey || config.apiKey.includes('YOUR_API_KEY')) {
        console.error("Firebase config is missing. Environment variables are likely not set.");
        setConfigError(true);
        setIsAuthLoading(false);
        return;
    }

    try {
      const app = getFirebaseApp();
      const authInstance = getAuth(app);
      setAuth(authInstance);

      const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
        setUser(currentUser);
        setIsAuthLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setIsAuthLoading(false);
    }
  }, []);

  const handleAuthError = (error: AuthError) => {
        let title = "خطا در احراز هویت";
        let description = "مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.";

        switch (error.code) {
            case 'auth/unauthorized-domain':
                title = "دامنه غیرمجاز";
                description = "دامنه این سایت در لیست دامنه‌های مجاز Firebase ثبت نشده است. لطفاً آن را در کنسول Firebase اضافه کنید.";
                break;
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                title = "ایمیل یا رمز عبور اشتباه است";
                description = "لطفاً اطلاعات وارد شده را بررسی کرده و دوباره تلاش کنید.";
                break;
            case 'auth/email-already-in-use':
                title = "ایمیل تکراری است";
                description = "این ایمیل قبلاً ثبت‌نام کرده است. لطفاً از بخش ورود استفاده کنید یا با ایمیل دیگری تلاش کنید.";
                break;
            case 'auth/weak-password':
                title = "رمز عبور ضعیف است";
                description = "رمز عبور شما باید حداقل ۶ کاراکتر باشد.";
                break;
             case 'auth/invalid-email':
                title = "ایمیل نامعتبر است";
                description = "لطفاً یک آدرس ایمیل صحیح وارد کنید.";
                break;
            case 'auth/popup-closed-by-user':
                title = "پنجره ورود بسته شد";
                description = "شما پنجره ورود با گوگل را بستید. لطفاً دوباره تلاش کنید.";
                toast({ title, description });
                return; 
            default:
                description = `یک خطای ناشناخته رخ داد: ${error.message}`;
        }
        
        toast({
            title,
            description,
            variant: "destructive",
        });
  }

  const signInWithGoogle = async (): Promise<void> => {
    if (!auth) {
      throw new Error("سرویس احراز هویت هنوز آماده نیست.");
    }
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        toast({
            title: 'ورود موفق',
            description: 'شما با موفقیت وارد حساب کاربری خود شدید.',
        });
    } catch(error) {
        handleAuthError(error as AuthError);
    }
  };
  
  const signUpWithEmail = async (name: string, email: string, pass: string): Promise<void> => {
    if (!auth) {
      throw new Error("سرویس احراز هویت هنوز آماده نیست.");
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name });
            await auth.currentUser.reload();
            setUser(auth.currentUser);
        }
        toast({
            title: "ثبت‌نام موفق",
            description: "حساب کاربری شما با موفقیت ایجاد شد و وارد شدید.",
        });
    } catch (error) {
        handleAuthError(error as AuthError);
    }
  };
  
  const signInWithEmail = async (email: string, pass: string): Promise<void> => {
    if (!auth) {
      throw new Error("سرویس احراز هویت هنوز آماده نیست.");
    }
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        toast({
            title: "ورود موفق",
            description: "شما با موفقیت وارد حساب کاربری خود شدید.",
        });
    } catch (error) {
        handleAuthError(error as AuthError);
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

  const value: AuthContextType = {
    user,
    isAuthLoading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    auth,
  };
  
  if (configError) {
      return <MissingConfigError />;
  }

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
