import { AdvisorForm } from './components/advisor-form';

export default function AdvisorPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">فرم مشاوره تحصیلی</h1>
          <p className="mt-2 text-muted-foreground">
            برای دریافت بهترین پیشنهادها، لطفاً به سوالات زیر با دقت و صداقت پاسخ دهید.
          </p>
        </div>
        <AdvisorForm />
      </div>
    </div>
  );
}
