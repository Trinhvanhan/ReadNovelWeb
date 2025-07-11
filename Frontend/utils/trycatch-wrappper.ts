// utils/try-catch-wrapper.ts
import { ApiResponse } from "@/lib/apis/types/api.type"

export async function tryCatchWrapper<T>(promise: Promise<Response>): Promise<ApiResponse<T>> {
  try {
    const res = await promise

    if (!res.ok) {
      const error = await res.json().catch(() => null)
      return {
        status: res.status,
        message: error?.message || `Request failed with status ${res.status}`,
        errorCode: error?.errorCode || `HTTP_${res.status}`
      }
    }

    const data: T = await res.json()
    return { status: res.status, data }
  } catch (error: any) {
    return {
      status: 0, // 0 → lỗi mạng, fetch fail, không có phản hồi
      message: error?.message || "Network error or request failed",
      errorCode: "NETWORK_ERROR"
    }
  }
}
