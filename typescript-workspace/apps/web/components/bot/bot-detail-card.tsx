'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

import { BotDeleteDialog } from '@/components/bot/bot-delete-dialog';
import type { GetBotQuery } from '@/lib/graphql/types';

type Bot = NonNullable<GetBotQuery['bot']>;

interface BotDetailCardProps {
  bot: Bot;
}

/**
 * Bot detail card component displaying all bot information
 * Shows all fields including relations (realm, channel bridges)
 * Handles empty optional fields gracefully
 */
export function BotDetailCard({ bot }: BotDetailCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const formatArray = (arr: readonly (string | null)[] | null | undefined) => {
    if (!arr || arr.length === 0) return 'Not set';
    return arr.filter((item): item is string => item !== null).join(', ');
  };

  const formatMetadata = (metadata: unknown) => {
    if (!metadata) return 'Not set';
    return JSON.stringify(metadata, null, 2);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{bot.displayName}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Bot Details</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/bot/edit/${bot.id}`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </Button>
          <Link href="/admin/bot">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm font-medium">Bot Name</dt>
              <dd className="mt-1 text-sm">{bot.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm font-medium">Display Name</dt>
              <dd className="mt-1 text-sm">{bot.displayName}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground text-sm font-medium">Description</dt>
              <dd className="mt-1 text-sm">{bot.description || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm font-medium">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    bot.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {bot.isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm font-medium">Bot ID</dt>
              <dd className="mt-1 font-mono text-xs">{bot.id}</dd>
            </div>
          </dl>
        </div>

        {/* Realm Information */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Realm</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {bot.realm ? (
              <>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">Realm Name</dt>
                  <dd className="mt-1 text-sm">{bot.realm.name || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">Realm ID</dt>
                  <dd className="mt-1 font-mono text-xs">{bot.realm.id}</dd>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground text-sm">Realm information not available</p>
              </div>
            )}
          </dl>
        </div>

        {/* Channel Bridges */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Channel Bridges</h2>
          <div className="space-y-4">
            {bot.apiChannelBridge ? (
              <div className="rounded-md border p-4">
                <h3 className="mb-2 text-sm font-medium">API Channel Bridge</h3>
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">Bridge Type</dt>
                    <dd className="mt-1 text-sm">{bot.apiChannelBridge.bridgeType || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">Provider Type</dt>
                    <dd className="mt-1 text-sm">{bot.apiChannelBridge.thirdProviderType || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">Bridge ID</dt>
                    <dd className="mt-1 font-mono text-xs">{bot.apiChannelBridge.id}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-4">
                <p className="text-muted-foreground text-sm">No API channel bridge configured</p>
              </div>
            )}

            {bot.oauthChannelBridge ? (
              <div className="rounded-md border p-4">
                <h3 className="mb-2 text-sm font-medium">OAuth Channel Bridge</h3>
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">Bridge Type</dt>
                    <dd className="mt-1 text-sm">{bot.oauthChannelBridge.bridgeType || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">Provider Type</dt>
                    <dd className="mt-1 text-sm">{bot.oauthChannelBridge.thirdProviderType || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">Bridge ID</dt>
                    <dd className="mt-1 font-mono text-xs">{bot.oauthChannelBridge.id}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-4">
                <p className="text-muted-foreground text-sm">No OAuth channel bridge configured</p>
              </div>
            )}
          </div>
        </div>

        {/* Capabilities */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Capabilities</h2>
          <p className="text-sm">{formatArray(bot.capabilities)}</p>
        </div>

        {/* Metadata */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Metadata</h2>
          <div className="bg-muted rounded-md p-4">
            <pre className="text-muted-foreground overflow-x-auto text-xs">{formatMetadata(bot.metadata)}</pre>
          </div>
        </div>

        {/* Timestamps */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Timestamps</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm font-medium">Created At</dt>
              <dd className="mt-1 text-sm">{formatDate(bot.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm font-medium">Updated At</dt>
              <dd className="mt-1 text-sm">{formatDate(bot.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <BotDeleteDialog
        botId={bot.id}
        botName={bot.displayName}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
