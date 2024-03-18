import { Project } from "@/app/create-project/create-project-form";
import { QueryDataTypes } from "@/app/home/[projectId]/query/addQueryDialog";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const getProjectInfo = async (projectId: string, token: string) => {
  const response = await axiosInstance.get(`projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getDbDetails = async ({
  projectId,
  token,
}: {
  projectId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(`projects/${projectId}/db-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createProject = async ({
  project,
  token,
}: {
  project: Project;
  token: string;
}) => {
  const response = await axiosInstance.post(`projects`, project, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateProject = async ({
  projectId,
  project,
  token,
}: {
  projectId: string;
  project: any;
  token: string;
}) => {
  console.log({ project });

  const response = await axiosInstance.patch(`projects/${projectId}`, project, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createQuery = async ({
  projectId,
  query,
  token,
}: {
  projectId: string;
  query: {
    name: string;
    queryString: string;
    queryDataTypes?: Record<string, QueryDataTypes>;
    projection?: string;
    sort?: string;
    collation?: string;
    dbName: string;
    dbCollectionName: string;
    description?: string;
  };
  token: string;
}) => {
  const response = await axiosInstance.post(
    `projects/${projectId}/query`,
    query,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const editQuery = async ({
  projectId,
  queryId,
  query,
  token,
}: {
  projectId: string;
  queryId: string;
  query: {
    name: string;
    queryString: string;
    queryDataTypes?: Record<string, QueryDataTypes>;
    dbName: string;
    dbCollectionName: string;
    projection?: string;
    sort?: string;
    collation?: string;
    description?: string;
  };
  token: string;
}) => {
  const response = await axiosInstance.patch(
    `projects/${projectId}/query/${queryId}`,
    query,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const getQueries = async ({
  projectId,
  token,
}: {
  projectId: string;
  token: string;
}) => {
  console.log({ projectId, token });

  const response = await axiosInstance.get(`projects/${projectId}/query`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getQuery = async ({
  projectId,
  queryId,
  token,
}: {
  projectId?: string;
  queryId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(
    `projects/${projectId}/query/${queryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const executeQuery = async ({
  projectId,
  queryId,
  token,
  executeQueryDto,
}: {
  projectId: string;
  queryId: string;
  token: string;
  executeQueryDto: any;
}) => {
  const response = await axiosInstance.post(
    `projects/${projectId}/query/${queryId}/execute`,
    executeQueryDto,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deleteQuery = async ({
  projectId,
  queryId,
  token,
}: {
  projectId: string;
  queryId: string;
  token: string;
}) => {
  const response = await axiosInstance.delete(
    `projects/${projectId}/query/${queryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const getMembers = async ({
  projectId,
  token,
}: {
  projectId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(`projects/${projectId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const getInvitedMembers = async ({
  projectId,
  token,
}: {
  projectId: string;
  token: string;
}) => {
  const response = await axiosInstance.get(
    `projects/${projectId}/members/invited`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const addMembers = async ({
  projectId,
  addMembersDto,
  token,
}: {
  projectId: string;
  addMembersDto: any;
  token: string;
}) => {
  const response = await axiosInstance.post(
    `projects/${projectId}/members`,
    addMembersDto,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const updateMember = async ({
  projectId,
  userId,
  user,
  token,
}: {
  projectId: string;
  userId: string;
  user: any;
  token: string;
}) => {
  const response = await axiosInstance.patch(
    `projects/${projectId}/members/${userId}`,
    user,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const removeMember = async ({
  projectId,
  userId,
  token,
}: {
  projectId: string;
  userId: string;
  token: string;
}) => {
  const response = await axiosInstance.delete(
    `projects/${projectId}/members/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
