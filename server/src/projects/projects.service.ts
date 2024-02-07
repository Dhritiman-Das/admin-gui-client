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

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
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
