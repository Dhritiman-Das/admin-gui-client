import { UserProfile } from "@/app/home/profile/editProfileDialog";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// axiosInstance.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = window.localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = "Bearer " + token;
//     }
//   }
//   return config;
// });

export const getSessionFn = async () => {
  const response = await axios.get("/api/auth/session");
  if (response?.data && Object.keys(response.data).length === 0) {
    return null;
  }
  return response;
};

export const createUser = async (user: {
  name: string;
  email: string;
  image: string;
  verified: boolean;
}) => {
  console.log({ user });

  const response = await axiosInstance.post("/users", user);
  return response;
};

export const getUserInfo = async (token: string) => {
  const response = await axiosInstance.get("users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateUser = async ({
  token,
  user,
}: {
  token: string;
  user: UserProfile;
}) => {
  const response = await axiosInstance.patch(`/users`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response;
};

export const checkIfUserExist = async (email: string) => {
  console.log({ email });

  const response = await axiosInstance.post("/users/exist", { email });
  return response;
};
