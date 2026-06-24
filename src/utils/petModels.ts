import type { PetType } from '../types'

const catModelPaths = ['/models/Cat.glb', '/models/Kitten.glb'] as const

const dogModelPaths = [
  '/models/Beagle.glb',
  '/models/Dog.glb',
  '/models/Shiba Inu.glb',
] as const

export const getPetModelOptions = (petType: PetType) =>
  petType === 'dog' ? dogModelPaths : catModelPaths

export const assignRandomPetModel = (petType: PetType) => {
  const options = getPetModelOptions(petType)
  const randomIndex = Math.floor(Math.random() * options.length)

  return options[randomIndex] ?? options[0]
}

export const isValidPetModelUrl = (modelUrl?: string) => {
  if (!modelUrl) {
    return false
  }

  return [...catModelPaths, ...dogModelPaths].includes(
    modelUrl as (typeof catModelPaths | typeof dogModelPaths)[number],
  )
}
