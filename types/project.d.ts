export type ProjectEdit = {
  mode: "personal" | "team";
  name: string;
  description: string;
  dbConnectionString: string;
};

export type Project = ProjectEdit & {
  createdAt: Date;
  updatedAt: Date;
  _id: string;
};
