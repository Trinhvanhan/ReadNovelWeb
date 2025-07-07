import { axiosi } from "./config/axios.config";
import { ApiResponse } from "./types/api.type";
import { NovelInfo, Novel, Chapter, ChapterInfo } from "./types/data.type";

export const getNovelChapterByNumber = async (id: string, chapterNumber: number): Promise<ApiResponse<Chapter>> => {
  try {
    const res = await axiosi.get<ApiResponse<Chapter>>(`/novels/${id}/chapters/${chapterNumber}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch novel chapter' };
  }
};