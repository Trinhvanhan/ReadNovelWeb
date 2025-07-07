import { axiosi } from "./config/axios.config";
import { ApiResponse } from "./types/api.type";
import { NovelInfo, Novel, Chapter, ChapterInfo } from "./types/data.type";

export const getNovels = async (): Promise<ApiResponse<NovelInfo[]>> => {
  try {
    const res = await axiosi.get<ApiResponse<NovelInfo[]>>('/novels', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch novels' };
  }
};

export const getNovelById = async (id: string): Promise<ApiResponse<Novel>> => {
  try {
    const res = await axiosi.get<ApiResponse<Novel>>(`/novels/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch novel' };
  }
};

