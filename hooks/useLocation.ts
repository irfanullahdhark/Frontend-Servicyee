import { getLocationByUserId } from "@/app/api/services/location";
import { useQuery } from "@tanstack/react-query";

export const useLocationByUserId = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: getLocationByUserId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
