
import { axiosi } from "./config/axios.config";
import { ApiResponse } from "./types/api.type";
interface LoginBody {
  email: string;
  password: string;
}
interface SignupBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const login = async (formData: LoginBody): Promise<ApiResponse> => {
  try {
    const res = await axiosi.post('/auth/login', formData) as ApiResponse;
    return res;
  } catch (error: any) {
    throw error.response?.data || { message: 
      'Failed to login, please check your credentials and try again.'
    };
  }
};

export const signup = async (formData: SignupBody): Promise<ApiResponse> => {
  try {
    const res = await axiosi.post('/auth/signup', formData) as ApiResponse;
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 
      'Failed to signup, please check your details and try again.'
    };
  }
};
