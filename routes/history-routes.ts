import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const getHistory = async ({
  projectId,
  token,
}: {
  projectId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(`history/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getHistoryById = async ({
  historyId,
  token,
}: {
  historyId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(`history/${historyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
