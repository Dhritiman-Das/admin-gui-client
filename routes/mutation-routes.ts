import { Mutation } from "@/app/home/[projectId]/mutate/mutationDialog";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const createMutation = async ({
  projectId,
  data,
  token,
}: {
  projectId: string;
  data: Mutation;
  token: string;
}) => {
  const response = await axiosInstance.post(
    `/mutations`,
    {
      ...data,
      project: projectId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const updateMutation = async ({
  mutationId,
  data,
  token,
}: {
  mutationId: string;
  data: Mutation;
  token: string;
}) => {
  const response = await axiosInstance.patch(`/mutations/${mutationId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getMutationsForProject = async ({
  projectId,
  token,
}: {
  projectId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(`/mutations/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteMutation = async ({
  mutationId,
  token,
}: {
  mutationId: string;
  token: string;
}) => {
  const response = await axiosInstance.delete(`/mutations/${mutationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getAMutation = async ({
  mutationId,
  token,
}: {
  mutationId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(`/mutations/${mutationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const executeMutationQuery = async ({
  mutationId,
  token,
  body,
}: {
  mutationId: string;
  token: string;
  body: Record<string, any>;
}) => {
  const response = await axiosInstance.post(
    `/mutations/${mutationId}/query`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const executeMutationChange = async ({
  mutationId,
  token,
  body,
}: {
  mutationId: string;
  token: string;
  body: Record<string, any>;
}) => {
  const response = await axiosInstance.post(
    `/mutations/${mutationId}/execute`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
