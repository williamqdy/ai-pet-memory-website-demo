export type PetStatus = 'active' | 'memorial'

export type PetType = 'cat' | 'dog'

export type PetSex = 'male' | 'female'

export type PetNeuteredStatus = 'neutered' | 'not_neutered'

export type User = {
  id: string
  username: string
  email?: string
}

export type Pet = {
  id: string
  name: string
  type: PetType
  breed: string
  sex: PetSex
  neuteredStatus: PetNeuteredStatus
  avatar: string
  status: PetStatus
  birthday: string
  arrivalDate?: string
  memorialDate?: string
}

export type TimelineEvent = {
  id: string
  petId: string
  title: string
  date: string
  image: string
  note?: string
  status: PetStatus
}

export type AlbumPhoto = {
  id: string
  petId: string
  image: string
  date: string
  note?: string
  status: PetStatus
}

export type DiaryEntry = {
  id: string
  petId: string
  date: string
  weekday: string
  time?: string
  content: string
  image?: string
  status: PetStatus
}

export type GrowthRecord = {
  id: string
  petId: string
  category: string
  title: string
  description: string
  recordDate: string
  nextReminder?: string
  location?: string
  note?: string
  completed?: boolean
  status: PetStatus
}
