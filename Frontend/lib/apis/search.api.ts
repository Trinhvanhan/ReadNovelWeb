import { axiosi } from "./config/axios.config"
import type { SearchParams } from "./types/param.type"
import type { ApiResponse } from "./types/api.type";

export const getSearchResults = async (params: SearchParams): Promise<ApiResponse> => {
  try {
    // const queryParams: any = {
    //   q: params.q,
    //   genres: params.genres?.join(','),
    //   status: params.status?.join(','),
    //   rating: params.rating ? `${params.rating[0]},${params.rating[1]}` : undefined,
    //   wordCount: params.wordCount ? `${params.wordCount[0]},${params.wordCount[1]}` : undefined,
    //   tags: params.tags?.join(','),
    //   sortBy: params.sortBy,
    //   sortOrder: params.sortOrder,
    //   page: params.page,
    //   limit: params.limit,
    // };

    // Remove undefined params
    // Object.keys(params).forEach(key => {
    //   if (params[key] === undefined) delete params[key];
    // });

    const res = await axiosi.get('/search', { params: params });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch search results' };
  }
};

export const getSearchSuggestions = async (query: string): Promise<ApiResponse> => {
  try {
    const res = await axiosi.get('/search/suggestions', {
      params: { q: query },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch search suggestions' };
  }
};