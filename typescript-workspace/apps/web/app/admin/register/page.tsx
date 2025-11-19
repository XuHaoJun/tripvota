'use client';

import { useState } from 'react';

import { useMutation } from '@connectrpc/connect-query';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { AuthService } from '@workspace/proto-gen/src/auth_pb';
import { Button } from '@workspace/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';

import { registerSchema, RegisterValues } from '@/lib/schemas/auth';

// Note: Assuming path to generated proto code.
// If not generated yet, this will be broken.

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Use standard connect-query useMutation
  // We need to verify if AuthService is exported correctly from rpc-client
  const { mutateAsync: register, isPending } = useMutation(AuthService.method.register);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: RegisterValues) {
    setError(null);
    try {
      const response = await register({
        email: values.email,
        username: values.username,
        password: values.password,
      });

      if (response.success) {
        toast.success('Registration successful! Please log in.');
        router.push('/admin/login?registered=true');
      } else {
        const msg = response.message || 'Registration failed';
        setError(msg);
        toast.error(msg);
      }
    } catch (e: any) {
      console.error(e);
      const msg = e.message || 'An unexpected error occurred';
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm">Enter your details below to create your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="jdoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          Already have an account?{' '}
          <Link href="/admin/login" className="hover:text-primary underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
