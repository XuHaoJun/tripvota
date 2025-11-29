import { useMutation } from '@connectrpc/connect-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { BotService } from '@workspace/proto-gen/src/bot_pb';

/**
 * Hook for deleting a bot via ConnectRPC
 */
export function useBotDelete() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteBot, isPending } = useMutation(BotService.method.deleteBot);

  const handleDelete = async (botId: string) => {
    try {
      const response = await deleteBot({
        id: botId,
      });

      if (response.success) {
        toast.success(response.message || 'Bot deleted successfully');

        // Invalidate bot queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['bot', botId] });
        queryClient.invalidateQueries({ queryKey: ['bots'] });

        // Redirect to bot list
        router.push('/admin/bot');
      } else {
        toast.error(response.message || 'Failed to delete bot');
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      throw error;
    }
  };

  return {
    deleteBot: handleDelete,
    isPending,
  };
}
