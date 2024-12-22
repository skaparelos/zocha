import axios, { AxiosRequestConfig } from "axios";

export async function getUserDetails(userIds: string[], jwtToken: string) {
  if (userIds.length == 0) {
    return []
  }

  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Host': 'api.resyos.com',
        'X-ResyOS-Host': 'resyos.ios.mobile',
        'Accept': 'application/json',
        'Accept-Language': 'en-GB,en;q=0.9',
        'User-Agent': 'ResyOS/4.79 (com.resy.OS; build:16779; iOS 17.6)',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Resy-Universal-Auth': jwtToken
      }
    };

    // Convert array of IDs to comma-separated string and encode
    const formData = `ids=${encodeURIComponent(userIds.join(','))}`;

    const response = await axios.post(
      'https://api.resyos.com/2/os/users',
      formData,
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get user details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 