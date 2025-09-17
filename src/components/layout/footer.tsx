import { GraduationCap } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card">
      <div className="container flex items-center justify-center h-16">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
           <GraduationCap className="h-4 w-4" />
           <span>© {currentYear} مشاور تحصیلی من. تمام حقوق محفوظ است.</span>
        </p>
      </div>
    </footer>
  );
}
