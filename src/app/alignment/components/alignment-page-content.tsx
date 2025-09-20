import { AlignmentForm } from './alignment-form';

export function AlignmentPageContent() {
  return (
    <div className="container py-12 pb-[calc(6rem+20px)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">تحلیل هم‌راستایی اهداف و رشته‌ها</h1>
          <p className="mt-2 text-muted-foreground">
            اهداف خود و رشته‌های مورد نظرتان را وارد کنید تا میزان تطابق آن‌ها را با هوش مصنوعی بسنجیم.
          </p>
        </div>
        <AlignmentForm />
      </div>
    </div>
  );
}
