import { Injectable } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { QueryMongoService } from 'src/mongo/query-mongo/query-mongo.service';
import { MongoClient } from 'mongodb';
import { generateQuery } from 'lib/helpers';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { HistoryService } from 'src/history/history.service';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';
import { Document } from 'mongoose';

@Injectable()
export class QueryService {
  constructor(
    private readonly queryMongoService: QueryMongoService,
    private readonly projectMongoService: ProjectMongoService,
    private readonly userMongoService: UserMongoService,
    private readonly historyService: HistoryService,
  ) {}
  async create(
    createQueryDto: CreateQueryDto,
    userId: string,
    projectId: string,
  ) {
    const user: User = await this.userMongoService.findOne({
      query: { _id: userId },
    });

    const project = await this.projectMongoService.findOne({
      query: { _id: projectId },
    });

    return await this.queryMongoService.create({
      ...createQueryDto,
      author: user,
      project,
    });
  }

  async update(queryId: string, updateQueryDto: UpdateQueryDto) {
    return await this.queryMongoService.findOneAndUpdate({
      query: { _id: queryId },
      update: updateQueryDto,
    });
  }

  findAll() {
    return `This action returns all query`;
  }

  find({
    query,
    projection,
    options,
    populate,
  }: {
    query: any;
    projection?: any;
    options?: any;
    populate?: any;
  }) {
    return this.queryMongoService.find({
      query,
      projection,
      options,
      populate,
    });
  }

  findOne({
    query,
    projection,
    populate,
  }: {
    query: any;
    projection?: any;
    populate?: any;
  }) {
    return this.queryMongoService.findOne({
      query,
      projection,
      populate,
    });
  }

  remove({ query }: { query: any }) {
    return this.queryMongoService.remove({ query });
  }

  async executeQuery(items: {
    projectId: string;
    dbConnectionString: string;
    dbName: string;
    dbCollectionName: string;
    queryId: string;
    queryString: string;
    executeQueryDto: any;
    userId: string;
    projection?: Document;
    sort?: Document;
    collation?: Document;
  }) {
    const {
      projectId,
      dbConnectionString,
      dbName,
      dbCollectionName,
      queryId,
      queryString,
      executeQueryDto,
      userId,
      projection,
      sort,
      collation,
    } = items;
    const query = JSON.parse(generateQuery(queryString, executeQueryDto));
    const client = new MongoClient(dbConnectionString);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(dbCollectionName);

      // const queryStringDummy = `{ "plan": var(plan_val), "startDate": {"$gte": var(startDate_val)} }`;
      // const executeQueryDtoDummy = {
      //   plan_val: 'trial',
      //   startDate_val: '1706265858',
      // };
      console.log({ projection });

      const result = await collection.find(query).project(projection).toArray();
      await this.historyService.create({
        project: await this.projectMongoService.findOne({
          query: { _id: projectId },
        }),
        user: await this.userMongoService.findOne({ query: { _id: userId } }),
        query: await this.queryMongoService.findOne({
          query: { _id: queryId },
        }),
        queryValues: executeQueryDto,
        success: true,
      });
      return result;
    } catch (error) {
      console.error({ error });
      await this.historyService.create({
        project: await this.projectMongoService.findOne({
          query: { _id: projectId },
        }),
        user: await this.userMongoService.findOne({ query: { _id: userId } }),
        query: await this.queryMongoService.findOne({
          query: { _id: queryId },
        }),
        queryValues: executeQueryDto,
        success: false,
      });
      throw error;
    } finally {
      await client.close();
    }
  }
}
