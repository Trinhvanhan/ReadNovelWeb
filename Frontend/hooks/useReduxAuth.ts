"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { useLoginMutation, useSignupMutation } from "@/lib/store/api/apiSlice"
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updatePreferences,
} from "@/lib/store/slices/authSlice"
import type { User } from "@/lib/store/slices/authSlice"

export function useReduxAuth() {
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.auth)
  const [loginMutation] = useLoginMutation()
  const [signupMutation] = useSignupMutation()

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(loginStart())
        const result = await loginMutation({ email, password }).unwrap()
        dispatch(loginSuccess(result))
        return result
      } catch (error: any) {
        dispatch(loginFailure(error.message || "Login failed"))
        throw error
      }
    },
    [dispatch, loginMutation],
  )

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        dispatch(loginStart())
        const result = await signupMutation({ email, password, name }).unwrap()
        dispatch(loginSuccess(result))
        return result
      } catch (error: any) {
        dispatch(loginFailure(error.message || "Signup failed"))
        throw error
      }
    },
    [dispatch, signupMutation],
  )

  const signOut = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const updateUserProfile = useCallback(
    (updates: Partial<User>) => {
      dispatch(updateUser(updates))
    },
    [dispatch],
  )

  const updateUserPreferences = useCallback(
    (preferences: Partial<User["preferences"]>) => {
      dispatch(updatePreferences(preferences))
    },
    [dispatch],
  )

  return {
    ...authState,
    login,
    signup,
    signOut,
    updateUserProfile,
    updateUserPreferences,
  }
}
