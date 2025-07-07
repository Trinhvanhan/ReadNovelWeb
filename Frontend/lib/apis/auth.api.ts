
import { axiosi } from "./config/axios.config";

interface ApiResponse<T = any> {
  data: T;
  status: string;
  message?: string;
}
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
    const res = await axiosi.post<ApiResponse>('/auth/login', formData, {
      headers: {  
        'Content-Type': 'application/json',
      },  
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 
      'Failed to login, please check your credentials and try again.'
    };
  }
};

export const signup = async (formData: SignupBody): Promise<ApiResponse> => {
  try {
    const res = await axiosi.post<ApiResponse>('/auth/signup', formData, {
      headers: {  
        'Content-Type': 'application/json',
      },  
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: 
      'Failed to signup, please check your details and try again.'
    };
  }
};
