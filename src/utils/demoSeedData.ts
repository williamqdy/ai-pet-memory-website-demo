import { mockPet } from '../data/mockData'
import type { GrowthRecord, Pet, PetType, TimelineEvent } from '../types'
import { clearAlbumImages } from './albumImageDB'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storage'

const timelineDeletedEventIdsKey = 'petMemory:timelineDeletedEventIds'
const growthRecordsSeedKey = 'petMemory:growthRecordsSeedVersion'
const growthRecordsSeedVersion = '2026-06-growth-records-species-demo-v1'

let hasSeededDemoDataThisRuntime = false

export const normalizeDemoPetType = (pet: Pet): PetType => {
  const rawType = String(
    (pet as Pet & { petType?: string; species?: string }).type ||
      (pet as Pet & { petType?: string }).petType ||
      (pet as Pet & { species?: string }).species ||
      '',
  )

  return rawType === 'dog' || rawType === '狗狗' || rawType === '犬'
    ? 'dog'
    : 'cat'
}

export const createDemoTimelineEvents = (
  petType: PetType,
  petId: string,
): TimelineEvent[] => {
  const activeEvents =
    petType === 'dog'
      ? [
          {
            date: '2023-09-23',
            id: 'active-demo-dog-first-home',
            image: '/images/auth/album-page/bed.png',
            note: '第一次把 TA 接回家，小小一只却把家里填得很满。',
            title: '第一次回家',
          },
          {
            date: '2026-06-22',
            id: 'active-demo-dog-first-walk',
            image: '/images/auth/album-page/play.png',
            note: '第一次牵着 TA 出门散步，东闻闻西看看，像认识了整个世界。',
            title: '第一次散步',
          },
          {
            date: '2026-06-03',
            id: 'active-demo-dog-park',
            image: '/images/auth/album-page/garden.png',
            note: '在公园里追着风跑了一会儿，留下了一段轻松的小回忆。',
            title: '第一次去公园',
          },
          {
            date: '2025-09-23',
            id: 'active-demo-dog-birthday',
            image: '/images/auth/album-page/birthday.png',
            note: '给 TA 准备了小蛋糕，记录又长大一岁的日子。',
            title: '生日小记录',
          },
        ]
      : [
          {
            date: '2023-09-23',
            id: 'active-demo-cat-first-home',
            image: '/images/auth/album-page/bed.png',
            note: '第一次把 TA 接回家，小小一只却把家里填得很满。',
            title: '第一次回家',
          },
          {
            date: '2026-06-22',
            id: 'active-demo-cat-scratch-board',
            image: '/images/auth/album-page/play.png',
            note: '第一次认真研究猫抓板，抓一下、看一眼，像在宣布这是自己的新领地。',
            title: '第一次玩猫抓板',
          },
          {
            date: '2026-06-03',
            id: 'active-demo-cat-garden',
            image: '/images/auth/album-page/garden.png',
            note: '在花园里闻闻草地、看看蝴蝶，留下了一段轻松的小回忆。',
            title: '花园里的小探险',
          },
          {
            date: '2025-09-23',
            id: 'active-demo-cat-birthday',
            image: '/images/auth/album-page/birthday.png',
            note: '给 TA 准备了小蛋糕，记录又长大一岁的日子。',
            title: '生日小记录',
          },
        ]

  const memorialEvents =
    petType === 'dog'
      ? [
          {
            date: '2019-06-22',
            id: 'memorial-demo-dog-first-home',
            image: '/images/auth/album-page/memorial1.png',
            note: '那一天 TA 来到家里，也从那天开始成为家人。',
            title: '第一次回家',
          },
          {
            date: '2021-04-18',
            id: 'memorial-demo-dog-afternoon',
            image: '/images/auth/album-page/memorial2.png',
            note: '阳光落在窗边，TA 安静地趴在那里，是很温柔的一段回忆。',
            title: '最喜欢的午后',
          },
          {
            date: '2023-09-23',
            id: 'memorial-demo-dog-birthday',
            image: '/images/auth/album-page/memorial3.png',
            note: '那天给 TA 准备了小小的仪式，想把这份记忆认真保存下来。',
            title: '生日那天',
          },
          {
            date: '2025-11-08',
            id: 'memorial-demo-dog-last-walk',
            image: '/images/auth/album-page/memorial4.png',
            note: '那天走得很慢，但每一步都很珍贵。',
            title: '最后一次散步',
          },
        ]
      : [
          {
            date: '2019-06-22',
            id: 'memorial-demo-cat-first-home',
            image: '/images/auth/album-page/memorial1.png',
            note: '那一天 TA 来到家里，也从那天开始成为家人。',
            title: '第一次回家',
          },
          {
            date: '2021-04-18',
            id: 'memorial-demo-cat-afternoon',
            image: '/images/auth/album-page/memorial2.png',
            note: '阳光落在窗边，TA 安静地趴在那里，是很温柔的一段回忆。',
            title: '最喜欢的午后',
          },
          {
            date: '2023-09-23',
            id: 'memorial-demo-cat-birthday',
            image: '/images/auth/album-page/memorial3.png',
            note: '那天给 TA 准备了小小的仪式，想把这份记忆认真保存下来。',
            title: '生日那天',
          },
          {
            date: '2025-11-08',
            id: 'memorial-demo-cat-window',
            image: '/images/auth/album-page/memorial4.png',
            note: '窗边那块阳光还在，想起 TA 曾经安静陪着我们的许多时刻。',
            title: '窗边的小日子',
          },
        ]

  return [...activeEvents, ...memorialEvents].map((event) => ({
    ...event,
    petId,
    status: event.id.startsWith('active-demo-') ? 'active' : 'memorial',
  }))
}

export const isDemoTimelineEventId = (eventId: string) =>
  eventId.startsWith('active-demo-') || eventId.startsWith('memorial-demo-')

export const createDemoGrowthRecords = (
  petType: PetType,
  petId: string,
): GrowthRecord[] => {
  const isDog = petType === 'dog'

  return [
    {
      id: 'growth-vaccine',
      petId,
      category: '疫苗',
      title: '疫苗接种',
      description: isDog ? '犬六联疫苗（第二针）' : '猫三联疫苗（第二针）',
      recordDate: '2024-12-20',
      nextReminder: '2025-01-20',
      location: '安心宠物医院',
      completed: false,
      status: 'active',
    },
    {
      id: 'growth-deworming',
      petId,
      category: '驱虫',
      title: isDog ? '体内外驱虫' : '体内驱虫',
      description: isDog ? '犬用体内外驱虫' : '海乐妙 / 大宠爱',
      recordDate: '2024-12-05',
      nextReminder: '2025-03-05',
      location: '居家护理',
      completed: false,
      status: 'active',
    },
    {
      id: 'growth-annual-checkup',
      petId,
      category: '体检',
      title: '年度体检',
      description: '基础体检套餐（血常规、生化等）',
      recordDate: '2024-11-18',
      nextReminder: '2025-11-18',
      location: '安心宠物诊所',
      completed: false,
      status: 'active',
    },
    {
      id: 'growth-care',
      petId,
      category: '护理',
      title: '护理记录',
      description: '洗澡、剪指甲、耳道清洁',
      recordDate: '2024-09-10',
      nextReminder: '',
      location: '居家护理',
      completed: false,
      status: 'active',
    },
    {
      id: 'growth-memorial-vaccine',
      petId,
      category: '疫苗/绝育',
      title: '疫苗记录',
      description: isDog ? '犬六联疫苗（第二针）' : '猫三联疫苗（第二针）',
      recordDate: '2024-12-20',
      location: '安心宠物医院',
      completed: false,
      status: 'memorial',
    },
    {
      id: 'growth-memorial-visit',
      petId,
      category: '就诊',
      title: '重要就诊',
      description: '疾病就诊、检查与治疗记录',
      recordDate: '2024-10-15',
      location: '安心宠物诊所',
      completed: false,
      status: 'memorial',
    },
    {
      id: 'growth-memorial-care',
      petId,
      category: '护理',
      title: '护理记录',
      description: '洗澡、美容、居家护理等记录',
      recordDate: '2024-08-30',
      location: '家里',
      completed: false,
      status: 'memorial',
    },
    {
      id: 'growth-memorial-checkup',
      petId,
      category: '体检',
      title: '年度体检',
      description: '年度体检（血常规、生化等）',
      recordDate: '2024-11-18',
      location: '安心宠物诊所',
      completed: false,
      status: 'memorial',
    },
  ]
}

const resetAlbumSessionState = () => {
  window.sessionStorage.removeItem('petMemory:albumCarouselIndex:active')
  window.sessionStorage.removeItem('petMemory:albumCarouselIndex:memorial')
  window.sessionStorage.removeItem('petMemory:albumHiddenExamplePhotos:active')
  window.sessionStorage.removeItem('petMemory:albumHiddenExamplePhotos:memorial')
}

export const seedTimelineDemoData = (petType: PetType, petId: string) => {
  window.localStorage.removeItem(timelineDeletedEventIdsKey)
  setStorageItem(STORAGE_KEYS.timelineEvents, createDemoTimelineEvents(petType, petId))
}

export const seedAlbumDemoData = () => {
  setStorageItem(STORAGE_KEYS.albumPhotos, [])
  resetAlbumSessionState()
  void clearAlbumImages().catch(() => undefined)
}

export const seedGrowthRecordsDemoData = (petType: PetType, petId: string) => {
  setStorageItem(STORAGE_KEYS.growthRecords, createDemoGrowthRecords(petType, petId))
  window.localStorage.setItem(
    growthRecordsSeedKey,
    `${growthRecordsSeedVersion}:${petType}`,
  )
}

export const initializeDemoSeedData = () => {
  if (hasSeededDemoDataThisRuntime || typeof window === 'undefined') {
    return
  }

  const pet = getStorageItem<Pet>(STORAGE_KEYS.pet, mockPet)
  const petType = normalizeDemoPetType(pet)
  const petId = pet.id || mockPet.id

  seedTimelineDemoData(petType, petId)
  seedAlbumDemoData()
  seedGrowthRecordsDemoData(petType, petId)

  hasSeededDemoDataThisRuntime = true
}
