import { useMutation } from '@connectrpc/connect-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { BotService } from '@workspace/proto-gen/src/bot_pb';

import type { BotUpdateValues } from '@/lib/schemas/bot';

/**
 * Hook for updating an existing bot via ConnectRPC
 */
export function useBotUpdate() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: updateBot, isPending } = useMutation(BotService.method.updateBot);

  const handleUpdate = async (values: BotUpdateValues) => {
    try {
      const response = await updateBot({
        id: values.id,
        name: values.name,
        displayName: values.displayName,
        description: values.description || '',
        apiChannelBridgeId: values.apiChannelBridgeId || '',
        oauthChannelBridgeId: values.oauthChannelBridgeId || '',
        isActive: values.isActive ?? true,
        capabilities: values.capabilities || [],
      });

      if (response.success) {
        toast.success('Bot updated successfully!');
        
        // Invalidate bot queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['bot', values.id] });
        queryClient.invalidateQueries({ queryKey: ['bots'] });
        
        // Redirect to bot detail page
        router.push(`/admin/bot/${values.id}`);
      } else {
        toast.error(response.message || 'Failed to update bot');
      }
    } catch (error) {
      console.error('Error updating bot:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      throw error;
    }
  };

  return {
    updateBot: handleUpdate,
    isPending,
  };
}

