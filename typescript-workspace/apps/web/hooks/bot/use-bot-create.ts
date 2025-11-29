import { useMutation } from '@connectrpc/connect-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { BotService } from '@workspace/proto-gen/src/bot_pb';

import type { BotCreateValues } from '@/lib/schemas/bot';

/**
 * Hook for creating a new bot via ConnectRPC
 */
export function useBotCreate() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: createBot, isPending } = useMutation(BotService.method.createBot);

  const handleCreate = async (values: BotCreateValues) => {
    try {
      // Note: realm_id should be extracted from the authenticated user's context on the backend
      // The backend should get the realm_id from the JWT token or session
      // For now, passing empty string - backend must handle realm_id extraction
      const realmId = ''; // Backend will extract from auth context

      // Map channel bridge objects to protobuf format
      const apiChannelBridge = values.apiChannelBridge
        ? {
            bridgeType: values.apiChannelBridge.bridgeType,
            thirdProviderType: values.apiChannelBridge.thirdProviderType,
            thirdId: values.apiChannelBridge.thirdId,
            thirdSecret: values.apiChannelBridge.thirdSecret,
            apiEndpoint: values.apiChannelBridge.apiEndpoint || '',
            apiVersion: values.apiChannelBridge.apiVersion || '',
            accessToken: '',
            refreshToken: '',
            tokenExpiry: '',
            oauthScopes: [],
          }
        : undefined;

      const oauthChannelBridge = values.oauthChannelBridge
        ? {
            bridgeType: values.oauthChannelBridge.bridgeType,
            thirdProviderType: values.oauthChannelBridge.thirdProviderType,
            thirdId: values.oauthChannelBridge.thirdId,
            thirdSecret: values.oauthChannelBridge.thirdSecret,
            oauthScopes: values.oauthChannelBridge.oauthScopes || [],
            accessToken: values.oauthChannelBridge.accessToken || '',
            refreshToken: values.oauthChannelBridge.refreshToken || '',
            tokenExpiry: values.oauthChannelBridge.tokenExpiry || '',
            apiEndpoint: '',
            apiVersion: '',
          }
        : undefined;

      const response = await createBot({
        realmId,
        name: values.name,
        displayName: values.displayName,
        description: values.description || '',
        apiChannelBridge,
        oauthChannelBridge,
        isActive: true, // Default to active
        capabilities: values.capabilities || [],
      });

      if (response.success) {
        toast.success('Bot created successfully!');

        // Invalidate bot list query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['bots'] });

        // Redirect to bot list or detail page
        if (response.bot?.id) {
          router.push(`/admin/bot/${response.bot.id}`);
        } else {
          router.push('/admin/bot');
        }
      } else {
        toast.error(response.message || 'Failed to create bot');
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      throw error;
    }
  };

  return {
    createBot: handleCreate,
    isPending,
  };
}
