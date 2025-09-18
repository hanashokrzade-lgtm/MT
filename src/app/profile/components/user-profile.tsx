'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, ChevronRight, HelpCircle, Shield } from "lucide-react";
import { useAuth } from "@/context/auth-provider";

export function UserProfile() {
    const { user, signOut } = useAuth();

    return (
        <div className="container py-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-4 mb-8">
                <Avatar className="h-24 w-24 border-4 border-primary/50">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                    <AvatarFallback>
                        <User className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">{user?.displayName || 'کاربر مهمان'}</h2>
                    <p className="text-muted-foreground">{user?.email || 'ایمیل ثبت نشده'}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>تنظیمات حساب کاربری</CardTitle>
                    <CardDescription>اطلاعات و تنظیمات حساب خود را مدیریت کنید.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <button className="flex justify-between items-center w-full p-3 rounded-lg hover:bg-accent/50 transition-colors text-right">
                        <div className="flex items-center gap-3">
                            <Settings className="h-5 w-5 text-primary" />
                            <span>تنظیمات کلی</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="flex justify-between items-center w-full p-3 rounded-lg hover:bg-accent/50 transition-colors text-right">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <span>حریم خصوصی و امنیت</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="flex justify-between items-center w-full p-3 rounded-lg hover:bg-accent/50 transition-colors text-right">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            <span>راهنما و پشتیبانی</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                </CardContent>
            </Card>
            
            <div className="mt-8">
                <Button variant="destructive" onClick={signOut} className="w-full">
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج از حساب کاربری
                </Button>
            </div>
        </div>
    );
}
