import type { AiReferenceImageMeta, Pet } from '../types'
import {
  deleteAiReferenceImage,
  getAiReferenceImage,
  saveAiReferenceImage,
} from './aiReferenceImageDB'
import { compressImage, ImageCompressionError } from './imageCompression'

export type AiReferenceImageView = AiReferenceImageMeta & {
  dataUrl: string
}

export type AiReferenceUploadErrorCode =
  | 'file-too-large'
  | 'image-processing-failed'
  | 'storage-failed'
  | 'unsupported-type'

export class AiReferenceUploadError extends Error {
  code: AiReferenceUploadErrorCode

  constructor(code: AiReferenceUploadErrorCode) {
    super(code)
    this.code = code
  }
}

export const getAiReferenceUploadErrorMessage = (
  error: unknown,
  fallback = '照片处理失败，请换一张照片再试',
) => {
  if (error instanceof AiReferenceUploadError) {
    if (error.code === 'unsupported-type') {
      return '请上传 JPG、PNG 或 WEBP 格式的图片'
    }

    if (error.code === 'file-too-large') {
      return '这张照片超过 20MB，请选择更小的照片'
    }

    if (error.code === 'storage-failed') {
      return '浏览器本地存储空间不足，请删除部分参考图后再上传'
    }

    return '照片处理失败，请换一张照片再试'
  }

  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    return '本地存储空间不足，请删除部分参考图后再上传'
  }

  return fallback
}

const isAiReferenceImageMeta = (
  image: AiReferenceImageMeta | string,
): image is AiReferenceImageMeta =>
  typeof image !== 'string' &&
  typeof image.id === 'string' &&
  typeof image.imageId === 'string' &&
  image.id.trim().length > 0 &&
  image.imageId.trim().length > 0

export const getAiReferenceImageMetas = (pet: Pet) => {
  const images = Array.isArray(pet.modelReferenceImages)
    ? pet.modelReferenceImages
    : []

  return images.filter(isAiReferenceImageMeta)
}

export const getLegacyAiReferenceDataUrls = (pet: Pet) => {
  const legacyImages = Array.isArray(pet.modelReferenceImages)
    ? pet.modelReferenceImages.filter(
        (image): image is string =>
          typeof image === 'string' && image.trim().startsWith('data:image/'),
      )
    : []
  const legacySingleImage =
    typeof pet.modelReferenceImageUrl === 'string' &&
    pet.modelReferenceImageUrl.trim().startsWith('data:image/')
      ? [pet.modelReferenceImageUrl.trim()]
      : []

  return [...legacyImages, ...legacySingleImage].slice(0, 3)
}

export const hasAiReferenceMetadata = (pet: Pet) =>
  getAiReferenceImageMetas(pet).length > 0 ||
  getLegacyAiReferenceDataUrls(pet).length > 0

const getImageMimeType = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);/)

  return match?.[1] || 'image/jpeg'
}

export const createAiReferenceImageMeta = (createdAt = new Date().toISOString()) => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return {
    createdAt,
    id: `ai-ref-${suffix}`,
    imageId: `ai-ref-image-${suffix}`,
  }
}

export const saveAiReferenceFile = async (file: File) => {
  try {
    const compressedImage = await compressImage(file, {
      maxSide: 1200,
      quality: 0.82,
    })
    const metadata = createAiReferenceImageMeta()

    await saveAiReferenceImage({
      createdAt: metadata.createdAt,
      dataUrl: compressedImage.dataUrl,
      imageId: metadata.imageId,
      mimeType: compressedImage.mimeType,
    })

    return {
      ...metadata,
      dataUrl: compressedImage.dataUrl,
    }
  } catch (error) {
    if (error instanceof ImageCompressionError) {
      if (error.code === 'unsupported-type') {
        throw new AiReferenceUploadError('unsupported-type')
      }

      if (error.code === 'file-too-large') {
        throw new AiReferenceUploadError('file-too-large')
      }

      throw new AiReferenceUploadError('image-processing-failed')
    }

    throw new AiReferenceUploadError('storage-failed')
  }
}

export const resolveAiReferenceImages = async (pet: Pet) => {
  const metas = getAiReferenceImageMetas(pet)
  const resolvedImages = await Promise.all(
    metas.map(async (meta) => {
      try {
        const imageRecord = await getAiReferenceImage(meta.imageId)

        if (!imageRecord?.dataUrl) {
          return null
        }

        return {
          ...meta,
          dataUrl: imageRecord.dataUrl,
        }
      } catch {
        return null
      }
    }),
  )
  const validImages = resolvedImages.filter(
    (image): image is AiReferenceImageView => Boolean(image),
  )

  if (validImages.length > 0) {
    return validImages
  }

  return getLegacyAiReferenceDataUrls(pet).map((dataUrl) => {
    const meta = createAiReferenceImageMeta()

    return {
      ...meta,
      dataUrl,
    }
  })
}

export const migrateLegacyAiReferenceImages = async (pet: Pet) => {
  const legacyDataUrls = getLegacyAiReferenceDataUrls(pet)

  if (legacyDataUrls.length === 0) {
    return {
      pet,
      resolvedImages: await resolveAiReferenceImages(pet),
    }
  }

  const migratedImages: AiReferenceImageView[] = []

  for (const dataUrl of legacyDataUrls) {
    const metadata = createAiReferenceImageMeta()

    try {
      await saveAiReferenceImage({
        createdAt: metadata.createdAt,
        dataUrl,
        imageId: metadata.imageId,
        mimeType: getImageMimeType(dataUrl),
      })
      migratedImages.push({
        ...metadata,
        dataUrl,
      })
    } catch {
      // Keep the UI stable even if an old oversized image cannot be migrated.
    }
  }

  const nextPet: Pet = {
    ...pet,
    modelReferenceImageUrl: '',
    modelReferenceImages: migratedImages.map(({ dataUrl: _dataUrl, ...meta }) => meta),
  }

  return {
    pet: nextPet,
    resolvedImages: migratedImages,
  }
}

export const deleteAiReferenceImagesByMeta = async (
  images: AiReferenceImageMeta[],
) => {
  await Promise.all(
    images.map(async (image) => {
      try {
        await deleteAiReferenceImage(image.imageId)
      } catch {
        // Deleting stale metadata should not block UI updates.
      }
    }),
  )
}
