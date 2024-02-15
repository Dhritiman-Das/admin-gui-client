import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { QueryService } from 'src/query/query.service';
import { QueryMongoService } from 'src/mongo/query-mongo/query-mongo.service';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectMongoService: ProjectMongoService,
    private readonly queryMongoService: QueryMongoService,
    private readonly queryService: QueryService,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    return await this.projectMongoService.create(createProjectDto);
  }

  findAll() {
    return `This action returns all projects`;
  }

  async findOne({
    query,
    projection,
    options,
  }: {
    query: any;
    projection?: any;
    options?: any;
  }) {
    return await this.projectMongoService.findOne({
      query,
      projection,
      options,
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectMongoService.findOneAndUpdate({
      query: { _id: id },
      update: updateProjectDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async listQueries({
    projectId,
    queryId,
  }: {
    projectId?: string;
    queryId?: string;
  }) {
    if (!!!projectId && !!!queryId) {
      throw new Error('projectId or queryId is required');
    }
    const query = {};
    if (projectId) {
      query['project'] = projectId;
    }

    if (queryId) {
      query['_id'] = queryId;
    }

    return await this.queryService.find({
      query: query,
      populate: {
        path: 'author',
        select: 'name profilePic',
      },
    });
  }

  async listQuery({
    projectId,
    queryId,
  }: {
    projectId?: string;
    queryId?: string;
  }) {
    if (!!!projectId && !!!queryId) {
      throw new Error('projectId or queryId is required');
    }
    const query = {};
    if (projectId) {
      query['project'] = projectId;
    }

    if (queryId) {
      query['_id'] = queryId;
    }

    return await this.queryService.findOne({
      query: query,
      populate: {
        path: 'author',
        select: 'name profilePic',
      },
    });
  }

  async deleteQuery({
    projectId,
    queryId,
  }: {
    projectId: string;
    queryId: string;
  }) {
    return await this.queryService.remove({
      query: { _id: queryId },
    });
  }

  async listDbDetails(projectId: string) {
    const { dbConnectionString } = await this.projectMongoService.findOne({
      query: { _id: projectId },
      projection: { dbConnectionString: 1 },
    });

    const client = new MongoClient(dbConnectionString);
    await client.connect();

    const databasesList = await client.db().admin().listDatabases();

    let dbDetails = [];

    for (let dbInfo of databasesList.databases) {
      const dbName = dbInfo.name;
      const collections = await client.db(dbName).listCollections().toArray();
      dbDetails.push({
        dbName: dbName,
        collections: collections.map((collection) => collection.name),
      });
    }

    await client.close();

    return dbDetails;
  }

  async executeQuery(items: {
    executeQueryDto: any;
    queryId: string;
    projectId: string;
    userId: string;
  }) {
    const { queryId, executeQueryDto, projectId, userId } = items;
    const { dbConnectionString } = await this.projectMongoService.findOne({
      query: { _id: projectId },
      projection: { dbCollectionName: 1, dbConnectionString: 1 },
    });
    const { dbCollectionName, dbName, queryString } =
      await this.queryMongoService.findOne({
        query: { _id: queryId },
        projection: { dbCollectionName: 1, dbName: 1, queryString: 1 },
      });
    return await this.queryService.executeQuery({
      projectId,
      dbConnectionString,
      dbName,
      dbCollectionName,
      queryId,
      queryString,
      executeQueryDto,
      userId,
    });
  }
}
