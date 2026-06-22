import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMainPetLayout } from '../components/MainLayout'
import type { AlbumPhoto, PetStatus } from '../types'
import {
  deleteAlbumImage,
  getAlbumImage,
  saveAlbumImage,
} from '../utils/albumImageDB'
import {
  compressImage,
  ImageCompressionError,
} from '../utils/imageCompression'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

type StoredAlbumPhoto = AlbumPhoto & {
  createdAt?: string
  imageId?: string
  isFavorite?: boolean
  title?: string
}

type AlbumDisplayPhoto = {
  createdAt?: string
  date: string
  id: string
  image: string
  isExample?: boolean
  isFavorite?: boolean
  status: PetStatus
  title: string
}

type SelectedUploadPhoto = {
  fileName: string
  id: string
  image: string
  mimeType: string
}

type UploadDraft = {
  date: string
  note: string
  photos: SelectedUploadPhoto[]
}

type UploadErrors = Partial<Record<'date' | 'note' | 'photos', string>>

type AlbumDrawerMode = 'add' | 'edit'

type AlbumActionPopover = {
  mode: 'actions' | 'confirm'
  photo: AlbumDisplayPhoto
  position: {
    left: number
    top: number
  }
}

type AlbumTone = {
  accent: string
  accentBg: string
  accentBorder: string
  button: string
  dateBadge: string
  focus: string
  glow: string
  hover: string
  prompt: string
  soft: string
  text: string
  uploadIcon: string
}

const albumTones: Record<PetStatus, AlbumTone> = {
  active: {
    accent: 'text-orange-500',
    accentBg: 'bg-orange-500',
    accentBorder: 'border-orange-200',
    button:
      'bg-gradient-to-r from-orange-600 to-orange-500 shadow-[0_18px_34px_rgba(234,88,12,0.26)] hover:from-orange-500 hover:to-orange-400',
    dateBadge: 'bg-orange-50/92 text-orange-600',
    focus:
      'focus:border-orange-300 focus:ring-orange-100 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.14)]',
    glow: 'shadow-[0_18px_44px_rgba(205,116,35,0.13)]',
    hover: 'hover:bg-orange-100 hover:text-orange-700',
    prompt: 'bg-orange-50/72 text-orange-700',
    soft: 'bg-orange-50/78',
    text: 'text-orange-600',
    uploadIcon: 'bg-orange-50 text-orange-500',
  },
  memorial: {
    accent: 'text-purple-500',
    accentBg: 'bg-purple-500',
    accentBorder: 'border-purple-200',
    button:
      'bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_18px_34px_rgba(126,34,206,0.24)] hover:from-purple-500 hover:to-purple-400',
    dateBadge: 'bg-purple-50/92 text-purple-600',
    focus:
      'focus:border-purple-300 focus:ring-purple-100 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.14)]',
    glow: 'shadow-[0_18px_44px_rgba(126,34,206,0.12)]',
    hover: 'hover:bg-purple-100 hover:text-purple-700',
    prompt: 'bg-purple-50/74 text-purple-700',
    soft: 'bg-purple-50/78',
    text: 'text-purple-600',
    uploadIcon: 'bg-purple-50 text-purple-500',
  },
}

const examplePhotos: Record<PetStatus, AlbumDisplayPhoto[]> = {
  active: [
    {
      date: '2024.07.17',
      id: 'active-example-bath',
      image: '/images/auth/album-page/bath.png',
      isExample: true,
      isFavorite: true,
      status: 'active',
      title: '第一次洗澡',
    },
    {
      date: '2024.07.15',
      id: 'active-example-bed',
      image: '/images/auth/album-page/bed.png',
      isExample: true,
      status: 'active',
      title: '窝在毯子里的午睡',
    },
    {
      date: '2024.07.12',
      id: 'active-example-birthday',
      image: '/images/auth/album-page/birthday.png',
      isExample: true,
      isFavorite: true,
      status: 'active',
      title: '生日小记录',
    },
    {
      date: '2024.07.08',
      id: 'active-example-garden',
      image: '/images/auth/album-page/garden.png',
      isExample: true,
      status: 'active',
      title: '花园里的小探险',
    },
    {
      date: '2024.07.06',
      id: 'active-example-play',
      image: '/images/auth/album-page/play.png',
      isExample: true,
      status: 'active',
      title: '今天也很开心',
    },
    {
      date: '2024.07.01',
      id: 'active-example-sun',
      image: '/images/auth/album-page/sun.png',
      isExample: true,
      isFavorite: true,
      status: 'active',
      title: '阳光下的小懒觉',
    },
  ],
  memorial: [
    {
      date: '2024.07.17',
      id: 'memorial-example-1',
      image: '/images/auth/album-page/memorial1.png',
      isExample: true,
      isFavorite: true,
      status: 'memorial',
      title: '最喜欢的照片',
    },
    {
      date: '2024.07.15',
      id: 'memorial-example-2',
      image: '/images/auth/album-page/memorial2.png',
      isExample: true,
      status: 'memorial',
      title: '第一次回家',
    },
    {
      date: '2024.07.12',
      id: 'memorial-example-3',
      image: '/images/auth/album-page/memorial3.png',
      isExample: true,
      isFavorite: true,
      status: 'memorial',
      title: '安静看着你的样子',
    },
    {
      date: '2024.07.08',
      id: 'memorial-example-4',
      image: '/images/auth/album-page/memorial4.png',
      isExample: true,
      status: 'memorial',
      title: '花丛里的回忆',
    },
    {
      date: '2024.07.06',
      id: 'memorial-example-5',
      image: '/images/auth/album-page/memorial5.png',
      isExample: true,
      status: 'memorial',
      title: '生日那天',
    },
    {
      date: '2024.07.01',
      id: 'memorial-example-6',
      image: '/images/auth/album-page/memorial6.png',
      isExample: true,
      isFavorite: true,
      status: 'memorial',
      title: '最后一次散步',
    },
  ],
}

const readAlbumPhotos = () =>
  getStorageItem<StoredAlbumPhoto[]>(STORAGE_KEYS.albumPhotos, [])

const albumImageSourceCache: Record<string, string> = {}

const getAlbumCarouselStorageKey = (status: PetStatus) =>
  `petMemory:albumCarouselIndex:${status}`

const getStoredAlbumCarouselIndex = (status: PetStatus) => {
  if (typeof window === 'undefined') {
    return 0
  }

  const rawIndex = window.sessionStorage.getItem(
    getAlbumCarouselStorageKey(status),
  )
  const parsedIndex = Number(rawIndex)

  return Number.isInteger(parsedIndex) && parsedIndex >= 0 ? parsedIndex : 0
}

const setStoredAlbumCarouselIndex = (status: PetStatus, index: number) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(getAlbumCarouselStorageKey(status), String(index))
}

const getSafeCarouselIndex = (index: number, total: number) =>
  total > 0 && index >= 0 && index < total ? index : 0

const getInitialCarouselIndexes = (): Record<PetStatus, number> => ({
  active: getStoredAlbumCarouselIndex('active'),
  memorial: getStoredAlbumCarouselIndex('memorial'),
})

const isUserUploadedPhoto = (photo: StoredAlbumPhoto) =>
  photo.id.startsWith('album-upload-') &&
  (Boolean(photo.imageId) || photo.image.trim().length > 0)

const isLegacyDataUrlPhoto = (photo: StoredAlbumPhoto) =>
  !photo.imageId && photo.image.startsWith('data:image/')

const getTodayValue = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const createEmptyDraft = (): UploadDraft => ({
  date: getTodayValue(),
  note: '',
  photos: [],
})

const formatDateForDisplay = (date: string) =>
  date ? date.replace(/-/g, '.') : getTodayValue().replace(/-/g, '.')

const normalizeDateForInput = (date: string) => {
  const normalizedDate = date.replace(/\./g, '-')

  return /^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)
    ? normalizedDate
    : getTodayValue()
}

const normalizeRealPhoto = (
  photo: StoredAlbumPhoto,
  image: string,
): AlbumDisplayPhoto => ({
  createdAt: photo.createdAt,
  date: formatDateForDisplay(photo.date),
  id: photo.id,
  image,
  isFavorite: photo.isFavorite,
  status: photo.status,
  title: photo.note?.trim() || '未添加简介',
})

const sortPhotosByTime = (photos: AlbumDisplayPhoto[]) =>
  [...photos].sort((firstPhoto, secondPhoto) => {
    const firstTime = new Date(firstPhoto.date.replace(/\./g, '-')).getTime()
    const secondTime = new Date(secondPhoto.date.replace(/\./g, '-')).getTime()

    if (secondTime !== firstTime) {
      return secondTime - firstTime
    }

    return (
      new Date(secondPhoto.createdAt || 0).getTime() -
      new Date(firstPhoto.createdAt || 0).getTime()
    )
  })

const getActionPopoverPosition = (
  clientX: number,
  clientY: number,
  width = 168,
  height = 132,
) => {
  if (typeof window === 'undefined') {
    return {
      left: clientX,
      top: clientY,
    }
  }

  return {
    left: Math.min(Math.max(12, clientX + 12), window.innerWidth - width - 12),
    top: Math.min(Math.max(12, clientY + 12), window.innerHeight - height - 12),
  }
}

const getImageProcessingErrorMessage = (error: unknown) => {
  if (error instanceof ImageCompressionError) {
    if (error.code === 'unsupported-type') {
      return '请上传 JPG、PNG 或 WEBP 格式的图片'
    }

    if (error.code === 'file-too-large') {
      return '这张照片超过 20MB，请选择更小的照片'
    }

    return '照片处理失败，请换一张照片再试'
  }

  return '照片处理失败，请换一张照片再试'
}

const HeartIcon = ({ className }: { className: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 20s-7.1-4.2-8.7-8.5C2 8 4.1 5.2 7.2 5.2c1.8 0 3.2 1 4 2.3.8-1.3 2.2-2.3 4-2.3 3.1 0 5.2 2.8 3.9 6.3C17.4 15.8 12 20 12 20Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

const UploadIcon = ({ className }: { className: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 32 32"
  >
    <path
      d="M16 21V8m0 0-5 5m5-5 5 5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.6"
    />
    <path
      d="M8 20.5v2.2A3.3 3.3 0 0 0 11.3 26h9.4a3.3 3.3 0 0 0 3.3-3.3v-2.2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.6"
    />
  </svg>
)

type PhotoCardProps = {
  animate?: boolean
  className?: string
  isFeatured?: boolean
  onPhotoClick?: (photo: AlbumDisplayPhoto) => void
  onPhotoDoubleClick?: (
    photo: AlbumDisplayPhoto,
    event: React.MouseEvent<HTMLElement>,
  ) => void
  photo: AlbumDisplayPhoto
  tone: AlbumTone
}

const PhotoCard = ({
  animate = false,
  className = '',
  isFeatured = false,
  onPhotoClick,
  onPhotoDoubleClick,
  photo,
  tone,
}: PhotoCardProps) => (
  <article
    className={`group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/72 bg-white/70 ${tone.glow} backdrop-blur transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(87,66,40,0.16)] active:scale-[0.99] ${className}`}
    data-album-photo-card
    onClick={() => onPhotoClick?.(photo)}
    onDoubleClick={(event) => onPhotoDoubleClick?.(photo, event)}
    onKeyDown={(event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return
      }

      event.preventDefault()
      onPhotoClick?.(photo)
    }}
    role="button"
    style={{
      animation: animate
        ? 'albumPhotoFadeIn 520ms cubic-bezier(0.22, 1, 0.36, 1) both'
        : undefined,
    }}
    tabIndex={0}
  >
    <img
      alt={photo.title}
      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
      draggable={false}
      src={photo.image}
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/48 via-black/15 to-transparent" />
    {photo.isFavorite ? (
      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/82 shadow-sm backdrop-blur">
        <HeartIcon className={`h-4.5 w-4.5 ${tone.accent}`} />
      </span>
    ) : null}
    <div className="absolute bottom-3 left-3 right-3">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-black shadow-sm backdrop-blur ${tone.dateBadge}`}
      >
        {photo.date}
      </span>
      <p
        className={`mt-2 truncate font-black text-white drop-shadow ${
          isFeatured ? 'text-xl' : 'text-sm'
        }`}
      >
        {photo.title}
      </p>
    </div>
  </article>
)

type PhotoSkeletonProps = {
  className?: string
  tone: AlbumTone
}

const PhotoSkeleton = ({ className = '', tone }: PhotoSkeletonProps) => (
  <div
    className={`relative overflow-hidden rounded-[28px] border border-white/72 ${tone.soft} ${tone.glow} ${className}`}
  >
    <div className="absolute inset-0 animate-pulse bg-white/34" />
    <div className="absolute bottom-3 left-3 h-6 w-24 rounded-full bg-white/66" />
    <div className="absolute bottom-12 left-3 h-4 w-36 rounded-full bg-white/46" />
  </div>
)

const Album = () => {
  const { pet, status } = useMainPetLayout()
  const isMemorial = status === 'memorial'
  const tone = albumTones[status]
  const [photos, setPhotos] = useState<StoredAlbumPhoto[]>(readAlbumPhotos)
  const [imageSources, setImageSources] = useState<Record<string, string>>(
    () => ({ ...albumImageSourceCache }),
  )
  const [hasHydratedAlbum, setHasHydratedAlbum] = useState(true)
  const [carouselIndexes, setCarouselIndexes] = useState(
    getInitialCarouselIndexes,
  )
  const [draft, setDraft] = useState<UploadDraft>(createEmptyDraft)
  const [uploadErrors, setUploadErrors] = useState<UploadErrors>({})
  const [drawerMode, setDrawerMode] = useState<AlbumDrawerMode>('add')
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isClosingDrawer, setIsClosingDrawer] = useState(false)
  const [selectedAlbumPhoto, setSelectedAlbumPhoto] =
    useState<AlbumDisplayPhoto | null>(null)
  const [actionPopover, setActionPopover] =
    useState<AlbumActionPopover | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dateInputRef = useRef<HTMLInputElement | null>(null)
  const renderedAlbumStatusRef = useRef<PetStatus | null>(null)
  const hasRenderedAlbumImagesRef = useRef(false)
  const photoClickTimerRef = useRef<number | null>(null)
  const actionPopoverRef = useRef<AlbumActionPopover | null>(null)
  const suppressNextPhotoClickRef = useRef(false)

  const realPhotos = useMemo(
    () =>
      sortPhotosByTime(
        photos
          .filter((photo) => {
            if (photo.status !== status || !isUserUploadedPhoto(photo)) {
              return false
            }

            if (photo.imageId) {
              return Boolean(imageSources[photo.id])
            }

            return photo.image.trim().length > 0
          })
          .map((photo) =>
            normalizeRealPhoto(
              photo,
              photo.imageId ? imageSources[photo.id] : photo.image,
            ),
          ),
      ),
    [imageSources, photos, status],
  )
  const realPhotoMetadata = useMemo(
    () =>
      photos.filter(
        (photo) => photo.status === status && isUserUploadedPhoto(photo),
      ),
    [photos, status],
  )
  const hasRealPhotoMetadata = realPhotoMetadata.length > 0
  const isExampleMode = hasHydratedAlbum && !hasRealPhotoMetadata
  const isAlbumLoading =
    !hasHydratedAlbum || (hasRealPhotoMetadata && realPhotos.length === 0)
  const displayPhotos = isExampleMode ? examplePhotos[status] : realPhotos
  const carouselIndex = carouselIndexes[status] ?? 0
  const safeCarouselIndex = getSafeCarouselIndex(
    carouselIndex,
    displayPhotos.length,
  )
  const featuredPhoto =
    displayPhotos.length > 0
      ? displayPhotos[safeCarouselIndex]
      : null
  const shouldAnimateFeaturedPhoto =
    renderedAlbumStatusRef.current === status &&
    hasRenderedAlbumImagesRef.current
  const smallPhotos =
    featuredPhoto && displayPhotos.length > 1
      ? displayPhotos.filter((photo) => photo.id !== featuredPhoto.id).slice(0, 5)
      : []
  const extraPhotos =
    featuredPhoto && displayPhotos.length > 6
      ? displayPhotos.filter(
          (photo) =>
            photo.id !== featuredPhoto.id &&
            !smallPhotos.some((smallPhoto) => smallPhoto.id === photo.id),
        )
      : []
  const editingPhoto = editingPhotoId
    ? photos.find((photo) => photo.id === editingPhotoId) ?? null
    : null
  const editingPhotoSource = editingPhoto
    ? editingPhoto.imageId
      ? imageSources[editingPhoto.id]
      : editingPhoto.image
    : ''
  const setCarouselIndexForCurrentStatus = (
    nextIndex:
      | number
      | ((currentIndex: number) => number),
  ) => {
    setCarouselIndexes((currentIndexes) => {
      const currentIndex = currentIndexes[status] ?? 0
      const resolvedIndex =
        typeof nextIndex === 'function' ? nextIndex(currentIndex) : nextIndex
      const safeIndex = Math.max(0, resolvedIndex)

      setStoredAlbumCarouselIndex(status, safeIndex)

      return {
        ...currentIndexes,
        [status]: safeIndex,
      }
    })
  }

  useEffect(() => {
    actionPopoverRef.current = actionPopover
  }, [actionPopover])

  useEffect(() => {
    setHasHydratedAlbum(true)
  }, [photos])

  useEffect(() => {
    setIsDrawerOpen(false)
    setIsClosingDrawer(false)
    setDrawerMode('add')
    setEditingPhotoId(null)
    setSelectedAlbumPhoto(null)
    setActionPopover(null)
    setDraft(createEmptyDraft())
    setUploadErrors({})
    if (photoClickTimerRef.current) {
      window.clearTimeout(photoClickTimerRef.current)
      photoClickTimerRef.current = null
    }
  }, [status])

  useEffect(() => {
    let isCancelled = false

    const loadStoredAlbumImages = async () => {
      const entries = await Promise.all(
        photos.filter(isUserUploadedPhoto).map(async (photo) => {
          if (!photo.imageId) {
            return photo.image ? ([photo.id, photo.image] as const) : null
          }

          try {
            const imageRecord = await getAlbumImage(photo.imageId)

            if (imageRecord?.dataUrl) {
              return [photo.id, imageRecord.dataUrl] as const
            }
          } catch {
            return photo.image ? ([photo.id, photo.image] as const) : null
          }

          return photo.image ? ([photo.id, photo.image] as const) : null
        }),
      )

      if (isCancelled) {
        return
      }

      const loadedSources = Object.fromEntries(
        entries.filter(Boolean) as Array<[string, string]>,
      )

      Object.assign(albumImageSourceCache, loadedSources)
      setImageSources((currentSources) => ({
        ...currentSources,
        ...loadedSources,
      }))
    }

    void loadStoredAlbumImages()

    return () => {
      isCancelled = true
    }
  }, [photos])

  useEffect(() => {
    let isCancelled = false

    const migrateLegacyAlbumImages = async () => {
      const legacyPhotos = photos.filter(isLegacyDataUrlPhoto)

      if (legacyPhotos.length === 0) {
        return
      }

      const migratedPhotos = await Promise.all(
        legacyPhotos.map(async (photo) => {
          const imageId = `album-image-${photo.id}`
          const mimeType =
            photo.image.match(/^data:([^;]+)/)?.[1] ?? 'image/jpeg'

          try {
            await saveAlbumImage({
              createdAt: photo.createdAt || new Date().toISOString(),
              dataUrl: photo.image,
              imageId,
              mimeType,
            })

            return {
              ...photo,
              image: '',
              imageId,
            }
          } catch {
            return photo
          }
        }),
      )

      if (isCancelled) {
        return
      }

      const migratedById = new Map(
        migratedPhotos
          .filter((photo) => photo.imageId)
          .map((photo) => [photo.id, photo]),
      )

      if (migratedById.size === 0) {
        return
      }

      const nextPhotos = photos.map((photo) => migratedById.get(photo.id) ?? photo)

      try {
        setStorageItem(STORAGE_KEYS.albumPhotos, nextPhotos)
        setPhotos(nextPhotos)
      } catch {
        // Keep legacy data visible if compacting localStorage is unavailable.
      }
    }

    void migrateLegacyAlbumImages()

    return () => {
      isCancelled = true
    }
  }, [photos])

  useEffect(() => {
    if (displayPhotos.length === 0) {
      return
    }

    if (carouselIndex !== safeCarouselIndex) {
      setCarouselIndexForCurrentStatus(safeCarouselIndex)
    }
  }, [carouselIndex, displayPhotos.length, safeCarouselIndex, status])

  useEffect(() => {
    if (isAlbumLoading || displayPhotos.length <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCarouselIndexForCurrentStatus((currentIndex) =>
        (currentIndex + 1) % displayPhotos.length,
      )
    }, 4200)

    return () => window.clearInterval(timer)
  }, [displayPhotos.length, isAlbumLoading, status])

  useEffect(() => {
    if (!isAlbumLoading && featuredPhoto) {
      renderedAlbumStatusRef.current = status
      hasRenderedAlbumImagesRef.current = true
    }
  }, [featuredPhoto, isAlbumLoading, status])

  useEffect(() => {
    if (!isDrawerOpen && !selectedAlbumPhoto && !actionPopover) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedAlbumPhoto(null)
        setActionPopover(null)

        if (isDrawerOpen) {
          closeDrawer()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [actionPopover, isDrawerOpen, selectedAlbumPhoto])

  useEffect(() => {
    if (!actionPopover) {
      return undefined
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null

      if (target?.closest('[data-album-photo-action-popover]')) {
        return
      }

      if (target?.closest('[data-album-photo-card]')) {
        suppressNextPhotoClickRef.current = true
      }

      setActionPopover(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [actionPopover])

  useEffect(
    () => () => {
      if (photoClickTimerRef.current) {
        window.clearTimeout(photoClickTimerRef.current)
      }
    },
    [],
  )

  const openDrawer = () => {
    setDrawerMode('add')
    setEditingPhotoId(null)
    setSelectedAlbumPhoto(null)
    setActionPopover(null)
    setDraft(createEmptyDraft())
    setUploadErrors({})
    setIsClosingDrawer(false)
    setIsDrawerOpen(true)
  }

  const openEditDrawer = (photo: AlbumDisplayPhoto) => {
    const storedPhoto = photos.find((currentPhoto) => currentPhoto.id === photo.id)

    if (!storedPhoto || storedPhoto.status !== status) {
      return
    }

    if (photoClickTimerRef.current) {
      window.clearTimeout(photoClickTimerRef.current)
      photoClickTimerRef.current = null
    }

    setDrawerMode('edit')
    setEditingPhotoId(storedPhoto.id)
    setSelectedAlbumPhoto(null)
    setActionPopover(null)
    setDraft({
      date: normalizeDateForInput(storedPhoto.date),
      note: storedPhoto.note?.trim() || '',
      photos: [],
    })
    setUploadErrors({})
    setIsClosingDrawer(false)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsClosingDrawer(true)
    window.setTimeout(() => {
      setIsDrawerOpen(false)
      setIsClosingDrawer(false)
      setDrawerMode('add')
      setEditingPhotoId(null)
      setDraft(createEmptyDraft())
      setUploadErrors({})
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, 260)
  }

  const clearUploadError = (field: keyof UploadErrors) => {
    setUploadErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const openDatePicker = () => {
    const input = dateInputRef.current as
      | (HTMLInputElement & { showPicker?: () => void })
      | null

    if (!input) {
      return
    }

    input.focus()

    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }

    input.click()
  }

  const handlePhotoClick = (photo: AlbumDisplayPhoto) => {
    if (photoClickTimerRef.current) {
      window.clearTimeout(photoClickTimerRef.current)
      photoClickTimerRef.current = null
    }

    if (actionPopoverRef.current || suppressNextPhotoClickRef.current) {
      suppressNextPhotoClickRef.current = false
      setActionPopover(null)
      return
    }

    photoClickTimerRef.current = window.setTimeout(() => {
      setActionPopover(null)
      setSelectedAlbumPhoto(photo)
      photoClickTimerRef.current = null
    }, 220)
  }

  const handlePhotoDoubleClick = (
    photo: AlbumDisplayPhoto,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (photoClickTimerRef.current) {
      window.clearTimeout(photoClickTimerRef.current)
      photoClickTimerRef.current = null
    }

    setSelectedAlbumPhoto(null)

    if (photo.isExample) {
      setActionPopover(null)
      return
    }

    setActionPopover({
      mode: 'actions',
      photo,
      position: getActionPopoverPosition(event.clientX, event.clientY),
    })
  }

  const deletePhoto = async (photoId: string) => {
    const photoToDelete = photos.find((photo) => photo.id === photoId)

    if (!photoToDelete || photoToDelete.status !== status) {
      setActionPopover(null)
      return
    }

    const nextPhotos = photos.filter((photo) => photo.id !== photoId)

    try {
      setStorageItem(STORAGE_KEYS.albumPhotos, nextPhotos)
      setPhotos(nextPhotos)
    } catch {
      return
    }

    if (photoToDelete.imageId) {
      void deleteAlbumImage(photoToDelete.imageId).catch(() => undefined)
    }

    delete albumImageSourceCache[photoId]
    setImageSources((currentSources) => {
      const nextSources = { ...currentSources }
      delete nextSources[photoId]
      return nextSources
    })

    if (selectedAlbumPhoto?.id === photoId) {
      setSelectedAlbumPhoto(null)
    }

    if (editingPhotoId === photoId) {
      closeDrawer()
    }

    const nextStatusPhotoCount = nextPhotos.filter(
      (photo) => photo.status === status && isUserUploadedPhoto(photo),
    ).length

    setCarouselIndexForCurrentStatus(
      nextStatusPhotoCount > 0
        ? Math.min(safeCarouselIndex, nextStatusPhotoCount - 1)
        : 0,
    )
    setActionPopover(null)
  }

  const applyFiles = async (files?: FileList | File[]) => {
    const selectedFiles = Array.from(files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    const results = await Promise.all(
      selectedFiles.map(async (file, index) => {
        try {
          const compressedImage = await compressImage(file)

          return {
            photo: {
              fileName: file.name,
              id: `selected-${Date.now()}-${index}-${file.name}`,
              image: compressedImage.dataUrl,
              mimeType: compressedImage.mimeType,
            },
            status: 'fulfilled' as const,
          }
        } catch (error) {
          return {
            message: getImageProcessingErrorMessage(error),
            status: 'rejected' as const,
          }
        }
      }),
    )
    const selectedPhotos = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.photo)
    const failedResults = results.filter((result) => result.status === 'rejected')

    if (selectedPhotos.length > 0) {
      setDraft((currentDraft) => ({
        ...currentDraft,
        photos: [...currentDraft.photos, ...selectedPhotos],
      }))
    }

    if (failedResults.length > 0) {
      const firstError = failedResults[0].message

      setUploadErrors((currentErrors) => ({
        ...currentErrors,
        photos:
          failedResults.length === 1
            ? firstError
            : `${firstError}（${failedResults.length} 张未添加）`,
      }))
      return
    }

    clearUploadError('photos')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void applyFiles(event.target.files ?? undefined)
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    void applyFiles(event.dataTransfer.files)
  }

  const savePhoto = async () => {
    const nextErrors: UploadErrors = {}

    if (drawerMode === 'add' && draft.photos.length === 0) {
      nextErrors.photos = '请先选择照片'
    }

    if (!draft.date) {
      nextErrors.date = '请选择添加日期'
    }

    if (draft.note.length > 20) {
      nextErrors.note = '照片简介不能超过 20 个字'
    }

    if (Object.keys(nextErrors).length > 0) {
      setUploadErrors(nextErrors)
      return
    }

    const note = draft.note.trim()

    if (drawerMode === 'edit') {
      if (!editingPhotoId) {
        return
      }

      const photoToUpdate = photos.find((photo) => photo.id === editingPhotoId)

      if (!photoToUpdate || photoToUpdate.status !== status) {
        return
      }

      const updatedPhoto: StoredAlbumPhoto = {
        ...photoToUpdate,
        date: draft.date,
        note,
        title: note || '未添加简介',
      }
      const nextPhotos = photos.map((photo) =>
        photo.id === editingPhotoId ? updatedPhoto : photo,
      )

      try {
        setStorageItem(STORAGE_KEYS.albumPhotos, nextPhotos)
        setPhotos(nextPhotos)

        const updatedPhotoSource = updatedPhoto.imageId
          ? imageSources[updatedPhoto.id]
          : updatedPhoto.image

        if (selectedAlbumPhoto?.id === updatedPhoto.id && updatedPhotoSource) {
          setSelectedAlbumPhoto(normalizeRealPhoto(updatedPhoto, updatedPhotoSource))
        }

        closeDrawer()
      } catch {
        setUploadErrors((currentErrors) => ({
          ...currentErrors,
          photos: '照片保存失败，请稍后重试',
        }))
      }

      return
    }

    const uploadIdBase = Date.now()
    const savedPhotoPairs: Array<{
      metadata: StoredAlbumPhoto
      selectedPhotoId: string
      source: string
    }> = []
    const failedSelectedPhotoIds = new Set<string>()

    for (const [index, selectedPhoto] of draft.photos.entries()) {
      const photoId = `album-upload-${status}-${uploadIdBase}-${index}`
      const imageId = `album-image-${photoId}`
      const createdAt = new Date(uploadIdBase + index).toISOString()

      try {
        await saveAlbumImage({
          createdAt,
          dataUrl: selectedPhoto.image,
          imageId,
          mimeType: selectedPhoto.mimeType,
        })

        savedPhotoPairs.push({
          metadata: {
            createdAt,
            date: draft.date,
            id: photoId,
            image: '',
            imageId,
            isFavorite: false,
            note,
            petId: pet.id,
            status,
            title: note || '未添加简介',
          },
          selectedPhotoId: selectedPhoto.id,
          source: selectedPhoto.image,
        })
      } catch {
        failedSelectedPhotoIds.add(selectedPhoto.id)
      }
    }

    if (savedPhotoPairs.length === 0) {
      setUploadErrors((currentErrors) => ({
        ...currentErrors,
        photos: '浏览器本地存储空间不足，请删除部分照片后再上传',
      }))
      return
    }

    const nextUploadedPhotos = savedPhotoPairs.map(({ metadata }) => metadata)
    const nextPhotos = [...nextUploadedPhotos, ...photos]

    try {
      setStorageItem(STORAGE_KEYS.albumPhotos, nextPhotos)
      setPhotos(nextPhotos)
      const savedSources = Object.fromEntries(
        savedPhotoPairs.map(({ metadata, source }) => [metadata.id, source]),
      )

      Object.assign(albumImageSourceCache, savedSources)
      setImageSources((currentSources) => ({
        ...currentSources,
        ...savedSources,
      }))
      setCarouselIndexForCurrentStatus(0)

      if (failedSelectedPhotoIds.size > 0) {
        setDraft((currentDraft) => ({
          ...currentDraft,
          photos: currentDraft.photos.filter((photo) =>
            failedSelectedPhotoIds.has(photo.id),
          ),
        }))
        setUploadErrors((currentErrors) => ({
          ...currentErrors,
          photos: `部分照片已保存，${failedSelectedPhotoIds.size} 张因浏览器本地存储空间不足未保存`,
        }))
        return
      }

      closeDrawer()
    } catch {
      setUploadErrors((currentErrors) => ({
        ...currentErrors,
        photos: '照片保存失败，请稍后重试',
      }))
    }
  }

  return (
    <div className="relative h-full overflow-hidden px-7 py-3">
      <style>
        {`
          @keyframes albumDrawerOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes albumDrawerOverlayOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          @keyframes albumDrawerIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes albumDrawerOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }

          @keyframes albumPhotoFadeIn {
            from {
              opacity: 0;
              transform: scale(0.985);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes albumDetailOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes albumDetailModalIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          @keyframes albumActionPopoverIn {
            from {
              opacity: 0;
              transform: translateY(-4px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .album-scroll-area {
            scrollbar-color: transparent transparent;
            scrollbar-width: thin;
          }

          .album-scroll-area:hover,
          .album-scroll-area:focus-within {
            scrollbar-color: rgba(180, 132, 80, 0.28) transparent;
          }

          .album-scroll-area::-webkit-scrollbar {
            width: 6px;
          }

          .album-scroll-area::-webkit-scrollbar-track {
            background: transparent;
          }

          .album-scroll-area::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 999px;
            transition: background-color 180ms ease-out;
          }

          .album-scroll-area:hover::-webkit-scrollbar-thumb,
          .album-scroll-area:focus-within::-webkit-scrollbar-thumb {
            background: rgba(180, 132, 80, 0.28);
          }
        `}
      </style>

      <div className="relative z-10 flex h-full flex-col">
        <header className="mb-3 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <p className={`shrink-0 text-xs font-bold ${tone.text} opacity-70`}>
              双击照片即可编辑
            </p>
            {isExampleMode ? (
              <p
                className={`min-w-0 truncate rounded-full px-3.5 py-1.5 text-xs font-bold leading-5 ${tone.prompt}`}
              >
                还没有上传照片，这里先展示一些示例瞬间。上传第一张照片后，示例会自动隐藏。
              </p>
            ) : null}
          </div>

          <button
            className={`h-11 shrink-0 rounded-full px-6 text-sm font-black text-white transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
            onClick={openDrawer}
            type="button"
          >
            添加照片
          </button>
        </header>

        <div className="album-scroll-area min-h-0 flex-1 overflow-y-auto pr-1">
          <section className="grid h-full min-h-0 grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] gap-4 pb-2">
            {isAlbumLoading || !featuredPhoto ? (
              <PhotoSkeleton className="h-full min-h-0" tone={tone} />
            ) : (
              <PhotoCard
                animate={shouldAnimateFeaturedPhoto}
                className="h-full min-h-0"
                isFeatured
                key={featuredPhoto.id}
                onPhotoClick={handlePhotoClick}
                onPhotoDoubleClick={handlePhotoDoubleClick}
                photo={featuredPhoto}
                tone={tone}
              />
            )}

            <div className="grid h-full min-h-0 grid-cols-2 grid-rows-3 gap-4">
              {isAlbumLoading || !featuredPhoto ? (
                Array.from({ length: 5 }, (_, index) => (
                  <PhotoSkeleton
                    className={`min-h-0 ${index === 4 ? 'col-span-2' : ''}`}
                    key={index}
                    tone={tone}
                  />
                ))
              ) : smallPhotos.length > 0 ? (
                smallPhotos.map((photo, index) => (
                  <PhotoCard
                    className={`min-h-0 ${
                      index === 4 ? 'col-span-2' : ''
                    }`}
                    key={photo.id}
                    onPhotoClick={handlePhotoClick}
                    onPhotoDoubleClick={handlePhotoDoubleClick}
                    photo={photo}
                    tone={tone}
                  />
                ))
              ) : (
                <div
                  className={`col-span-2 row-span-3 flex items-center justify-center rounded-[28px] border border-dashed ${tone.accentBorder} bg-white/46 px-8 text-center`}
                >
                  <p className="text-sm font-bold leading-7 text-stone-500">
                    上传更多照片后，
                    <br />
                    这里会慢慢铺满属于你们的瞬间。
                  </p>
                </div>
              )}
            </div>
          </section>

          {extraPhotos.length > 0 ? (
            <section className="grid grid-cols-4 gap-4 pb-2 pt-2">
              {extraPhotos.map((photo) => (
                <PhotoCard
                  className="h-36"
                  key={photo.id}
                  onPhotoClick={handlePhotoClick}
                  onPhotoDoubleClick={handlePhotoDoubleClick}
                  photo={photo}
                  tone={tone}
                />
              ))}
            </section>
          ) : null}
        </div>
      </div>

      {actionPopover
        ? createPortal(
            <div
              className="fixed z-[75] w-[168px] rounded-[18px] border border-white/80 bg-white/95 p-3 shadow-[0_18px_42px_rgba(47,28,8,0.18)] backdrop-blur"
              data-album-photo-action-popover
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              style={{
                animation:
                  'albumActionPopoverIn 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
                left: actionPopover.position.left,
                top: actionPopover.position.top,
              }}
            >
              {actionPopover.mode === 'confirm' ? (
                <>
                  <p className="text-sm font-black text-stone-700">
                    确认删除这张照片？
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="h-8 flex-1 cursor-pointer rounded-full bg-stone-100 text-xs font-black text-stone-500 transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-stone-200 active:scale-[0.97]"
                      onClick={() =>
                        setActionPopover((currentPopover) =>
                          currentPopover
                            ? { ...currentPopover, mode: 'actions' }
                            : null,
                        )
                      }
                      type="button"
                    >
                      取消
                    </button>
                    <button
                      className={`h-8 flex-1 cursor-pointer rounded-full text-xs font-black text-white transition duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
                      onClick={() => {
                        void deletePhoto(actionPopover.photo.id)
                      }}
                      type="button"
                    >
                      删除
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-full text-sm font-black transition duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.hover} ${tone.text}`}
                    onClick={() => openEditDrawer(actionPopover.photo)}
                    type="button"
                  >
                    编辑
                  </button>
                  <button
                    className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full bg-rose-50 text-sm font-black text-rose-500 transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-rose-100 active:scale-[0.97]"
                    onClick={() =>
                      setActionPopover((currentPopover) =>
                        currentPopover
                          ? { ...currentPopover, mode: 'confirm' }
                          : null,
                      )
                    }
                    type="button"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>,
            document.body,
          )
        : null}

      {selectedAlbumPhoto
        ? createPortal(
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setSelectedAlbumPhoto(null)}
            >
              <div
                className="absolute inset-0 bg-black/38"
                style={{
                  animation: 'albumDetailOverlayIn 220ms ease-out both',
                }}
              />
              <section
                className="fixed left-1/2 top-1/2 z-[101] flex max-h-[calc(100vh-48px)] w-[min(560px,calc(100vw-44px))] flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_80px_rgba(47,28,8,0.24)] backdrop-blur"
                onClick={(event) => event.stopPropagation()}
                style={{
                  animation:
                    'albumDetailModalIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-xs font-black ${tone.accent}`}>
                      {selectedAlbumPhoto.date}
                    </p>
                    <h3 className="mt-1 truncate text-2xl font-black text-stone-900">
                      照片详情
                    </h3>
                  </div>
                  <button
                    aria-label="关闭照片详情"
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg font-black text-stone-500 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:scale-95 ${tone.hover}`}
                    onClick={() => setSelectedAlbumPhoto(null)}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 min-h-0 overflow-y-auto pr-1">
                  <img
                    alt={selectedAlbumPhoto.title}
                    className="h-[280px] w-full rounded-[24px] bg-stone-50 object-contain shadow-inner"
                    src={selectedAlbumPhoto.image}
                  />
                  <div className={`mt-4 rounded-[22px] px-4 py-4 ${tone.soft}`}>
                    <p className="text-xs font-black text-stone-400">
                      照片简介
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-stone-600">
                      {selectedAlbumPhoto.title || '未添加简介'}
                    </p>
                    <p className="mt-3 text-xs font-black text-stone-400">
                      添加日期
                    </p>
                    <p className={`mt-1 text-sm font-black ${tone.text}`}>
                      {selectedAlbumPhoto.date}
                    </p>
                  </div>
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}

      {isDrawerOpen
        ? createPortal(
            <div className="fixed inset-0 z-[80]" onClick={closeDrawer}>
              <div
                className="absolute inset-0 bg-black/42"
                style={{
                  animation: `${
                    isClosingDrawer
                      ? 'albumDrawerOverlayOut'
                      : 'albumDrawerOverlayIn'
                  } 260ms ease-out both`,
                }}
              />
              <aside
                className="fixed right-0 top-0 z-[90] flex h-screen w-[31vw] min-w-[360px] max-w-[460px] flex-col overflow-hidden border-l border-white/70 bg-white/94 shadow-[0_0_80px_rgba(47,28,8,0.28)] backdrop-blur"
                onClick={(event) => event.stopPropagation()}
                style={{
                  animation: `${
                    isClosingDrawer ? 'albumDrawerOut' : 'albumDrawerIn'
                  } 300ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                }}
              >
                <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5">
                  <div>
                    <p className={`text-xs font-black ${tone.accent}`}>
                      {isMemorial ? 'Memory Album' : 'Happy Album'}
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-stone-900">
                      {drawerMode === 'edit' ? '编辑照片' : '添加照片'}
                    </h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-stone-500">
                      {drawerMode === 'edit'
                        ? '调整照片简介和添加日期。'
                        : isMemorial
                        ? '把想念里的画面轻轻收好。'
                        : '把今天值得记住的瞬间放进相册。'}
                    </p>
                  </div>
                  <button
                    aria-label="关闭相册抽屉"
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg font-black text-stone-500 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:scale-95 ${tone.hover}`}
                    onClick={closeDrawer}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <div>
                    <p className="text-xs font-black text-stone-500">照片 *</p>
                    {drawerMode === 'edit' ? (
                      <div className="mt-2 overflow-hidden rounded-[26px] border border-white/80 bg-white/62 p-2 shadow-inner">
                        {editingPhotoSource ? (
                          <img
                            alt={editingPhoto?.note || '照片预览'}
                            className="h-[236px] w-full rounded-[20px] object-cover"
                            src={editingPhotoSource}
                          />
                        ) : (
                          <div
                            className={`flex h-[236px] w-full items-center justify-center rounded-[20px] ${tone.soft} text-sm font-black text-stone-400`}
                          >
                            照片加载中
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        className={`mt-2 flex min-h-[236px] w-full cursor-pointer flex-col items-center justify-center rounded-[26px] border-2 border-dashed bg-white/62 px-5 text-center transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] ${
                          uploadErrors.photos ? 'border-rose-300' : tone.accentBorder
                        } ${tone.hover}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDrop}
                        type="button"
                      >
                        {draft.photos.length > 0 ? (
                          <div className="w-full">
                            <p className={`mb-3 text-sm font-black ${tone.text}`}>
                              已选择 {draft.photos.length} 张照片
                            </p>
                            <div className="grid max-h-[184px] grid-cols-3 gap-2 overflow-hidden">
                              {draft.photos.slice(0, 6).map((photo, index) => (
                                <div
                                  className="relative h-[82px] overflow-hidden rounded-[16px] bg-white/70"
                                  key={photo.id}
                                >
                                  <img
                                    alt={`照片预览 ${index + 1}`}
                                    className="h-full w-full object-cover"
                                    src={photo.image}
                                  />
                                </div>
                              ))}
                              {draft.photos.length > 6 ? (
                                <div className="flex h-[82px] items-center justify-center rounded-[16px] bg-white/78 text-sm font-black text-stone-500">
                                  +{draft.photos.length - 6}
                                </div>
                              ) : null}
                            </div>
                            <p className="mt-3 truncate text-xs font-black text-stone-500">
                              可继续点击或拖拽添加更多照片
                            </p>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`flex h-16 w-16 items-center justify-center rounded-[24px] ${tone.uploadIcon}`}
                            >
                              <UploadIcon className="h-8 w-8" />
                            </span>
                            {isMemorial ? (
                              <>
                                <span className="mt-4 text-sm font-black text-stone-700">
                                  点击选择照片
                                </span>
                                <span className="mt-1 text-sm font-black text-stone-700">
                                  或将照片拖拽到此处
                                </span>
                              </>
                            ) : (
                              <span className="mt-4 text-sm font-black text-stone-700">
                                点击选择或拖拽照片到此处
                              </span>
                            )}
                            <span className="mt-2 text-xs font-semibold text-stone-400">
                              支持 JPG、PNG、WEBP 格式，单张不超过 20MB
                            </span>
                          </>
                        )}
                      </button>
                    )}
                    <span className="mt-2 block min-h-[18px] text-xs font-black text-rose-400">
                      {uploadErrors.photos || ''}
                    </span>
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      ref={fileInputRef}
                      type="file"
                    />
                  </div>

                  <label className="block text-xs font-black text-stone-500">
                    照片简介
                    <textarea
                      className={`mt-2 h-20 w-full resize-none rounded-2xl border bg-white/82 px-4 py-3 text-sm font-bold leading-6 text-stone-700 outline-none transition duration-200 ease-out placeholder:text-stone-300 ${tone.accentBorder} ${tone.focus}`}
                      maxLength={20}
                      onChange={(event) => {
                        clearUploadError('note')
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          note: event.target.value.slice(0, 20),
                        }))
                      }}
                      placeholder="比如：第一次晒太阳 / 今天很乖 / 花园里的小探险"
                      value={draft.note}
                    />
                    <div className="mt-1 flex min-h-[18px] items-center justify-between gap-3">
                      <span
                        className={`text-xs font-bold ${
                          uploadErrors.note ? 'text-rose-400' : tone.text
                        }`}
                      >
                        {uploadErrors.note || '简介不要超过 20 个字'}
                      </span>
                      <span className="text-xs font-black text-stone-400">
                        {draft.note.length}/20
                      </span>
                    </div>
                  </label>

                  <label className="block text-xs font-black text-stone-500">
                    添加日期 *
                    <button
                      className={`mt-2 flex h-11 w-full items-center justify-between rounded-2xl border bg-white/82 px-4 text-left text-sm font-bold outline-none transition duration-200 ease-out ${
                        uploadErrors.date ? 'border-rose-300' : tone.accentBorder
                      } ${draft.date ? 'text-stone-800' : 'text-stone-300'} ${
                        tone.focus
                      }`}
                      onClick={openDatePicker}
                      type="button"
                    >
                      {draft.date ? formatDateForDisplay(draft.date) : '选择日期'}
                      <svg
                        aria-hidden="true"
                        className={`h-4 w-4 ${tone.accent}`}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          height="16"
                          rx="4"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          width="17"
                          x="3.5"
                          y="4.5"
                        />
                        <path
                          d="M8 3v4M16 3v4M4 9h16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2.2"
                        />
                      </svg>
                    </button>
                    <input
                      className="sr-only"
                      onChange={(event) => {
                        clearUploadError('date')
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          date: event.target.value,
                        }))
                      }}
                      ref={dateInputRef}
                      type="date"
                      value={draft.date}
                    />
                    <span className="mt-1 block min-h-[16px] text-xs font-black text-rose-400">
                      {uploadErrors.date || ''}
                    </span>
                  </label>

                  <div className={`rounded-[24px] px-4 py-4 ${tone.soft}`}>
                    <p className={`text-xs font-black ${tone.text}`}>
                      保存后会自动隐藏示例照片，只展示你的真实相册。
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-stone-100 px-6 py-5">
                  <button
                    className="h-11 flex-1 rounded-full border border-stone-200 bg-white/86 text-sm font-black text-stone-600 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:scale-[0.97]"
                    onClick={closeDrawer}
                    type="button"
                  >
                    取消
                  </button>
                  <button
                    className={`h-11 flex-1 rounded-full text-sm font-black text-white transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${tone.button}`}
                    onClick={savePhoto}
                    type="button"
                  >
                    {drawerMode === 'edit' ? '保存修改' : '保存'}
                  </button>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

export default Album
