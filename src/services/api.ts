import api from './axiosInstance';
import Cookie from 'js-cookies';

export const login = async (userData: { email: string; password: string }) => {
  
  const res = await api.post('/login', userData);
  console.log("hi")
  Cookie.setItem('token', res.data.token);
  return res.data;
};

export const getUserData = async () => {
  try {
    const res = await api.get('/current-user');
    Cookie.setItem('role', res.data.role);
    return { success: true, user: res.data };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { success: false };
  }
};


export const registerUser = async (userData: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  profileImage?: File;
}) => {
const c=  await api.post('/register', userData);
console.log(c.data)
  return { success: true };
};

export const sendOtp = async (mobile: string) => {
  console.log(`API call: Sending OTP to ${mobile}`);
  await new Promise((r) => setTimeout(r, 1000));
  return { success: true };
};

export const verifyOtp = async (userId: string, otp: string, mobile?: string) => {
  const url = `/change-status/${userId}/${otp}`;
  await api.post(url);
   
  return { success: true };
};
