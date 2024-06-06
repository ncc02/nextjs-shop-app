import { create } from 'zustand'

interface LoadingStore {
  isLoading: boolean
  setIsLoading: (status: boolean) => void
  loading: () => void
  unLoading: () => void
}

const useLoading = create<LoadingStore>(set => ({
  isLoading: false,
  setIsLoading(status) {
    set({ isLoading: status })
  },
  loading() {
    set({ isLoading: true })
  },
  unLoading() {
    set({ isLoading: false })
  },
}))

export default useLoading
