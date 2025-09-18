import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { User, Mail, Phone, LogOut } from "lucide-react";


export function ProfilePageContent() {
    const profileImage = PlaceHolderImages.find(p => p.id === 'profile-avatar');

    return (
        <div className="container py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="w-32 h-32 border-4 border-primary">
                            {profileImage && <AvatarImage src={profileImage.imageUrl} alt="پروفایل دانش‌آموز" data-ai-hint={profileImage.imageHint} />}
                            <AvatarFallback>
                                <User className="w-16 h-16" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-3xl font-bold">دانش‌آموز کوشا</CardTitle>
                            <p className="text-muted-foreground">دانش آموز سال آخر دبیرستان</p>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <div className="space-y-4 text-center">
                            <div className="flex items-center justify-center gap-4 text-muted-foreground">
                                <Mail className="w-5 h-5"/>
                                <span>student.koosha@example.com</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-muted-foreground">
                                <Phone className="w-5 h-5"/>
                                <span>0912-345-6789</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>تنظیمات حساب کاربری</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                            ویرایش پروفایل
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            تغییر رمز عبور
                        </Button>
                        <Button variant="destructive" className="w-full justify-start">
                            <LogOut className="ml-2 w-4 h-4"/>
                            خروج از حساب کاربری
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
