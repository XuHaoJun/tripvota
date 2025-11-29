'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@workspace/ui/components/button';

import { BotDetailCard } from '@/components/bot/bot-detail-card';
import { useBotDetail } from '@/hooks/bot/use-bot-detail';

/**
 * Bot detail page component
 * Displays detailed information about a specific bot
 */
export default function BotDetailPage() {
  const params = useParams();
  // Decode URL-encoded ID (e.g., %3D becomes =)
  const id = params.id ? decodeURIComponent(params.id as string) : undefined;
  const { data: bot, isLoading, error } = useBotDetail(id);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="relative">
          <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="text-muted-foreground">Loading bot details...</div>
          </div>
          {/* Show previous content skeleton while loading */}
          <div className="rounded-lg border p-6">
            <div className="bg-muted mb-4 h-8 w-48 animate-pulse rounded" />
            <div className="space-y-2">
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="border-destructive rounded-lg border p-6">
          <h2 className="text-destructive mb-2 text-lg font-semibold">Error Loading Bot</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <div className="flex gap-2">
            <Link href="/admin/bot">
              <Button variant="outline">Back to List</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-lg font-semibold">Bot Not Found</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            The bot you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/admin/bot">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <BotDetailCard bot={bot} />;
}
