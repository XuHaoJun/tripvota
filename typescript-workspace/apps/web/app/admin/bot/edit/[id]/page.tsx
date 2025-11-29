'use client';

import { useParams } from 'next/navigation';

import { BotEditForm } from '@/components/bot/bot-edit-form';

export default function BotEditPage() {
  const params = useParams();
  const botId = params.id as string;

  return <BotEditForm botId={botId} />;
}
