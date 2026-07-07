'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useRequestMutation } from '@/lib/useRequestMutation';
import { UpdateMyDataRequest } from '@/request/UpdateMyData.request';
import { useRouter } from 'next/navigation';

const ukrainianNameRegex =
  /^[А-Яа-яЁёЇїІіЄєҐґьЪъ'’][-А-Яа-яЁёЇїІіЄєҐґьЪъ'’\s]{2,100}$/;
const phoneRegex = /^\+380\d{9}$/;

export const updateDataSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5, { message: 'ПІБ занадто коротке' })
    .max(200, { message: "Занадто довге ім'я" })
    .refine((val) => ukrainianNameRegex.test(val), {
      message: "Будь ласка, введіть коректне прізвище, ім'я та по батькові",
    }),

  phone: z
    .string()
    .transform((arg) => arg.replace(/[\s\-()]/g, ''))
    .refine((val) => phoneRegex.test(val), {
      message: 'Номер телефону повинен бути у форматі +380XXXXXXXXX',
    }),

  address: z
    .string()
    .trim()
    .min(10, { message: 'Адреса має містити щонайменше 10 символів' })
    .max(200, { message: 'Адреса занадто довга' }),
});

function Page() {
  const router = useRouter();
  const mutation = useRequestMutation(UpdateMyDataRequest, {
    onSuccess(data) {
      router.push('/');
    },
  });
  const form = useForm<z.infer<typeof updateDataSchema>>({
    resolver: zodResolver(updateDataSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: z.infer<typeof updateDataSchema>) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="absolute my-auto -right-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10 -z-20"></div>
      <div className="absolute my-auto -left-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10 -z-20"></div>
      <form
        className="space-y-8 w-full max-w-200 px-20"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold">Оновити мої дані</h1>
        <div className="space-y-2">
          <Label>ПІБ ( Призвище, ім'я, по батькові )</Label>
          <Input
            placeholder="Іванов Іван Іванович"
            {...form.register('fullName')}
          ></Input>
          <p className="text-red-400 text-xs">
            {form.formState.errors.fullName?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Номер телефону</Label>
          <Input
            placeholder="+380 00 000 00 00"
            {...form.register('phone')}
          ></Input>
          <p className="text-red-400 text-xs">
            {form.formState.errors.phone?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Адреса</Label>
          <Input
            placeholder="Житомир, Шевченка 5"
            {...form.register('address')}
          ></Input>
          <p className="text-red-400 text-xs">
            {form.formState.errors.address?.message}
          </p>
        </div>
        <div className="flex flex-row space-x-2">
          <Link href={'/'} className="flex-1">
            <Button className="w-full h-full" variant={'secondary'}>
              На головну
            </Button>
          </Link>

          <Button className="flex-1" disabled={!form.formState.isValid}>
            Оновити
          </Button>
        </div>
        <p className="text-red-400 text-xs">
          {form.formState.errors.root?.message}
        </p>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Ці дані використовуються лише для заповнення заяв, ми не
          передаємо/продаємо ці дані третім особам, окрім GeminiApi ( Google
          DeepMind ). Докладніше ви можете прочитати в{' '}
          <Link
            className="underline hover:text-primary transition-colors"
            href="/policy/privacy"
          >
            політиці конфіденційності
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Page;
