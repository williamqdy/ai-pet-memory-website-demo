import {
  mockAlbumPhotos,
  mockDiaryEntries,
  mockGrowthRecords,
  mockPet,
  mockTimelineEvents,
  mockUser,
} from '../data/mockData'
import type { PetStatus } from '../types'

export const STORAGE_KEYS = {
  user: 'petMemory:user',
  pet: 'petMemory:pet',
  status: 'petMemory:status',
  timelineEvents: 'petMemory:timelineEvents',
  albumPhotos: 'petMemory:albumPhotos',
  diaryEntries: 'petMemory:diaryEntries',
  growthRecords: 'petMemory:growthRecords',
} as const

export const SESSION_STORAGE_KEYS = {
  currentLoginSessionId: 'petMemory:currentLoginSessionId',
  memorialPreciousMomentsSelection:
    'petMemory:memorialPreciousMomentsSelection',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

const getLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export const getStorageItem = <T>(key: StorageKey, fallback: T): T => {
  const storage = getLocalStorage()

  if (!storage) {
    return fallback
  }

  const rawValue = storage.getItem(key)

  if (rawValue === null) {
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

export const setStorageItem = <T>(key: StorageKey, value: T) => {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  storage.setItem(key, JSON.stringify(value))
}

export const removeStorageItem = (key: StorageKey) => {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  storage.removeItem(key)
}

export const getOrSeedStorageItem = <T>(key: StorageKey, seedValue: T): T => {
  const storage = getLocalStorage()

  if (!storage) {
    return seedValue
  }

  if (storage.getItem(key) === null) {
    setStorageItem(key, seedValue)
    return seedValue
  }

  return getStorageItem(key, seedValue)
}

export const getPetStatus = (fallback: PetStatus = 'active'): PetStatus => {
  const storage = getLocalStorage()

  if (!storage) {
    return fallback
  }

  const status = storage.getItem(STORAGE_KEYS.status)

  return status === 'active' || status === 'memorial' ? status : fallback
}

export const setPetStatus = (status: PetStatus) => {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  storage.setItem(STORAGE_KEYS.status, status)
}

export const initializeDemoStorage = () => {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  getOrSeedStorageItem(STORAGE_KEYS.user, mockUser)
  getOrSeedStorageItem(STORAGE_KEYS.pet, mockPet)
  getOrSeedStorageItem(STORAGE_KEYS.timelineEvents, mockTimelineEvents)
  getOrSeedStorageItem(STORAGE_KEYS.albumPhotos, mockAlbumPhotos)
  getOrSeedStorageItem(STORAGE_KEYS.diaryEntries, mockDiaryEntries)
  getOrSeedStorageItem(STORAGE_KEYS.growthRecords, mockGrowthRecords)

  if (storage.getItem(STORAGE_KEYS.status) === null) {
    setPetStatus(mockPet.status)
  }
}

export const clearPetMemoryStorage = () => {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  Object.values(STORAGE_KEYS).forEach((key) => {
    storage.removeItem(key)
  })
}
