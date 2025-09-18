'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, Star } from 'lucide-react';
import {
  analyzeAlignmentOfGoalsAndMajors,
  type AnalyzeAlignmentOutput,
} from '@/ai/flows/analyze-alignment-of-goals-and-majors';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const alignmentSchema = z.object({
  goals: z.string().min(20, { message: 'لطفاً اهداف خود را با حداقل ۲۰ کاراکتر شرح دهید.' }),
  majorOptions: z.string().min(3, { message: 'لطفاً حداقل یک رشته برای تحلیل وارد کنید.' }),
});

type AlignmentFormData = z.infer<typeof alignmentSchema>;

export function AlignmentForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeAlignmentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AlignmentFormData>({
    resolver: zodResolver(alignmentSchema),
    defaultValues: {
      goals: '',
      majorOptions: '',
    },
  });

  const onSubmit = async (data: AlignmentFormData) => {
    setLoading(true);
    setResult(null);
    try {
      const majorOptions = data.majorOptions.split(/,|،|\n/).map(s => s.trim()).filter(Boolean);
      const response = await analyzeAlignmentOfGoalsAndMajors({ ...data, majorOptions });
      setResult(response.sort((a, b) => b.alignmentScore - a.alignmentScore));
    } catch (error: any) {
      console.error("Alignment Error: ", error);
      toast({
        title: 'خطا در تحلیل',
        description: `مشکلی در ارتباط با سرویس هوش مصنوعی پیش آمد: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.map(item => ({
    major: item.major,
    score: item.alignmentScore,
    fill: `var(--color-primary)`
  })) || [];
  
  const chartConfig = {
    score: {
      label: "امتیاز هم‌راستایی",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>فرم تحلیل</CardTitle>
          <CardDescription>اهداف و رشته‌های مورد نظر خود را وارد کنید.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اهداف شما</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="اهداف شخصی، تحصیلی و شغلی خود را اینجا بنویسید..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="majorOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رشته‌های مورد نظر</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="نام رشته‌ها را وارد کنید و با کاما (،)، یا خط جدید از هم جدا کنید. مثال: مهندسی کامپیوتر، پزشکی، روانشناسی"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال تحلیل...
                  </>
                ) : (
                  <>
                    <Sparkles className="ml-2 h-4 w-4" />
                    شروع تحلیل
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
          <div className="flex items-center justify-center pt-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>نتایج تحلیل هم‌راستایی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">نمودار مقایسه‌ای</h3>
              <ChartContainer config={chartConfig} className="w-full h-[300px] rtl-grid">
                <ResponsiveContainer>
                  <BarChart data={chartData} layout="vertical" margin={{ right: 40, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="major" type="category" width={100} tickLine={false} axisLine={false} reversed/>
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                       <LabelList dataKey="score" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={(value: number) => `${value}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">دلایل امتیازدهی</h3>
              <div className="space-y-4">
                {result.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-background">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">{item.major}</h4>
                        <div className="flex items-center gap-1 text-sm font-bold text-primary-foreground px-3 py-1 rounded-full bg-primary">
                            <Star className="h-4 w-4" />
                            <span>{item.alignmentScore} / 100</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
