'use client';

import { useEffect, useState } from 'react';

import { useMutation } from '@connectrpc/connect-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { AuthService } from '@workspace/proto-gen/src/auth_pb';
import { Button } from '@workspace/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';

import { accessTokenAtom, useAdminAuthFetch } from '@/hooks/admin/use-admin-auth-fetch';
import { useAtomValue } from 'jotai';

const createRealmSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  displayName: z.string().min(1, {
    message: 'Display name is required.',
  }),
  description: z.string().optional(),
});

type CreateRealmValues = z.infer<typeof createRealmSchema>;

export default function CreateRealmPage() {
  const router = useRouter();
  const accessToken = useAtomValue(accessTokenAtom);
  const { setTokens, getRefreshToken } = useAdminAuthFetch();
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createRealm, isPending: isCreatePending } = useMutation(AuthService.method.createRealm);
  const { mutateAsync: refreshToken, isPending: isRefreshPending } = useMutation(AuthService.method.refreshToken);

  const isPending = isCreatePending || isRefreshPending;

  const form = useForm<CreateRealmValues>({
    resolver: zodResolver(createRealmSchema),
    defaultValues: {
      name: '',
      displayName: '',
      description: '',
    },
  });

  // Handle F5 refresh - check if user has access token
  useEffect(() => {
    if (!accessToken) {
      router.push('/admin/login');
    }
  }, [accessToken, router]);

  async function onSubmit(values: CreateRealmValues) {
    setError(null);
    try {
      const response = await createRealm({
        name: values.name,
        displayName: values.displayName,
        description: values.description || '',
      });

      if (response.success && response.realm) {
        toast.success('Realm created successfully');

        // Refresh token with the created realm's ID
        const refreshTokenValue = getRefreshToken();
        if (refreshTokenValue) {
          try {
            const refreshResponse = await refreshToken({
              refreshToken: refreshTokenValue,
              realmId: response.realm.id,
            });

            if (refreshResponse.success) {
              setTokens(refreshResponse.accessToken, refreshResponse.refreshToken);
              router.push('/admin/dashboard');
            } else {
              setError('Failed to refresh token');
              toast.error('Failed to refresh token');
            }
          } catch (e: unknown) {
            console.error('Failed to refresh token:', e);
            setError('Failed to refresh token');
            toast.error('Failed to refresh token');
          }
        } else {
          setError('No refresh token available');
          toast.error('No refresh token available');
        }
      } else {
        setError(response.message || 'Failed to create realm');
        toast.error(response.message || 'Failed to create realm');
      }
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : 'An unexpected error occurred');
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    }
  }

  if (!accessToken) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="container">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create Your Realm</h1>
            <p className="text-muted-foreground text-sm">Create your first realm to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="my-realm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Realm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="A brief description of your realm" {...field} />
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
                Create Realm
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

