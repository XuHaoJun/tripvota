'use client';

import { useState, Suspense } from 'react';

import { useMutation } from '@connectrpc/connect-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { setTokens } from '@workspace/fetch-ext';
import { AuthService } from '@workspace/proto-gen/src/auth_pb';
import { Button } from '@workspace/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';

import { accountAtom } from '@/atoms/auth';
import { loginSchema, LoginValues } from '@/lib/schemas/auth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [error, setError] = useState<string | null>(null);
  const setAccount = useSetAtom(accountAtom);

  const { mutateAsync: login, isPending } = useMutation(AuthService.method.login);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.account) {
        // Save tokens
        setTokens(response.accessToken, response.refreshToken);
        // Update atom
        setAccount(response.account);
        // Redirect
        toast.success('Logged in successfully');
        router.push('/admin/dashboard'); // Assuming dashboard exists
      } else {
        setError('Invalid email or password');
        toast.error('Invalid email or password');
      }
    } catch (e: any) {
      console.error(e);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Enter your email to sign in to your account</p>
      </div>

      {registered && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          Registration successful! Please log in.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <div className="text-destructive text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            Sign In
          </Button>
        </form>
      </Form>

      <div className="text-muted-foreground px-8 text-center text-sm">
        <Link href="/admin/register" className="hover:text-brand underline underline-offset-4">
          Don&apos;t have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <Suspense
      fallback={<div className="container flex h-screen w-screen flex-col items-center justify-center">Loading...</div>}
    >
      <LoginFormContent />
    </Suspense>
  );
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}
