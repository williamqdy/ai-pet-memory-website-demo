import type {
  AlbumPhoto,
  DiaryEntry,
  GrowthRecord,
  Pet,
  TimelineEvent,
  User,
} from '../types'

export const mockUser: User = {
  id: 'user-demo',
  username: 'demo-user',
  email: 'demo@example.com',
}

export const mockPet: Pet = {
  id: 'pet-naitang',
  name: '奶糖',
  type: 'cat',
  breed: '布偶猫',
  sex: 'female',
  avatar: '',
  status: 'active',
  birthday: '2023-05-20',
  arrivalDate: '2023-07-01',
}

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'timeline-first-home',
    petId: mockPet.id,
    title: '第一次回家',
    date: '2023-07-01',
    image: '',
    note: '小小一只来到家里，新的故事从这天开始。',
    status: 'active',
  },
  {
    id: 'timeline-favorite-toy',
    petId: mockPet.id,
    title: '最爱的玩具',
    date: '2024-02-14',
    image: '',
    note: '那只小鱼玩偶陪了她很久。',
    status: 'memorial',
  },
]

export const mockAlbumPhotos: AlbumPhoto[] = [
  {
    id: 'photo-sunny-nap',
    petId: mockPet.id,
    image: '',
    date: '2024-04-18',
    note: '午后的阳光和一场安心的小睡。',
    status: 'active',
  },
  {
    id: 'photo-soft-memory',
    petId: mockPet.id,
    image: '',
    date: '2024-09-09',
    note: '想起她安静看着窗外的样子。',
    status: 'memorial',
  },
]

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: 'diary-warm-day',
    petId: mockPet.id,
    date: '2024-06-02',
    weekday: '星期日',
    time: '20:15',
    content: '今天奶糖趴在窗边晒太阳，看起来特别满足。',
    status: 'active',
  },
  {
    id: 'diary-letter',
    petId: mockPet.id,
    date: '2025-01-12',
    weekday: '星期日',
    time: '22:00',
    content: '今天又想起你轻轻踩过被子的声音。',
    status: 'memorial',
  },
]

export const mockGrowthRecords: GrowthRecord[] = [
  {
    id: 'growth-vaccine',
    petId: mockPet.id,
    category: '疫苗',
    title: '疫苗接种',
    description: '完成年度疫苗接种。',
    recordDate: '2024-03-10',
    nextReminder: '2025-03-10',
    location: '安心宠物诊所',
    completed: true,
    status: 'active',
  },
  {
    id: 'growth-checkup',
    petId: mockPet.id,
    category: '健康',
    title: '年度体检',
    description: '补充记录一次重要的体检。',
    recordDate: '2024-08-21',
    location: '安心宠物诊所',
    completed: true,
    status: 'memorial',
  },
]
