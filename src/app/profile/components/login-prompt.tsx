'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-provider";
import { Loader2, KeyRound, Mail, User } from "lucide-react";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { AuthError } from "firebase/auth";

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

const loginSchema = z.object({
    email: z.string().email({ message: "لطفاً یک ایمیل معتبر وارد کنید." }),
    password: z.string().min(1, { message: "لطفاً رمز عبور خود را وارد کنید." }),
});

const registerSchema = z.object({
    name: z.string().min(2, { message: "نام باید حداقل ۲ کاراکتر باشد." }),
    email: z.string().email({ message: "لطفاً یک ایمیل معتبر وارد کنید." }),
    password: z.string().min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد." }),
});

export function LoginPrompt() {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("login");

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });
    
    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const handleAuthError = (error: AuthError) => {
        let title = "خطا در احراز هویت";
        let description = "مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.";

        switch (error.code) {
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
                return; // Don't show a destructive toast for this
            default:
                description = `یک خطای ناشناخته رخ داد: ${error.message}`;
        }
        
        toast({
            title,
            description,
            variant: "destructive",
        });
    }

    const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        try {
            await signInWithEmail(values.email, values.password);
            toast({
                title: "ورود موفق",
                description: "شما با موفقیت وارد حساب کاربری خود شدید.",
            });
        } catch (error) {
            handleAuthError(error as AuthError);
        } finally {
            setIsLoading(false);
        }
    };
    
    const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
        setIsLoading(true);
        try {
            await signUpWithEmail(values.name, values.email, values.password);
             toast({
                title: "ثبت‌نام موفق",
                description: "حساب کاربری شما با موفقیت ایجاد شد و وارد شدید.",
            });
        } catch (error) {
            handleAuthError(error as AuthError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signInWithGoogle();
             toast({
                title: 'ورود موفق',
                description: 'شما با موفقیت وارد حساب کاربری خود شدید.',
            });
        } catch (error) {
            handleAuthError(error as AuthError);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8 h-full">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tighter text-primary font-headline">
                         به پروفایل خود دسترسی پیدا کنید
                    </CardTitle>
                    <CardDescription>
                        برای دسترسی به تاریخچه و امکانات شخصی‌سازی شده، وارد شوید یا ثبت‌نام کنید.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">ورود</TabsTrigger>
                            <TabsTrigger value="register">ثبت نام</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4 text-right">
                                    <FormField
                                        control={loginForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ایمیل</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="email@example.com" {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>رمز عبور</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                        ورود به حساب کاربری
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                        <TabsContent value="register">
                            <Form {...registerForm}>
                                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 pt-4 text-right">
                                    <FormField
                                        control={registerForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>نام</FormLabel>
                                                <FormControl>
                                                     <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="نام و نام خانوادگی" {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ایمیل</FormLabel>
                                                <FormControl>
                                                     <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="email@example.com" {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>رمز عبور</FormLabel>
                                                <FormControl>
                                                     <div className="relative">
                                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input type="password" placeholder="حداقل ۶ کاراکتر" {...field} className="pl-10" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                         {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                        ایجاد حساب کاربری جدید
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                    
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                یا ادامه با
                            </span>
                        </div>
                    </div>

                    <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isGoogleLoading}>
                        {isGoogleLoading ? (
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        ) : (
                            <GoogleIcon className="ml-2 h-5 w-5" />
                        )}
                        {isGoogleLoading ? 'در حال هدایت...' : 'ورود با حساب کاربری گوگل'}
                    </Button>
                </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
                با ورود یا ثبت‌نام، شما با شرایط و قوانین و سیاست حفظ حریم خصوصی ما موافقت می‌کنید.
            </p>
        </div>
    );
}
