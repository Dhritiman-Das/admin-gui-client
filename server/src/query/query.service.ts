import { Injectable } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { QueryMongoService } from 'src/mongo/query-mongo/query-mongo.service';
import { MongoClient } from 'mongodb';
import { generateQuery } from 'lib/helpers';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { HistoryService } from 'src/history/history.service';

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
    const user = await this.userMongoService.findOne({
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

  findAll() {
    return `This action returns all query`;
  }

  findOne(id: number) {
    return `This action returns a #${id} query`;
  }

  update(id: number, updateQueryDto: UpdateQueryDto) {
    return `This action updates a #${id} query`;
  }

  remove(id: number) {
    return `This action removes a #${id} query`;
  }

  async executeQuery(items: {
    dbConnectionString: string;
    dbName: string;
    dbCollectionName: string;
    queryId: string;
    queryString: string;
    executeQueryDto: any;
    userId: string;
  }) {
    const {
      dbConnectionString,
      dbName,
      dbCollectionName,
      queryId,
      queryString,
      executeQueryDto,
      userId,
    } = items;
    const query = JSON.parse(generateQuery(queryString, executeQueryDto));
    const client = new MongoClient(dbConnectionString);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(dbCollectionName);
      console.log({ dbName, dbCollectionName, collection });

      // const queryStringDummy = `{ "plan": var(plan_val), "startDate": {"$gte": var(startDate_val)} }`;
      // const executeQueryDtoDummy = {
      //   plan_val: 'trial',
      //   startDate_val: '1706265858',
      // };

      console.log({ query });
      const result = await collection.find(query).toArray();
      console.log({ result });
      await this.historyService.create({
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
