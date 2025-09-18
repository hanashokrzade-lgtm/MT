'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, ChevronRight, HelpCircle, Shield, Moon, Sun, Laptop, Trash2, Bell, ShieldCheck, FileText } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

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
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="ml-2 h-4 w-4" />
                                    پاک کردن تاریخچه مشاوره‌ها
                                </Button>
                            </div>
                             <DialogFooter>
                                <Button type="submit">ذخیره تغییرات</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex justify-between items-center w-full p-3 rounded-lg hover:bg-accent/50 transition-colors text-right">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <span>حریم خصوصی و امنیت</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </DialogTrigger>
                         <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>حریم خصوصی و امنیت</DialogTitle>
                                <DialogDescription>
                                    تنظیمات امنیتی و مدیریت داده‌های حساب کاربری خود را کنترل کنید.
                                </DialogDescription>
                            </DialogHeader>
                             <div className="grid gap-6 py-4">
                                <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse rounded-lg border p-4">
                                    <Label htmlFor="2fa" className="flex flex-col space-y-1">
                                        <span>تایید دو مرحله‌ای</span>
                                        <span className="font-normal text-sm text-muted-foreground">
                                            امنیت حساب خود را با یک لایه اضافی افزایش دهید.
                                        </span>
                                    </Label>
                                    <Switch id="2fa" />
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="justify-start gap-3 text-left">
                                            <FileText className="ml-2 h-4 w-4" />
                                            مشاهده سیاست حفظ حریم خصوصی
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>سیاست حفظ حریم خصوصی</DialogTitle>
                                            <DialogDescription>
                                                آخرین بروزرسانی: ۲ مرداد ۱۴۰۳
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-96 pr-6">
                                            <div className="prose prose-sm dark:prose-invert text-foreground/90 leading-relaxed text-right">
                                                <p>
                                                    به «مشاور تحصیلی من» خوش آمدید. ما به حریم خصوصی شما احترام می‌گذاریم و متعهد به حفاظت از اطلاعات شخصی شما هستیم. این سیاست‌نامه توضیح می‌دهد که ما چگونه اطلاعات شما را جمع‌آوری، استفاده و نگهداری می‌کنیم.
                                                </p>

                                                <h4>اطلاعاتی که جمع‌آوری می‌کنیم</h4>
                                                <ul>
                                                    <li><strong>اطلاعات حساب کاربری:</strong> هنگام ورود با حساب گوگل، ما اطلاعاتی مانند نام، آدرس ایمیل و عکس پروفایل شما را از گوگل دریافت می‌کنیم.</li>
                                                    <li><strong>اطلاعات مشاوره:</strong> پاسخ‌هایی که شما به سوالات مربوط به علاقه‌مندی‌ها، نمرات، نقاط قوت و ضعف، اهداف شغلی و انتظارات خانواده می‌دهید، برای ارائه پیشنهادات تحصیلی ذخیره می‌شود.</li>
                                                    <li><strong>سوالات و پاسخ‌ها:</strong> سوالاتی که در بخش پرسش و پاسخ مطرح می‌کنید و پاسخ‌های تولید شده توسط هوش مصنوعی نیز در تاریخچه حساب شما ذخیره می‌گردد.</li>
                                                </ul>

                                                <h4>چگونه از اطلاعات شما استفاده می‌کنیم</h4>
                                                <ul>
                                                    <li>برای ارائه خدمات اصلی برنامه، یعنی تحلیل اطلاعات و ارائه پیشنهادات تحصیلی شخصی‌سازی شده.</li>
                                                    <li>برای پاسخ به سوالات شما در بخش پرسش و پاسخ.</li>
                                                    <li>برای بهبود کیفیت خدمات و مدل‌های هوش مصنوعی خود (به صورت ناشناس و تجمیعی).</li>
                                                    <li>برای شخصی‌سازی تجربه کاربری شما در برنامه.</li>
                                                </ul>

                                                <h4>به اشتراک‌گذاری اطلاعات</h4>
                                                <p>
                                                    ما اطلاعات شخصی شما را با هیچ شخص یا سازمان ثالثی به اشتراک نمی‌گذاریم، نمی‌فروشیم و اجاره نمی‌دهیم، مگر در موارد زیر:
                                                </p>
                                                <ul>
                                                    <li>با رضایت صریح شما.</li>
                                                    <li>برای تبعیت از الزامات قانونی یا درخواست‌های دولتی.</li>
                                                </ul>

                                                <h4>امنیت اطلاعات</h4>
                                                <p>
                                                    ما از تدابیر امنیتی فنی و سازمانی مناسب برای محافظت از اطلاعات شخصی شما در برابر دسترسی غیرمجاز، افشا، تغییر یا تخریب استفاده می‌کنیم. تمام ارتباطات بین شما و سرورهای ما از طریق پروتکل امن SSL/TLS رمزنگاری می‌شود.
                                                </p>

                                                <h4>کنترل شما بر اطلاعات</h4>
                                                <ul>
                                                    <li>شما می‌توانید از طریق تنظیمات حساب کاربری خود، تاریخچه مشاوره‌ها و پرسش و پاسخ‌های خود را پاک کنید.</li>
                                                    <li>شما می‌توانید در هر زمان با مراجعه به تنظیمات حساب، حساب کاربری خود و تمام داده‌های مرتبط با آن را به طور کامل حذف کنید.</li>
                                                </ul>

                                                <h4>تغییرات در این سیاست‌نامه</h4>
                                                <p>
                                                    ما ممکن است این سیاست حفظ حریم خصوصی را هر از چند گاهی به‌روزرسانی کنیم. در صورت ایجاد تغییرات اساسی، ما شما را از طریق برنامه مطلع خواهیم کرد.
                                                </p>

                                                <h4>تماس با ما</h4>
                                                <p>
                                                    اگر در مورد این سیاست حفظ حریم خصوصی سوالی دارید، لطفاً از طریق بخش "راهنما و پشتیبانی" با ما تماس بگیرید.
                                                </p>
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                         <Button variant="destructive" className="w-full">
                                            <Trash2 className="ml-2 h-4 w-4" />
                                            حذف حساب کاربری
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>آیا کاملاً مطمئن هستید؟</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                این عمل قابل بازگشت نیست. با این کار حساب شما و تمام داده‌های مرتبط با آن برای همیشه پاک خواهد شد.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                                            <AlertDialogAction>بله، حذف کن</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </DialogContent>
                    </Dialog>

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
