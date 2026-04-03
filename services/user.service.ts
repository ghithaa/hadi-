import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import {
  IUserDetails,
  IUserResponse,
  ILoginResponse,
  IRegisterResponse,
} from "@/types/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserQuery = () => {
  const { authData } = useAuth();
  const api = useFetch();

  return useQuery<IUserDetails | undefined>({
    queryKey: ["user", authData?.token],
    enabled: !!authData?.token,
    queryFn: async () => {
      if (authData?.token) {
        const response: IUserResponse = await api.get("user");
        return response?.result?.user;
      }
    },
  });
};

export const useLoginMutation = () => {
  const api = useFetch();

  return useMutation<
    ILoginResponse,
    { message: string },
    { email: string; password: string }
  >({
    mutationFn: (data) => {
      return api.post("auth/login", data);
    },
  });
};

export const useRegisterMutation = () => {
  const api = useFetch();

  return useMutation<
    IRegisterResponse,
    { message: string },
    { email: string; password: string; fullName: string }
  >({
    mutationFn: (data) => api.post("auth/register", data),
  });
};
