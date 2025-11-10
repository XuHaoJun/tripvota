// Message type matching messages table schema
export interface Message {
  id: string;
  chatId: string;
  senderRole: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// TripCard type matching trip_cards table schema
// Unified type for both draft pool and timeline (distinguished by status field)
export interface TripCard {
  id: string;
  tripId: string;
  createdBy: string;
  title: string;
  description: string | null;
  category: string | null;
  startTime: Date | null;
  endTime: Date | null;
  status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
  displayOrder: number | null;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const initialMessages: Message[] = [
  {
    id: '1',
    chatId: 'chat-1',
    senderRole: 'assistant',
    content: '你好！我是你的旅行助手。告诉我你想去哪里旅行，或者有什么想法吗？',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    chatId: 'chat-1',
    senderRole: 'user',
    content: '我想去日本东京旅行，大概5天左右',
    createdAt: new Date(Date.now() - 3300000),
  },
  {
    id: '3',
    chatId: 'chat-1',
    senderRole: 'assistant',
    content:
      '太好了！东京是个很棒的选择。我可以为你推荐一些必去的景点：\n\n1. 浅草寺 - 感受传统日本文化\n2. 东京塔 - 俯瞰城市全景\n3. 涩谷十字路口 - 体验繁忙的都市生活\n4. 新宿御苑 - 享受宁静的日式庭园\n5. 银座 - 购物和美食天堂\n\n你想先从哪个开始规划？',
    createdAt: new Date(Date.now() - 3000000),
  },
];

export const initialTripCards: TripCard[] = [];
