import apiClient from "../axios";


export const getLocationByUserId = async () => {
  try {
   const response = await apiClient.get('/location/pro');
   return response.data;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
}