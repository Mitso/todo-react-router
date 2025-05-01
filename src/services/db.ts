const DB_NAME = "todo-db"
const DB_VERSION = 1
const STORE_NAME = "todos"

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("Database error:", (event.target as IDBOpenDBRequest).error)
      reject(`Error opening database: ${(event.target as IDBOpenDBRequest).error}`)
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })

        // Create indexes
        store.createIndex("title", "title", { unique: false })
        store.createIndex("completed", "completed", { unique: false })
        store.createIndex("createdAt", "createdAt", { unique: false })
      }
    }
  })
}
