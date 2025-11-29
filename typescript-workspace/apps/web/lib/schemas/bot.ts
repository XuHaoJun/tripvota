import * as z from 'zod';

// Channel bridge input schema for creating bridges inline
const channelBridgeInputSchema = z.object({
  bridgeType: z.enum(['api', 'oauth'], {
    required_error: 'Bridge type is required.',
  }),
  thirdProviderType: z.string().min(1, {
    message: 'Provider type is required.',
  }),
  thirdId: z.string().min(1, {
    message: 'Third-party ID is required.',
  }),
  thirdSecret: z.string().min(1, {
    message: 'Third-party secret is required.',
  }),
  // OAuth-specific fields
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiry: z.string().optional(),
  oauthScopes: z.array(z.string()).optional(),
  // API-specific fields
  apiEndpoint: z.string().optional(),
  apiVersion: z.string().optional(),
});

export const botCreateSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Bot name is required.',
    }),
    displayName: z.string().min(1, {
      message: 'Display name is required.',
    }),
    description: z.string().optional(),
    capabilities: z.array(z.string()).optional(),
    apiChannelBridge: channelBridgeInputSchema.optional(),
    oauthChannelBridge: channelBridgeInputSchema.optional(),
  })
  .refine((data) => data.apiChannelBridge || data.oauthChannelBridge, {
    message: 'At least one channel bridge (API or OAuth) is required.',
    path: ['apiChannelBridge'], // Show error on first channel bridge field
  });

export type BotCreateValues = z.infer<typeof botCreateSchema>;

// Update schema uses IDs for channel bridges (select from existing only)
export const botUpdateSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1, {
      message: 'Bot name is required.',
    }),
    displayName: z.string().min(1, {
      message: 'Display name is required.',
    }),
    description: z.string().optional(),
    capabilities: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    apiChannelBridgeId: z.string().uuid().optional(),
    oauthChannelBridgeId: z.string().uuid().optional(),
  })
  .refine((data) => data.apiChannelBridgeId || data.oauthChannelBridgeId, {
    message: 'At least one channel bridge (API or OAuth) is required.',
    path: ['apiChannelBridgeId'],
  });

export type BotUpdateValues = z.infer<typeof botUpdateSchema>;
