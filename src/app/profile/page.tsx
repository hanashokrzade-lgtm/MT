'use client';

import { useAuth } from "@/context/auth-provider";
import { LoginPrompt } from "./components/login-prompt";
import { UserProfile } from "./components/user-profile";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }
    
    return user ? <UserProfile /> : <LoginPrompt />;
}
