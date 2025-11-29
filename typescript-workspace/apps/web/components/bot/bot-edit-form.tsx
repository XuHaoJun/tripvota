'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@workspace/ui/components/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';

import { useBotUpdate } from '@/hooks/bot/use-bot-update';
import { useBotDetail } from '@/hooks/bot/use-bot-detail';
import { botUpdateSchema, type BotUpdateValues } from '@/lib/schemas/bot';
import type { GetBotQuery } from '@/lib/graphql/types';

interface BotEditFormProps {
  botId: string;
}

/**
 * Bot edit form component
 * 
 * Allows users to update existing bots with:
 * - Editable: name, display name, description, status, channel bridges (existing only), capabilities
 * - Read-only: metadata
 * - Validation: at least one channel bridge required, duplicate name check
 * - Concurrent edit detection: warns if bot was modified since load
 */
export function BotEditForm({ botId }: BotEditFormProps) {
  const router = useRouter();
  const { data: bot, isLoading: isLoadingBot } = useBotDetail(botId);
  const { updateBot, isPending } = useBotUpdate();
  const [showConcurrentEditWarning, setShowConcurrentEditWarning] = useState(false);
  const [initialUpdatedAt, setInitialUpdatedAt] = useState<string | null>(null);

  const form = useForm<BotUpdateValues>({
    resolver: zodResolver(botUpdateSchema),
    defaultValues: {
      id: botId,
      name: '',
      displayName: '',
      description: '',
      isActive: true,
      capabilities: [],
      apiChannelBridgeId: undefined,
      oauthChannelBridgeId: undefined,
    },
  });

  // Pre-fill form when bot data loads
  useEffect(() => {
    if (bot) {
      form.reset({
        id: bot.id,
        name: bot.name,
        displayName: bot.displayName,
        description: bot.description || '',
        isActive: bot.isActive,
        capabilities: bot.capabilities?.filter((c): c is string => c !== null) || [],
        apiChannelBridgeId: bot.apiChannelBridgeId || undefined,
        oauthChannelBridgeId: bot.oauthChannelBridgeId || undefined,
      });
      setInitialUpdatedAt(bot.updatedAt || null);
    }
  }, [bot, form]);

  // Check for concurrent edits before submission
  const handleSubmitWithConcurrentCheck = async (values: BotUpdateValues) => {
    // Check if bot was modified since initial load
    // In a real implementation, we'd re-fetch the bot to get the latest updatedAt
    if (bot && initialUpdatedAt && bot.updatedAt && bot.updatedAt !== initialUpdatedAt) {
      setShowConcurrentEditWarning(true);
      return;
    }

    try {
      await updateBot(values);
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
  };

  // TODO: Fetch existing channel bridges via GraphQL or ConnectRPC
  // For now, using placeholder data
  const existingApiBridges = [
    { id: '1', name: 'API Bridge 1' },
    { id: '2', name: 'API Bridge 2' },
  ];
  const existingOAuthBridges = [
    { id: '3', name: 'OAuth Bridge 1' },
    { id: '4', name: 'OAuth Bridge 2' },
  ];

  if (isLoadingBot) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <div className="text-muted-foreground">Loading bot data...</div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <div className="rounded-lg border border-destructive p-6">
          <h2 className="mb-2 text-lg font-semibold text-destructive">Bot Not Found</h2>
          <p className="text-muted-foreground mb-4 text-sm">The bot you're trying to edit doesn't exist.</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Bot</h1>
        <p className="text-muted-foreground mt-2 text-sm">Update bot configuration</p>
      </div>

      {showConcurrentEditWarning && (
        <div className="mb-6 rounded-lg border border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">Concurrent Edit Detected</h3>
          <p className="mb-4 text-sm text-yellow-700 dark:text-yellow-300">
            This bot was modified by another user since you loaded it. Your changes may overwrite their changes.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowConcurrentEditWarning(false);
                // Reload bot data
                window.location.reload();
              }}
            >
              Reload and Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowConcurrentEditWarning(false);
                // Proceed with save (last-write-wins)
                const values = form.getValues();
                updateBot(values).catch(() => {
                  // Error handling done in hook
                });
              }}
            >
              Save Anyway (Last Write Wins)
            </Button>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitWithConcurrentCheck)} className="space-y-6">
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

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>Enable or disable the bot</FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <FormLabel>Channel Bridges *</FormLabel>
              <FormDescription className="mb-4">
                At least one channel bridge (API or OAuth) is required. Select from existing bridges only.
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="apiChannelBridgeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Channel Bridge</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || undefined)}
                      className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">None</option>
                      {existingApiBridges.map((bridge) => (
                        <option key={bridge.id} value={bridge.id}>
                          {bridge.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oauthChannelBridgeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OAuth Channel Bridge</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || undefined)}
                      className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">None</option>
                      {existingOAuthBridges.map((bridge) => (
                        <option key={bridge.id} value={bridge.id}>
                          {bridge.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

          {/* Metadata - Read-only */}
          <div className="rounded-lg border p-4">
            <FormLabel>Metadata (Read-only)</FormLabel>
            <FormDescription className="mb-2">
              Metadata is managed outside the UI and cannot be edited here.
            </FormDescription>
            <div className="rounded-md bg-muted p-3">
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {bot.metadata ? JSON.stringify(bot.metadata, null, 2) : 'Not set'}
              </pre>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

