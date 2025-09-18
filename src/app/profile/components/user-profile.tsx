'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, ChevronRight, HelpCircle, Shield, Moon, Sun, Laptop, Trash2, Bell } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
                    <Dialog>
                        <DialogTrigger asChild>
                             <button className="flex justify-between items-center w-full p-3 rounded-lg hover:bg-accent/50 transition-colors text-right">
                                <div className="flex items-center gap-3">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <span>تنظیمات کلی</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>تنظیمات کلی</DialogTitle>
                                <DialogDescription>
                                    تنظیمات مربوط به ظاهر برنامه، داده‌ها و اعلان‌ها را مدیریت کنید.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="space-y-4">
                                    <Label>حالت نمایش</Label>
                                    <RadioGroup defaultValue="dark" className="grid grid-cols-3 gap-4">
                                        <div>
                                            <RadioGroupItem value="light" id="light" className="peer sr-only" />
                                            <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <Sun className="mb-3 h-6 w-6" />
                                                روشن
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                                            <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <Moon className="mb-3 h-6 w-6" />
                                                تیره
                                            </Label>
                                        </div>
                                         <div>
                                            <RadioGroupItem value="system" id="system" className="peer sr-only" />
                                            <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <Laptop className="mb-3 h-6 w-6" />
                                                سیستم
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse rounded-lg border p-4">
                                    <Label htmlFor="notifications" className="flex flex-col space-y-1">
                                        <span>اعلان‌ها</span>
                                        <span className="font-normal text-sm text-muted-foreground">
                                            دریافت اعلان برای پیشنهادهای جدید.
                                        </span>
                                    </Label>
                                    <Switch id="notifications" defaultChecked />
                                </div>
                                <div>
                                    <Button variant="destructive" className="w-full">
                                        <Trash2 className="ml-2 h-4 w-4" />
                                        پاک کردن تاریخچه مشاوره‌ها
                                    </Button>
                                </div>
                            </div>
                             <DialogFooter>
                                <Button type="submit">ذخیره تغییرات</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

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
