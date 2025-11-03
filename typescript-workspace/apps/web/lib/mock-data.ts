export interface ConversationMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface DraftItem {
  id: string;
  title: string;
  description: string;
  category?: string;
}

export interface TimelineItem {
  id: string;
  draftId: string;
  time: string;
  date: string;
  title: string;
}

export const initialMessages: ConversationMessage[] = [
  {
    id: '1',
    role: 'ai',
    content: '你好！我是你的旅行助手。告诉我你想去哪里旅行，或者有什么想法吗？',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    role: 'user',
    content: '我想去日本东京旅行，大概5天左右',
    timestamp: new Date(Date.now() - 3300000),
  },
  {
    id: '3',
    role: 'ai',
    content: '太好了！东京是个很棒的选择。我可以为你推荐一些必去的景点：\n\n1. 浅草寺 - 感受传统日本文化\n2. 东京塔 - 俯瞰城市全景\n3. 涩谷十字路口 - 体验繁忙的都市生活\n4. 新宿御苑 - 享受宁静的日式庭园\n5. 银座 - 购物和美食天堂\n\n你想先从哪个开始规划？',
    timestamp: new Date(Date.now() - 3000000),
  },
];

export const initialDraftItems: DraftItem[] = [];

export const initialTimelineItems: TimelineItem[] = [];

