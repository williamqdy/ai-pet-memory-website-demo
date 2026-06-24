const aiReferenceImageDatabaseName = 'petMemoryAiReferenceImages'
const aiReferenceImageStoreName = 'aiReferenceImages'
const aiReferenceImageDatabaseVersion = 1

export type AiReferenceImageRecord = {
  createdAt: string
  dataUrl: string
  imageId: string
  mimeType: string
}

const openAiReferenceImageDB = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('indexeddb-unavailable'))
      return
    }

    const request = indexedDB.open(
      aiReferenceImageDatabaseName,
      aiReferenceImageDatabaseVersion,
    )

    request.onerror = () => reject(request.error ?? new Error('open-failed'))
    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(aiReferenceImageStoreName)) {
        database.createObjectStore(aiReferenceImageStoreName, {
          keyPath: 'imageId',
        })
      }
    }
    request.onsuccess = () => resolve(request.result)
  })

const runAiReferenceImageTransaction = async <T>(
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => IDBRequest<T>,
) => {
  const database = await openAiReferenceImageDB()

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(aiReferenceImageStoreName, mode)
    const store = transaction.objectStore(aiReferenceImageStoreName)
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

export const saveAiReferenceImage = (record: AiReferenceImageRecord) =>
  runAiReferenceImageTransaction('readwrite', (store) => store.put(record))

export const getAiReferenceImage = (imageId: string) =>
  runAiReferenceImageTransaction<AiReferenceImageRecord | undefined>(
    'readonly',
    (store) => store.get(imageId),
  )

export const deleteAiReferenceImage = (imageId: string) =>
  runAiReferenceImageTransaction('readwrite', (store) => store.delete(imageId))

export const clearAiReferenceImages = () =>
  runAiReferenceImageTransaction('readwrite', (store) => store.clear())
