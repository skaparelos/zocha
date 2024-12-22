import axios, { AxiosRequestConfig } from 'axios';
import { ReservationsIdsResponse } from '../../types/reservations';

export async function getReservationIds(startDate: string, endDate: string, jwtToken: string): Promise<ReservationsIdsResponse[]> {
  try {
    const config: AxiosRequestConfig = {
      params: {
        end_datetime: endDate,
        start_datetime: startDate
      },
      headers: {
        'Host': 'api.resyos.com',
        'X-ResyOS-Host': 'resyos.ios.mobile',
        'Accept': 'application/json',
        'Accept-Language': 'en-GB,en;q=0.9',
        'User-Agent': 'ResyOS/4.79 (com.resy.OS; build:16779; iOS 17.6)',
        'Cookie': '2j3jfitz2z70o3ovz9jy38ztaixznec9',
        'X-Resy-Universal-Auth': jwtToken
      }
    };

    const response = await axios.get(`https://api.resyos.com/4/os/reservation/ids`, config);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get reservation IDs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getReservationDetails(reservationIds: string[], jwtToken: string) {
  if (reservationIds.length == 0) {
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
        'Content-Type': 'application/json',
        'X-Resy-Universal-Auth': jwtToken
      }
    };

    const response = await axios.post(
      'https://api.resyos.com/5/os/reservations',
      { ids: reservationIds },
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get reservation details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}