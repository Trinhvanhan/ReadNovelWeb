import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences: {
    theme: "light" | "dark" | "system"
    fontSize: number
    fontFamily: string
    notifications: {
      email: boolean
      push: boolean
      newChapters: boolean
      recommendations: boolean
    }
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  sessionExpiry: number | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionExpiry: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; sessionExpiry: number }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      state.sessionExpiry = action.payload.sessionExpiry
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = action.payload
      state.sessionExpiry = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      state.sessionExpiry = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<User["preferences"]>>) => {
      if (state.user) {
        state.user.preferences = { ...state.user.preferences, ...action.payload }
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, updatePreferences, clearError } =
  authSlice.actions

export default authSlice.reducer
