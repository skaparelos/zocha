import axios, { AxiosRequestConfig } from 'axios';
import jwt from 'jsonwebtoken';

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === 'string') {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decoded.exp!;
  } catch (error) {
    return true;
  }
};


export const refreshAuthToken = async (authToken: string): Promise<string> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Host': 'auth.resy.com',
        'X-ResyOS-Host': 'resyos.ios.mobile',
        'Accept': 'application/json',
        'Accept-Language': 'en-GB,en;q=0.9',
        'User-Agent': 'ResyOS/4.79 (com.resy.OS; build:16779; iOS 17.6)',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Resy-Universal-Auth': authToken
      },
      data: 'venue_id=82702'
    };

    const response = await axios.post('https://auth.resy.com/1/auth/venue', config.data, config);
    if (!response.data?.token) {
      throw new Error('No token received in response');
    }
    return response.data.token;
  } catch (error) {
    throw new Error(`Failed to refresh auth token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};