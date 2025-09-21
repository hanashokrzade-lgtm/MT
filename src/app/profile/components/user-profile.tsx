'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, ChevronRight, HelpCircle, Shield, Moon, Sun, Laptop, Trash2, Bell, ShieldCheck, FileText, Mail, Bug, ClipboardList, MessageSquare, Target, Edit, TrendingUp, CheckCircle, BarChart2, History, BrainCircuit } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useTabs } from "@/context/tabs-provider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Mock Data for the dashboard - In a real app, this would come from state or API
const dashboardData = {
  stats: {
    advisories: 5,
    questions: 12,
    avgAlignment: 82,
  },
  recentMajors: [
    { name: "مهندسی نرم‌افزار", score: 95, reason: "علاقه شدید به حل مسئله و تفکر الگوریتمی." },
    { name: "هوش مصنوعی", score: 92, reason: "ترکیبی از نقاط قوت در ریاضیات و خلاقیت." },
    { name: "علوم داده", score: 88, reason: "توانایی تحلیل داده و استخراج الگوهای معنادار." },
  ],
  profileCompletion: 60,
  activityChart: [
    { month: "فروردین", desktop: 186 },
    { month: "اردیبهشت", desktop: 305 },
    { month: "خرداد", desktop: 237 },
    { month: "تیر", desktop: 273 },
    { month: "مرداد", desktop: 209 },
    { month: "شهریور", desktop: 214 },
  ],
  consultationHistory: [
    { date: "۱۴۰۳/۰۵/۰۱", topMajor: "مهندسی نرم‌افزار", summary: "تمرکز بر علاقه به حل مسئله و کامپیوتر." },
    { date: "۱۴۰۳/۰۴/۱۵", topMajor: "پزشکی", summary: "بررسی علاقه به علوم زیستی و کمک به دیگران." },
    { date: "۱۴۰۳/۰۳/۲۲", topMajor: "روانشناسی", summary: "کاوش در زمینه علاقه به درک رفتار انسان." },
    { date: "۱۴۰۳/۰۳/۱۰", topMajor: "هنرهای دیجیتال", summary: "تحلیل نقاط قوت در خلاقیت و طراحی." },
    { date: "۱۴۰۳/۰۲/۱۸", topMajor: "مهندسی عمران", summary: "بر اساس نمرات بالا در ریاضی و فیزیک." },
  ],
  questionHistory: [
    { date: "۱۴۰۳/۰۵/۰۲", question: "بهترین دانشگاه‌ها برای هوش مصنوعی کدامند؟", answerSnippet: "دانشگاه‌های برتر شامل دانشگاه تهران، صنعتی شریف و امیرکبیر هستند که قطب‌های علمی این رشته محسوب می‌شوند..." },
    { date: "۱۴۰۳/۰۴/۲۸", question: "آیا رشته علوم کامپیوتر بازار کار خوبی در ایران دارد؟", answerSnippet: "بله، با توجه به رشد شرکت‌های دانش‌بنیان و نیاز به دیجیتالی شدن کسب‌وکارها، بازار کار بسیار خوبی دارد..." },
    { date: "۱۴۰۳/۰۴/۲۰", question: "تفاوت بین مهندسی نرم‌افزار و علوم کامپیوتر چیست؟", answerSnippet: "مهندسی نرم‌افزار بیشتر بر فرآیندهای ساخت و نگهداری نرم‌افزار تمرکز دارد، در حالی که علوم کامپیوتر مباحث تئوری و بنیادی را پوشش می‌دهد..." },
  ]
};

const chartConfig = {
  desktop: {
    label: "فعالیت",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const SettingsDialog = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    // Use resolvedTheme for initial default value to handle 'system'
    const currentTheme = theme === 'system' ? resolvedTheme : theme;

    return (
        <DialogContent className="sm:max-w-[425px] glass-card">
            <DialogHeader className="text-right">
                <DialogTitle>تنظیمات کلی</DialogTitle>
                <DialogDescription>
                    تنظیمات مربوط به ظاهر برنامه، داده‌ها و اعلان‌ها را مدیریت کنید.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div className="space-y-4">
                    <Label>حالت نمایش</Label>
                    <RadioGroup 
                        value={theme}
                        onValueChange={setTheme}
                        className="grid grid-cols-3 gap-4"
                    >
                        <Label
                            htmlFor="light"
                            className={cn("flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer",
                                currentTheme === 'light' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <RadioGroupItem value="light" id="light" className="peer sr-only" />
                            <Sun className="mb-3 h-6 w-6" />
                            روشن
                        </Label>
                         <Label
                            htmlFor="dark"
                            className={cn("flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer",
                                currentTheme === 'dark' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                            <Moon className="mb-3 h-6 w-6" />
                            تیره
                        </Label>
                        <Label
                            htmlFor="system"
                            className={cn("flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer",
                                theme === 'system' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <RadioGroupItem value="system" id="system" className="peer sr-only" />
                            <Laptop className="mb-3 h-6 w-6" />
                            سیستم
                        </Label>
                    </RadioGroup>
                </div>
                <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse rounded-lg border p-4">
                    <Label htmlFor="notifications" className="flex flex-col space-y-1 text-right">
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
                <DialogClose asChild>
                    <Button type="button" variant="secondary">بستن</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};

const PrivacyDialog = () => (
    <DialogContent className="sm:max-w-[425px] glass-card">
        <DialogHeader className="text-right">
            <DialogTitle>حریم خصوصی و امنیت</DialogTitle>
            <DialogDescription>
                تنظیمات امنیتی و مدیریت داده‌های حساب کاربری خود را کنترل کنید.
            </DialogDescription>
        </DialogHeader>
            <div className="grid gap-6 py-4">
            <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse rounded-lg border p-4">
                <Label htmlFor="2fa" className="flex flex-col space-y-1 text-right">
                    <span>تایید دو مرحله‌ای</span>
                    <span className="font-normal text-sm text-muted-foreground">
                        امنیت حساب خود را با یک لایه اضافی افزایش دهید.
                    </span>
                </Label>
                <Switch id="2fa" />
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="justify-start gap-3 text-left w-full">
                        <FileText className="ml-2 h-4 w-4" />
                        مشاهده سیاست حفظ حریم خصوصی
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl glass-card">
                    <DialogHeader className="text-right">
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
                <AlertDialogContent className="glass-card">
                    <AlertDialogHeader className="text-right">
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
);

const HelpDialog = () => (
    <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader className="text-right">
            <DialogTitle>راهنما و پشتیبانی</DialogTitle>
            <DialogDescription>
                پاسخ سوالات خود را بیابید و با ما در تماس باشید.
            </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 text-right">
            <div>
                <h4 className="font-semibold mb-3">سوالات متداول (FAQ)</h4>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>چگونه بهترین نتیجه را از مشاوره بگیرم؟</AccordionTrigger>
                        <AccordionContent>
                            برای دریافت بهترین تحلیل، لطفاً تمام فیلدها را با دقت، صداقت و جزئیات کامل پر کنید. هرچه اطلاعات بیشتری ارائه دهید، هوش مصنوعی بهتر می‌تواند شما را راهنمایی کند.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>آیا داده‌های من محرمانه باقی می‌ماند؟</AccordionTrigger>
                        <AccordionContent>
                            بله، ما به حریم خصوصی شما متعهد هستیم. تمام داده‌های شما به صورت امن ذخیره می‌شوند و فقط برای ارائه خدمات مشاوره استفاده می‌شوند. برای اطلاعات بیشتر، بخش "سیاست حفظ حریم خصوصی" را مطالعه کنید.
                        </AccordionContent>
                    </AccordionItem>
                        <AccordionItem value="item-3">
                        <AccordionTrigger>چرا پخش صوتی گاهی اوقات کار نمی‌کند؟</AccordionTrigger>
                        <AccordionContent>
                            سرویس تبدیل متن به گفتار ممکن است محدودیت‌هایی داشته باشد. اگر با خطا مواجه شدید، لطفاً چند دقیقه صبر کرده و دوباره تلاش کنید. همچنین مطمئن شوید که اتصال اینترنت شما پایدار است.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div>
                <h4 className="font-semibold mb-3">تماس با ما</h4>
                <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-3" asChild>
                        <a href="mailto:support@example.com">
                            <Mail className="h-5 w-5" />
                            <span>ارسال ایمیل به پشتیبانی</span>
                        </a>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-3" asChild>
                        <a href="mailto:support@example.com?subject=گزارش%20مشکل%20فنی%20در%20اپلیکیشن%20مشاور%20تحصیلی">
                            <Bug className="h-5 w-5" />
                            <span>گزارش مشکل فنی</span>
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    </DialogContent>
);

const EditProfileDialog = ({ profileData, onSave }: { profileData: any, onSave: (data: any) => void }) => {
    const [interests, setInterests] = useState(profileData.interests || '');
    const [strengths, setStrengths] = useState(profileData.strengths || '');
    const [goals, setGoals] = useState(profileData.goals || '');

    const handleSave = () => {
        onSave({ interests, strengths, goals });
    };

    return (
        <DialogContent className="sm:max-w-lg glass-card">
            <DialogHeader className="text-right">
                <DialogTitle>ویرایش پروفایل حرفه‌ای</DialogTitle>
                <DialogDescription>
                    این اطلاعات به ما کمک می‌کند تا مشاوره‌های دقیق‌تر و شخصی‌سازی شده‌تری به شما ارائه دهیم.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 text-right">
                <div className="space-y-2">
                    <Label htmlFor="interests">علایق و سرگرمی‌ها</Label>
                    <Textarea 
                        id="interests" 
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        placeholder="موضوعات مورد علاقه، فعالیت‌هایی که از آنها لذت می‌برید، کتاب‌ها، فیلم‌ها و..." 
                        rows={4} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="strengths">نقاط قوت کلیدی</Label>
                    <Textarea 
                        id="strengths" 
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        placeholder="مهارت‌هایی که در آنها برتر هستید، مانند حل مسئله، خلاقیت، کار گروهی، مهارت‌های فنی و..." 
                        rows={4} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="goals">اهداف شغلی و آینده</Label>
                    <Textarea 
                        id="goals" 
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        placeholder="شغل رویایی شما چیست؟ چه نوع محیط کاری را ترجیح می‌دهید؟ اهداف بلندمدت شما چیست؟" 
                        rows={4} 
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">انصراف</Button>
                </DialogClose>
                 <DialogClose asChild>
                    <Button type="button" onClick={handleSave}>ذخیره تغییرات</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};


export function UserProfile() {
    const { user, signOut } = useAuth();
    const { setActiveTab } = useTabs();
    const [profileData, setProfileData] = useState({
        interests: 'علاقه‌مند به برنامه‌نویسی، بازی‌های ویدیویی استراتژیک و مطالعه کتاب‌های علمی-تخیلی.',
        strengths: 'توانایی بالا در حل مسائل پیچیده ریاضی، یادگیری سریع زبان‌های برنامه‌نویسی جدید و تفکر منطقی.',
        goals: 'تبدیل شدن به یک مهندس نرم‌افزار ارشد در یک شرکت فناوری بزرگ و کار بر روی پروژه‌های هوش مصنوعی.'
    });

    const handleProfileSave = (newProfileData: any) => {
        setProfileData(newProfileData);
    };

    return (
        <div className="container py-8 max-w-4xl mx-auto space-y-8 pb-[calc(6rem+20px)]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/50 flex-shrink-0">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                    <AvatarFallback>
                        <User className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-right flex-grow">
                    <h2 className="text-2xl font-bold">{user?.displayName || 'کاربر مهمان'}</h2>
                    <p className="text-muted-foreground">{user?.email || 'ایمیل ثبت نشده'}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                        <TooltipProvider>
                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent><p>تنظیمات</p></TooltipContent>
                                </Tooltip>
                                <SettingsDialog />
                            </Dialog>

                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                         <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><ShieldCheck className="h-5 w-5" /></Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent><p>حریم خصوصی</p></TooltipContent>
                                </Tooltip>
                                <PrivacyDialog />
                            </Dialog>
                            
                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><HelpCircle className="h-5 w-5" /></Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent><p>راهنما</p></TooltipContent>
                                </Tooltip>
                                <HelpDialog />
                            </Dialog>
                        </TooltipProvider>
                    </div>
                </div>
                <Button variant="outline" onClick={signOut} className="flex-shrink-0">
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج
                </Button>
            </div>

            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-3">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Card className="hover:bg-muted/50 cursor-pointer transition-colors glass-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">مشاوره‌ها</CardTitle>
                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.advisories}</div>
                                <p className="text-xs text-muted-foreground">تعداد کل مشاوره‌های انجام شده</p>
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg glass-card">
                        <DialogHeader className="text-right">
                            <DialogTitle>تاریخچه مشاوره‌ها</DialogTitle>
                            <DialogDescription>
                                در اینجا می‌توانید خلاصه‌ای از مشاوره‌های قبلی خود را مشاهده کنید.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-96 pr-4">
                            <div className="space-y-4 py-4 text-right">
                                {dashboardData.consultationHistory.map((item, index) => (
                                    <div key={index} className="p-4 border rounded-lg bg-background/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-semibold text-primary">{item.topMajor}</p>
                                            <Badge variant="secondary">{item.date}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="hover:bg-muted/50 cursor-pointer transition-colors glass-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">پرسش و پاسخ</CardTitle>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.questions}</div>
                                <p className="text-xs text-muted-foreground">تعداد کل سوالات پرسیده شده</p>
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg glass-card">
                        <DialogHeader className="text-right">
                            <DialogTitle>تاریخچه پرسش و پاسخ</DialogTitle>
                            <DialogDescription>
                                در اینجا می‌توانید خلاصه‌ای از سوالات اخیر خود را مشاهده کنید.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-96 pr-4">
                            <div className="space-y-4 py-4 text-right">
                                {dashboardData.questionHistory.map((item, index) => (
                                    <div key={index} className="p-4 border rounded-lg bg-background/50">
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <p className="font-semibold text-primary flex-1">{item.question}</p>
                                            <Badge variant="secondary" className="flex-shrink-0">{item.date}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.answerSnippet}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                         <DialogFooter>
                            <Button onClick={() => setActiveTab('q-and-a')}>
                                <MessageSquare className="ml-2 h-4 w-4"/>
                                رفتن به صفحه پرسش و پاسخ
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">میانگین هم‌راستایی</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.stats.avgAlignment}%</div>
                        <p className="text-xs text-muted-foreground">در تحلیل اهداف و رشته‌ها</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card">
                    <CardHeader>
                        <CardTitle>فعالیت‌های اخیر</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={chartConfig} className="w-full h-[250px]">
                             <BarChart accessibilityLayer data={dashboardData.activityChart}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="col-span-4 lg:col-span-3 glass-card">
                    <CardHeader>
                        <CardTitle>آخرین رشته‌های پیشنهادی</CardTitle>
                        <CardDescription>بر اساس آخرین مشاوره شما.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className=" space-y-4">
                        {dashboardData.recentMajors.map((major) => (
                            <Dialog key={major.name}>
                                <DialogTrigger asChild>
                                    <div className="flex items-center hover:bg-muted/50 p-2 rounded-lg cursor-pointer transition-colors">
                                        <CheckCircle className="h-4 w-4 ml-3 text-green-500 flex-shrink-0" />
                                        <div className="flex-1 font-medium">{major.name}</div>
                                        <Badge variant="outline" className="text-primary">{major.score}%</Badge>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="glass-card">
                                    <DialogHeader className="text-right">
                                        <DialogTitle className="flex items-center justify-end gap-2">
                                            <BrainCircuit className="w-6 h-6 text-primary"/>
                                            جزئیات پیشنهاد: {major.name}
                                        </DialogTitle>
                                        <DialogDescription>
                                            امتیاز هم‌راستایی: {major.score}%
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 text-right">
                                        <h4 className="font-semibold mb-2">دلیل پیشنهاد:</h4>
                                        <p className="text-muted-foreground bg-muted p-4 rounded-md">{major.reason}</p>
                                    </div>
                                    <DialogFooter>
                                         <Button onClick={() => setActiveTab('alignment')}>
                                            <BarChart2 className="ml-2 h-4 w-4"/>
                                            تحلیل مجدد اهداف
                                        </Button>
                                         <DialogClose asChild>
                                            <Button variant="outline">بستن</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Professional Profile Builder */}
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                             <CardTitle>پروفایل حرفه‌ای تحصیلی</CardTitle>
                             <CardDescription>با تکمیل این بخش، مشاوره‌های دقیق‌تری دریافت کنید.</CardDescription>
                        </div>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="default">
                                    <Edit className="ml-2 h-4 w-4" />
                                    ویرایش پروفایل
                                </Button>
                            </DialogTrigger>
                            <EditProfileDialog profileData={profileData} onSave={handleProfileSave} />
                         </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 text-right">
                    <div className="space-y-2">
                        <Label>علایق و سرگرمی‌ها</Label>
                        <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md min-h-[60px]">
                            {profileData.interests || "هنوز وارد نشده..."}
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label>نقاط قوت کلیدی</Label>
                        <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md min-h-[60px]">
                            {profileData.strengths || "هنوز وارد نشده..."}
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label>اهداف شغلی و آینده</Label>
                        <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md min-h-[60px]">
                            {profileData.goals || "هنوز وارد نشده..."}
                        </p>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
