export const defaultRoute = "/home/";

export const routes = {
  default: (projectId: string) => `/home/${projectId}/query`,
  query: (projectId: string) => `/home/${projectId}/query`,
};
