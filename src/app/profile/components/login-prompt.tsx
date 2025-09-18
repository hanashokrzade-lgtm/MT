'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-provider";
import { Loader2 } from "lucide-react";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.536-11.088-8.264l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.61,44,29.613,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>
    );
}

export function LoginPrompt() {
    const { signInWithGoogle } = useAuth();
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const { toast } = useToast();

    const handleSignIn = async () => {
        setIsButtonLoading(true);
        try {
            await signInWithGoogle();
            // In popup mode, this will run. In redirect mode, the page will navigate away.
            // A toast is shown in the provider for popup and redirect scenarios.
        } catch (error: any) {
            console.error("Authentication Error: ", error);
            let description = 'متاسفانه مشکلی در فرآیند ورود با گوگل پیش آمد.';
            if (error.code === 'auth/unauthorized-domain') {
                description = 'دامنه شما برای ورود مجاز نیست. لطفاً با پشتیبانی تماس بگیرید.'
            } else if (error.code === 'auth/popup-closed-by-user') {
                description = 'پنجره ورود توسط شما بسته شد. لطفاً دوباره تلاش کنید.'
            } else if (error.code) { // Catch other firebase errors
                 description = `هدایت به صفحه گوگل با مشکل مواجه شد. (${error.code})`
            }
            toast({
                title: 'خطا در ورود',
                description: description,
                variant: 'destructive',
            });
        } finally {
            // This is crucial for redirect failures or popup closes
            setIsButtonLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <div className="max-w-md w-full">
                <h2 className="text-3xl font-bold tracking-tighter text-primary font-headline mb-4">
                    به پروفایل خود وارد شوید
                </h2>
                <p className="text-muted-foreground mb-8">
                    برای دسترسی به مشاوره‌های ذخیره شده، پیگیری پیشرفت و دریافت پیشنهادهای شخصی‌سازی شده، وارد حساب کاربری خود شوید.
                </p>
                
                <Button onClick={handleSignIn} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isButtonLoading}>
                    {isButtonLoading ? (
                         <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    ) : (
                        <GoogleIcon className="ml-2 h-5 w-5" />
                    )}
                   {isButtonLoading ? 'در حال هدایت...' : 'ورود با حساب کاربری گوگل'}
                </Button>

                 <p className="text-xs text-muted-foreground mt-4">
                    با ورود، شما با شرایط و قوانین ما موافقت می‌کنید.
                </p>
            </div>
        </div>
    );
}
