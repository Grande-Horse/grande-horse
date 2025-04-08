import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/services/user';
import UserInfoData from '@/types/user';

const useUserInfo = () => {
  return useQuery<UserInfoData | null>({ queryKey: ['UserInfo'], queryFn: getUserInfo });
};

export default useUserInfo;
