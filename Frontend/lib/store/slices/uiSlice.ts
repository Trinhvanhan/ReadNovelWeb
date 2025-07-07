import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface UIState {
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  modals: {
    login: boolean
    signup: boolean
    settings: boolean
    bookmarks: boolean
    search: boolean
  }
  toasts: Toast[]
  loading: {
    global: boolean
    components: Record<string, boolean>
  }
  viewport: {
    width: number
    height: number
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }
}

const initialState: UIState = {
  theme: "system",
  sidebarOpen: false,
  modals: {
    login: false,
    signup: false,
    settings: false,
    bookmarks: false,
    search: false,
  },
  toasts: [],
  loading: {
    global: false,
    components: {},
  },
  viewport: {
    width: 1920,
    height: 1080,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    openModal: (state, action: PayloadAction<keyof UIState["modals"]>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<keyof UIState["modals"]>) => {
      state.modals[action.payload] = false
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState["modals"]] = false
      })
    },
    addToast: (state, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      state.loading.components[action.payload.component] = action.payload.loading
    },
    updateViewport: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.viewport.width = action.payload.width
      state.viewport.height = action.payload.height
      state.viewport.isMobile = action.payload.width < 768
      state.viewport.isTablet = action.payload.width >= 768 && action.payload.width < 1024
      state.viewport.isDesktop = action.payload.width >= 1024
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
  setComponentLoading,
  updateViewport,
} = uiSlice.actions

export default uiSlice.reducer
