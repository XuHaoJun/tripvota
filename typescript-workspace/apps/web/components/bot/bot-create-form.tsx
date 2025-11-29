'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';

import { useBotCreate } from '@/hooks/bot/use-bot-create';
import { botCreateSchema, type BotCreateValues } from '@/lib/schemas/bot';

/**
 * Bot create form component
 *
 * Allows users to create new bots with:
 * - Required: name, display name, at least one channel bridge (API or OAuth)
 * - Optional: description, capabilities
 * - Inline channel bridge creation: Users create channel bridges as part of bot creation
 */
export function BotCreateForm() {
  const router = useRouter();
  const { createBot, isPending } = useBotCreate();

  const form = useForm<BotCreateValues>({
    resolver: zodResolver(botCreateSchema),
    defaultValues: {
      name: '',
      displayName: '',
      description: '',
      capabilities: [],
      apiChannelBridge: undefined,
      oauthChannelBridge: undefined,
    },
  });

  async function onSubmit(values: BotCreateValues) {
    try {
      await createBot(values);
      // Redirect handled in hook
    } catch (error) {
      // Error handling done in hook
      // Additional error state could be set here if needed for form-level errors
      if (error instanceof Error && error.message.includes('duplicate')) {
        form.setError('name', {
          type: 'manual',
          message: 'A bot with this name already exists in your realm',
        });
      }
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Create New Bot</h1>
        <p className="text-muted-foreground mt-2 text-sm">Configure a new bot for your realm</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot Name *</FormLabel>
                <FormControl>
                  <Input placeholder="my-bot" {...field} />
                </FormControl>
                <FormDescription>Unique identifier for the bot within your realm</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name *</FormLabel>
                <FormControl>
                  <Input placeholder="My Bot" {...field} />
                </FormControl>
                <FormDescription>Human-readable name for the bot</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Optional description of the bot's purpose"
                  />
                </FormControl>
                <FormDescription>Optional description of what this bot does</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <FormLabel>Channel Bridges *</FormLabel>
              <FormDescription className="mb-4">
                At least one channel bridge (API or OAuth) is required. Create the bridge configuration below.
              </FormDescription>
            </div>

            {/* API Channel Bridge */}
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <FormLabel>API Channel Bridge</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (form.getValues('apiChannelBridge')) {
                      form.setValue('apiChannelBridge', undefined);
                    } else {
                      form.setValue('apiChannelBridge', {
                        bridgeType: 'api',
                        thirdProviderType: 'line',
                        thirdId: '',
                        thirdSecret: '',
                        apiEndpoint: '',
                        apiVersion: '',
                      });
                    }
                  }}
                >
                  {form.watch('apiChannelBridge') ? 'Remove' : 'Add API Bridge'}
                </Button>
              </div>

              {form.watch('apiChannelBridge') && (
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="apiChannelBridge.thirdProviderType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Type *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          >
                            <option value="line">Line</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apiChannelBridge.thirdId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your API Key ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apiChannelBridge.thirdSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your API Secret" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apiChannelBridge.apiEndpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Endpoint</FormLabel>
                        <FormControl>
                          <Input placeholder="https://api.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apiChannelBridge.apiVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Version</FormLabel>
                        <FormControl>
                          <Input placeholder="v1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* OAuth Channel Bridge */}
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <FormLabel>OAuth Channel Bridge</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (form.getValues('oauthChannelBridge')) {
                      form.setValue('oauthChannelBridge', undefined);
                    } else {
                      form.setValue('oauthChannelBridge', {
                        bridgeType: 'oauth',
                        thirdProviderType: 'line',
                        thirdId: '',
                        thirdSecret: '',
                        oauthScopes: [],
                      });
                    }
                  }}
                >
                  {form.watch('oauthChannelBridge') ? 'Remove' : 'Add OAuth Bridge'}
                </Button>
              </div>

              {form.watch('oauthChannelBridge') && (
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="oauthChannelBridge.thirdProviderType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Type *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          >
                            <option value="line">Line</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oauthChannelBridge.thirdId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your OAuth Client ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oauthChannelBridge.thirdSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Secret *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your OAuth Client Secret" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oauthChannelBridge.oauthScopes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OAuth Scopes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="profile, openid, email (comma-separated)"
                            value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                            onChange={(e) => {
                              const values = e.target.value
                                .split(',')
                                .map((v) => v.trim())
                                .filter((v) => v.length > 0);
                              field.onChange(values.length > 0 ? values : undefined);
                            }}
                          />
                        </FormControl>
                        <FormDescription>Enter OAuth scopes as comma-separated values</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="capabilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capabilities</FormLabel>
                <FormControl>
                  <Input
                    placeholder="capability1, capability2, ..."
                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                    onChange={(e) => {
                      const values = e.target.value
                        .split(',')
                        .map((v) => v.trim())
                        .filter((v) => v.length > 0);
                      field.onChange(values.length > 0 ? values : undefined);
                    }}
                  />
                </FormControl>
                <FormDescription>Enter capabilities as comma-separated values (free-form)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              Create Bot
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
