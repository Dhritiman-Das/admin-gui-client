import { Injectable } from '@nestjs/common';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { UpdateMutationDto } from './dto/update-mutation.dto';
import { MutationMongoService } from 'src/mongo/mutation-mongo/mutation-mongo.service';
import { Mutation } from 'src/mongo/mutation-mongo/mutation-mongo.schema';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { User, UserDocument } from 'src/mongo/user-mongo/user-mongo.schema';
import { MongoClient } from 'mongodb';
import { decryptData, generateQuery, generateUpdateObject } from 'lib/helpers';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class MutationService {
  constructor(
    private readonly mutationMongoService: MutationMongoService,
    private readonly projectMongoService: ProjectMongoService,
    private readonly userMongoService: UserMongoService,
    private readonly historyService: HistoryService,
  ) {}
  async create(createMutationDto: CreateMutationDto, userId: User) {
    const project = await this.projectMongoService.findOne({
      query: {
        _id: createMutationDto.project,
      },
    });
    console.log({ userIzDis: userId });

    const author = await this.userMongoService.findOne({
      query: {
        _id: userId,
      },
    });
    console.log({ author, userId });

    return this.mutationMongoService.create({
      ...createMutationDto,
      project,
      author,
    });
  }

  findAll() {
    return `This action returns all mutation`;
  }

  findOne(id: string) {
    return this.mutationMongoService.findOne({
      query: { _id: id },
      populate: {
        path: 'author',
        select: 'name image',
      },
    });
  }

  findAllForProject(projectId: string) {
    return this.mutationMongoService.findAll({
      query: { project: projectId },
      populate: {
        path: 'author',
        select: 'name image email createdAt timeZone verified title',
      },
    });
  }

  update(id: string, updateMutationDto: UpdateMutationDto) {
    return this.mutationMongoService.findOneAndUpdate({
      query: { _id: id },
      update: updateMutationDto,
    });
  }

  remove(id: string) {
    return this.mutationMongoService.delete({ query: { _id: id } });
  }

  findAllMutations({ projectId }: { projectId: string }) {
    return this.mutationMongoService.findAll({ query: { project: projectId } });
  }

  async executeQuery(mutationDto: Record<string, any>, mutationId: string) {
    console.log({ mutationDto, mutationId });

    const mutation = await this.mutationMongoService.findOne({
      query: { _id: mutationId },
    });

    if (!mutation) {
      throw new Error('Mutation not found');
    }

    const {
      project,
      dbName,
      dbCollectionName,
      queryString,
      queryDataTypes,
      projection,
      mutateObj,
    } = mutation;
    console.log({
      project,
      dbName,
      dbCollectionName,
      queryString,
      queryDataTypes,
      projection,
      mutateObj,
    });

    const projectDoc = await this.projectMongoService.findOne({
      query: { _id: project },
    });
    const { dbConnectionString } = projectDoc;
    if (!!!dbConnectionString) {
      throw new Error('Project not found');
    }
    console.log({ dbConnectionString });

    try {
      const client = new MongoClient(await decryptData(dbConnectionString));
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(dbCollectionName);
      const query = generateQuery(queryString, mutationDto, queryDataTypes);
      console.log({ query });

      const result = await collection.find(query).project(projection).toArray();
      // await this.historyService.create({
      //   project: projectDoc,
      //   user: await this.userMongoService.findOne({ query: { _id: userId } }),
      //   query: await this.queryMongoService.findOne({
      //     query: { _id: queryId },
      //   }),
      //   queryValues: executeQueryDto,
      //   success: true,
      // });
      return result;
    } catch (error) {
      console.log({ error });
    }
  }

  async executeMutation(
    queryDto: Record<string, any>,
    mutationDto: Record<string, any>,
    mutationId: string,
    userId: User,
  ) {
    console.log({ mutationDto: queryDto, mutationId });

    const mutation = await this.mutationMongoService.findOne({
      query: { _id: mutationId },
    });

    if (!mutation) {
      throw new Error('Mutation not found');
    }

    const {
      project,
      dbName,
      dbCollectionName,
      queryString,
      queryDataTypes,
      projection,
      mutateObj,
    } = mutation;
    console.log({
      project,
      dbName,
      dbCollectionName,
      queryString,
      queryDataTypes,
      projection,
      mutateObj,
    });

    const projectDoc = await this.projectMongoService.findOne({
      query: { _id: project },
    });
    const { dbConnectionString } = projectDoc;
    if (!!!dbConnectionString) {
      throw new Error('Project not found');
    }
    console.log({ dbConnectionString });

    try {
      const client = new MongoClient(await decryptData(dbConnectionString));
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(dbCollectionName);
      const query = generateQuery(queryString, queryDto, queryDataTypes);
      const updateObj = generateUpdateObject(mutateObj, mutationDto);
      console.log({ updateObj });

      const result = await collection.findOneAndUpdate(
        query,
        {
          $set: updateObj,
        },
        {
          projection: projection,
          returnDocument: 'after',
        },
      );
      await this.historyService.create({
        type: 'mutation',
        project: projectDoc,
        user: await this.userMongoService.findOne({ query: { _id: userId } }),
        mutation: await this.mutationMongoService.findOne({
          query: { _id: mutationId },
        }),
        queryValues: queryDto,
        mutationObjValues: mutationDto,
        success: true,
      });
      return result;
    } catch (error) {
      console.log({ error });
      await this.historyService.create({
        type: 'mutation',
        project: projectDoc,
        user: await this.userMongoService.findOne({ query: { _id: userId } }),
        mutation: await this.mutationMongoService.findOne({
          query: { _id: mutationId },
        }),
        queryValues: queryDto,
        mutationObjValues: mutationDto,
        success: false,
      });
    }
  }
}
