import { create } from 'zustand'

interface ImageStore {
  url: string | undefined
  setUrl: (url?: string) => void
}

const useImage = create<ImageStore>(set => ({
  url: undefined,
  setUrl(url) {
    set({ url })
  },
}))

export default useImage
