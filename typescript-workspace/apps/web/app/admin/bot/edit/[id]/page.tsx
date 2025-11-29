'use client';

import { useParams } from 'next/navigation';

import { BotEditForm } from '@/components/bot/bot-edit-form';

export default function BotEditPage() {
  const params = useParams();
  // Decode URL-encoded ID (e.g., %3D becomes =)
  const id = params.id ? decodeURIComponent(params.id as string) : undefined;

  if (!id) {
    return <div>Invalid bot ID</div>;
  }

  return <BotEditForm id={id} />;
}
