import { axiosi } from './config/axios.config';
import { ApiResponse } from './types/api.type';
import type { ToggleInteractionBody } from './types/data.type'



export const toggleInteraction = async (body: ToggleInteractionBody): Promise<ApiResponse> => {
  try {
    const res = await axiosi.post('/interactions/toggle', body);
    return res;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to toggle interaction' };
  }
};
