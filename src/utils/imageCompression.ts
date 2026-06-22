export const ALBUM_IMAGE_MAX_SIZE_MB = 20
export const ALBUM_IMAGE_MAX_SIZE_BYTES =
  ALBUM_IMAGE_MAX_SIZE_MB * 1024 * 1024

const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export type ImageCompressionErrorCode =
  | 'compression-failed'
  | 'file-too-large'
  | 'unsupported-type'

export class ImageCompressionError extends Error {
  code: ImageCompressionErrorCode

  constructor(code: ImageCompressionErrorCode) {
    super(code)
    this.code = code
  }
}

export type CompressedImage = {
  dataUrl: string
  mimeType: string
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new ImageCompressionError('compression-failed'))
    reader.onload = () => {
      const dataUrl = String(reader.result || '')

      if (!dataUrl) {
        reject(new ImageCompressionError('compression-failed'))
        return
      }

      resolve(dataUrl)
    }
    reader.readAsDataURL(file)
  })

const loadImage = (dataUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onerror = () => reject(new ImageCompressionError('compression-failed'))
    image.onload = () => resolve(image)
    image.src = dataUrl
  })

export const compressImage = async (
  file: File,
): Promise<CompressedImage> => {
  if (!supportedImageTypes.includes(file.type)) {
    throw new ImageCompressionError('unsupported-type')
  }

  if (file.size > ALBUM_IMAGE_MAX_SIZE_BYTES) {
    throw new ImageCompressionError('file-too-large')
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    const image = await loadImage(dataUrl)
    const maxSide = 1600
    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height
    const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(1, Math.round(sourceWidth * scale))
    const height = Math.max(1, Math.round(sourceHeight * scale))
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new ImageCompressionError('compression-failed')
    }

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.82),
      mimeType: 'image/jpeg',
    }
  } catch (error) {
    if (error instanceof ImageCompressionError) {
      throw error
    }

    throw new ImageCompressionError('compression-failed')
  }
}
