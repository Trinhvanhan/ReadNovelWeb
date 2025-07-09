import { axiosi } from "./config/axios.config";
import { ApiResponse } from "./types/api.type";
import { NovelInfo, Novel, Chapter, ChapterInfo } from "./types/data.type";

export const getNovels = async (): Promise<ApiResponse> => {
  try {
    const res = await axiosi.get('/novels') as ApiResponse;
    return res;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch novels' };
  }
};

export const getNovelById = async (id: string): Promise<ApiResponse> => {
  try {
    const res = await axiosi.get(`/novels/${id}`) as ApiResponse;
    return res;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch novel' };
  }
};

