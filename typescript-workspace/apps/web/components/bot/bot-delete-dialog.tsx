'use client';

import { useState } from 'react';

import { Button } from '@workspace/ui/components/button';

import { useBotDelete } from '@/hooks/bot/use-bot-delete';

interface BotDeleteDialogProps {
  botId: string;
  botName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Bot delete confirmation dialog component
 *
 * Shows a confirmation dialog before deleting a bot
 * Handles deletion, cancellation, and error states
 */
export function BotDeleteDialog({ botId, botName, isOpen, onClose }: BotDeleteDialogProps) {
  const { deleteBot, isPending } = useBotDelete();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteBot(botId);
      // Redirect handled in hook
      onClose();
    } catch (err) {
      // Error handling - show in dialog
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="bg-background/80 fixed inset-0 backdrop-blur-sm" onClick={handleCancel} />

      {/* Dialog */}
      <div className="bg-background relative z-50 w-full max-w-md rounded-lg border p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold">Delete Bot</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Are you sure you want to delete <strong>{botName}</strong>? This action cannot be undone.
        </p>

        {error && (
          <div className="border-destructive bg-destructive/10 mb-4 rounded-md border p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
