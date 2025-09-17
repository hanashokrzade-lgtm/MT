import { QaForm } from './components/qa-form';

export default function QaPage() {
  return (
    <div className="container flex flex-col h-full">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">پرسش و پاسخ با مشاور</h1>
        <p className="mt-2 text-muted-foreground">
          با هوش مصنوعی گفتگو کنید و پاسخ سوالات خود را به صورت متنی و صوتی دریافت کنید.
        </p>
      </div>
      <QaForm />
    </div>
  );
}
