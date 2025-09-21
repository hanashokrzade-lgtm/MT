'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, HelpCircle, Shield, Moon, Sun, Laptop, Trash2, Edit, CheckCircle, Lightbulb, History, Target, MessageSquare } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useTabs } from "@/context/tabs-provider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Mock Data - In a real app, this would come from state or API
const mockData = {
  consultationHistory: [
    { date: "۱۴۰۳/۰۵/۰۱", topMajor: "مهندسی نرم‌افزار", summary: "تمرکز بر علاقه به حل مسئله و کامپیوتر." },
    { date: "۱۴۰۳/۰۴/۱۵", topMajor: "پزشکی", summary: "بررسی علاقه به علوم زیستی و کمک به دیگران." },
  ],
  questionHistory: [
    { date: "۱۴۰۳/۰۵/۰۲", question: "بهترین دانشگاه‌ها برای هوش مصنوعی کدامند؟", answerSnippet: "دانشگاه‌های برتر شامل دانشگاه تهران، صنعتی شریف و امیرکبیر هستند..." },
    { date: "۱۴۰۳/۰۴/۲۸", question: "آیا رشته علوم کامپیوتر بازار کار خوبی در ایران دارد؟", answerSnippet: "بله، با توجه به رشد شرکت‌های دانش‌بنیان، بازار کار بسیار خوبی دارد..." },
  ],
  alignmentAnalyses: [
    { date: "۱۴۰۳/۰۵/۰۳", topMatch: { major: "هوش مصنوعی", score: 92 }, goals: "علاقه به یادگیری ماشین و تحلیل داده." }
  ],
  profile: {
    interests: 'علاقه‌مند به برنامه‌نویسی، بازی‌های ویدیویی استراتژیک و مطالعه کتاب‌های علمی-تخیلی.',
    strengths: 'توانایی بالا در حل مسائل پیچیده ریاضی، یادگیری سریع زبان‌های برنامه‌نویسی جدید و تفکر منطقی.',
    goals: 'تبدیل شدن به یک مهندس نرم‌افزار ارشد در یک شرکت فناوری بزرگ.'
  }
};

const SettingsDialog = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const currentTheme = theme === 'system' ? resolvedTheme : theme;

    return (
        <DialogContent className="sm:max-w-[425px] glass-card">
            <DialogHeader className="text-right">
                <DialogTitle>تنظیمات کلی</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div className="space-y-4">
                    <Label>حالت نمایش</Label>
                    <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                         <Label htmlFor="light" className={cn("flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer", currentTheme === 'light' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground')}>
                            <RadioGroupItem value="light" id="light" className="peer sr-only" />
                            <Sun className="mb-3 h-6 w-6" /> روشن
                        </Label>
                         <Label htmlFor="dark" className={cn("flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer", currentTheme === 'dark' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground')}>
                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                            <Moon className="mb-3 h-6 w-6" /> تیره
                        </Label>
                        <Label htmlFor="system" className={cn("flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer", theme === 'system' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground')}>
                            <RadioGroupItem value="system" id="system" className="peer sr-only" />
                            <Laptop className="mb-3 h-6 w-6" /> سیستم
                        </Label>
                    </RadioGroup>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                            <Trash2 className="ml-2 h-4 w-4" /> پاک کردن تمام داده‌ها
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card">
                        <AlertDialogHeader className="text-right">
                            <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                            <AlertDialogDescription>
                                این عمل تمام تاریخچه مشاوره‌ها، پرسش و پاسخ‌ها و اطلاعات پروفایل شما را برای همیشه پاک خواهد کرد.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction>بله، پاک کن</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DialogContent>
    );
};


const HelpDialog = () => (
    <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader className="text-right">
            <DialogTitle>راهنما و پشتیبانی</DialogTitle>
            <DialogDescription>پاسخ سوالات خود را بیابید و با ما در تماس باشید.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 text-right">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>چگونه بهترین نتیجه را از مشاوره بگیرم؟</AccordionTrigger>
                    <AccordionContent>برای دریافت بهترین تحلیل، لطفاً تمام فیلدها را با دقت، صداقت و جزئیات کامل پر کنید. هرچه اطلاعات بیشتری ارائه دهید، هوش مصنوعی بهتر می‌تواند شما را راهنمایی کند.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>آیا داده‌های من محرمانه باقی می‌ماند؟</AccordionTrigger>
                    <AccordionContent>بله، ما به حریم خصوصی شما متعهد هستیم. تمام داده‌های شما به صورت امن ذخیره می‌شوند و فقط برای ارائه خدمات مشاوره استفاده می‌شوند.</AccordionContent>
                </AccordionItem>
            </Accordion>
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
                <DialogTitle>ویرایش پروفایل تحصیلی</DialogTitle>
                <DialogDescription>این اطلاعات به ما کمک می‌کند تا مشاوره‌های دقیق‌تری به شما ارائه دهیم.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 text-right">
                <div className="space-y-2"><Label htmlFor="interests">علایق و سرگرمی‌ها</Label><Textarea id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="موضوعات مورد علاقه، فعالیت‌ها، کتاب‌ها و..." rows={3} /></div>
                <div className="space-y-2"><Label htmlFor="strengths">نقاط قوت کلیدی</Label><Textarea id="strengths" value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="مهارت‌هایی که در آنها برتر هستید..." rows={3} /></div>
                <div className="space-y-2"><Label htmlFor="goals">اهداف شغلی و آینده</Label><Textarea id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="شغل رویایی شما چیست؟..." rows={3} /></div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">انصراف</Button></DialogClose>
                <DialogClose asChild><Button type="button" onClick={handleSave}>ذخیره تغییرات</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};


export function UserProfile() {
    const { user, signOut } = useAuth();
    const { setActiveTab } = useTabs();
    const [profileData, setProfileData] = useState(mockData.profile);
    const [profileCompletion, setProfileCompletion] = useState(0);

    useEffect(() => {
        const fields = [profileData.interests, profileData.strengths, profileData.goals];
        const completedFields = fields.filter(field => field && field.trim() !== '').length;
        const completion = (completedFields / fields.length) * 100;
        setProfileCompletion(completion);
    }, [profileData]);

    const handleProfileSave = (newProfileData: any) => {
        setProfileData(newProfileData);
    };
    
    const hasTakenFirstStep = mockData.consultationHistory.length > 0 || profileCompletion > 0;

    return (
        <div className="container py-8 max-w-4xl mx-auto space-y-8 pb-[calc(6rem+20px)]">
            
            <div className="relative flex flex-col items-center justify-center pt-8">
                <TooltipProvider>
                    <div className="absolute top-0 left-0">
                        <Dialog>
                            <Tooltip>
                                <TooltipTrigger asChild><DialogTrigger asChild><Button variant="ghost" size="icon"><HelpCircle className="h-5 w-5 text-muted-foreground" /></Button></DialogTrigger></TooltipTrigger>
                                <TooltipContent><p>راهنما</p></TooltipContent>
                            </Tooltip>
                            <HelpDialog />
                        </Dialog>
                    </div>
                </TooltipProvider>

                <Avatar className="h-28 w-28 border-4 border-primary/50">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                    <AvatarFallback><User className="h-12 w-12 text-muted-foreground" /></AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mt-4">{user?.displayName || 'کاربر مهمان'}</h2>
                <p className="text-muted-foreground text-sm">{user?.email || 'ایمیل ثبت نشده'}</p>
                
                <TooltipProvider>
                    <div className="absolute top-0 right-0 flex gap-1">
                        <Dialog>
                             <Tooltip>
                                <TooltipTrigger asChild><DialogTrigger asChild><Button variant="ghost" size="icon"><Settings className="h-5 w-5 text-muted-foreground" /></Button></DialogTrigger></TooltipTrigger>
                                <TooltipContent><p>تنظیمات</p></TooltipContent>
                            </Tooltip>
                            <SettingsDialog />
                        </Dialog>
                         <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-5 w-5 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent><p>خروج</p></TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </div>

            {!hasTakenFirstStep ? (
                <Card className="glass-card text-center">
                    <CardHeader>
                        <CardTitle>به پروفایل خود خوش آمدید!</CardTitle>
                        <CardDescription>مسیر کشف استعدادهایتان از اینجا شروع می‌شود.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-6">به نظر می‌رسد هنوز اولین قدم را برنداشته‌اید. برای دریافت یک تحلیل دقیق و شخصی‌سازی شده، اولین مشاوره هوشمند خود را شروع کنید.</p>
                        <Button size="lg" onClick={() => setActiveTab('advisor')}>
                            <Lightbulb className="ml-2 h-5 w-5" />
                            شروع اولین مشاوره
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card className="glass-card">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>پیشرفت پروفایل شما</CardTitle>
                                    <CardDescription>با تکمیل پروفایل، نتایج بهتری کسب کنید.</CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Edit className="ml-2 h-4 w-4" />
                                            ویرایش
                                        </Button>
                                    </DialogTrigger>
                                    <EditProfileDialog profileData={profileData} onSave={handleProfileSave} />
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Progress value={profileCompletion} className="w-full" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <div className={cn("flex items-center gap-1.5", profileData.interests ? "text-primary" : "")}><CheckCircle className="h-3 w-3" /> علایق</div>
                                <div className={cn("flex items-center gap-1.5", profileData.strengths ? "text-primary" : "")}><CheckCircle className="h-3 w-3" /> نقاط قوت</div>
                                <div className={cn("flex items-center gap-1.5", profileData.goals ? "text-primary" : "")}><CheckCircle className="h-3 w-3" /> اهداف</div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>تاریخچه فعالیت‌ها</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="consultations" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="consultations"><History className="ml-1 h-4 w-4" />مشاوره‌ها</TabsTrigger>
                                    <TabsTrigger value="questions"><MessageSquare className="ml-1 h-4 w-4" />پرسش‌ها</TabsTrigger>
                                    <TabsTrigger value="alignments"><Target className="ml-1 h-4 w-4" />تحلیل‌ها</TabsTrigger>
                                </TabsList>
                                <TabsContent value="consultations" className="mt-4">
                                     <ScrollArea className="h-48 pr-3">
                                        <div className="space-y-4">
                                            {mockData.consultationHistory.length > 0 ? mockData.consultationHistory.map((item, index) => (
                                                <div key={index} className="p-3 border rounded-lg bg-background/50">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-semibold text-primary">{item.topMajor}</p>
                                                        <Badge variant="secondary">{item.date}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                                                </div>
                                            )) : <p className="text-center text-sm text-muted-foreground py-8">تاریخچه مشاوره خالی است.</p>}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="questions" className="mt-4">
                                     <ScrollArea className="h-48 pr-3">
                                        <div className="space-y-4">
                                            {mockData.questionHistory.length > 0 ? mockData.questionHistory.map((item, index) => (
                                                <div key={index} className="p-3 border rounded-lg bg-background/50">
                                                    <p className="font-semibold mb-1 line-clamp-1">{item.question}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.answerSnippet}</p>
                                                </div>
                                            )) : <p className="text-center text-sm text-muted-foreground py-8">تاریخچه پرسش و پاسخ خالی است.</p>}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="alignments" className="mt-4">
                                     <ScrollArea className="h-48 pr-3">
                                        <div className="space-y-4">
                                            {mockData.alignmentAnalyses.length > 0 ? mockData.alignmentAnalyses.map((item, index) => (
                                                <div key={index} className="p-3 border rounded-lg bg-background/50">
                                                    <div className="flex justify-between items-center mb-1">
                                                         <p className="font-semibold">{item.topMatch.major} <Badge variant="outline" className="text-primary">{item.topMatch.score}%</Badge></p>
                                                         <Badge variant="secondary">{item.date}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">بر اساس اهداف: {item.goals}</p>
                                                </div>
                                            )) : <p className="text-center text-sm text-muted-foreground py-8">تاریخچه تحلیل اهداف خالی است.</p>}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
