import { QaForm } from './components/qa-form';

export default function QaPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">پرسش و پاسخ صوتی</h1>
          <p className="mt-2 text-muted-foreground">
            سوال خود را در مورد مسیر تحصیلی یا شغلی بپرسید و پاسخ آن را از مشاور هوشمند ما دریافت کنید.
          </p>
        </div>
        <QaForm />
      </div>
    </div>
  );
}
