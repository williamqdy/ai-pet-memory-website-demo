const albumImageDatabaseName = 'petMemoryAlbumImages'
const albumImageStoreName = 'albumImages'
const albumImageDatabaseVersion = 1

export type AlbumImageRecord = {
  createdAt: string
  dataUrl: string
  imageId: string
  mimeType: string
}

const openAlbumImageDB = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('indexeddb-unavailable'))
      return
    }

    const request = indexedDB.open(
      albumImageDatabaseName,
      albumImageDatabaseVersion,
    )

    request.onerror = () => reject(request.error ?? new Error('open-failed'))
    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(albumImageStoreName)) {
        database.createObjectStore(albumImageStoreName, {
          keyPath: 'imageId',
        })
      }
    }
    request.onsuccess = () => resolve(request.result)
  })

const runAlbumImageTransaction = async <T>(
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => IDBRequest<T>,
) => {
  const database = await openAlbumImageDB()

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(albumImageStoreName, mode)
    const store = transaction.objectStore(albumImageStoreName)
    const request = executor(store)

    request.onerror = () => reject(request.error ?? new Error('request-failed'))
    request.onsuccess = () => resolve(request.result)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => {
      database.close()
      reject(transaction.error ?? new Error('transaction-failed'))
    }
    transaction.onabort = () => {
      database.close()
      reject(transaction.error ?? new Error('transaction-aborted'))
    }
  })
}

export const saveAlbumImage = (record: AlbumImageRecord) =>
  runAlbumImageTransaction('readwrite', (store) => store.put(record))

export const getAlbumImage = (imageId: string) =>
  runAlbumImageTransaction<AlbumImageRecord | undefined>('readonly', (store) =>
    store.get(imageId),
  )

export const deleteAlbumImage = (imageId: string) =>
  runAlbumImageTransaction('readwrite', (store) => store.delete(imageId))

export const clearAlbumImages = () =>
  runAlbumImageTransaction('readwrite', (store) => store.clear())
