import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoClient } from 'mongodb';
import {
  CreateProjectDto,
  CreateProjectWithAdminDto,
} from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { QueryService } from 'src/query/query.service';
import { QueryMongoService } from 'src/mongo/query-mongo/query-mongo.service';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { AddMembersDto } from './dto/add-members.dto';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';
import { decryptData, encryptData } from 'lib/helpers';
import { WaitlistsMongoService } from 'src/mongo/waitlists-mongo/waitlists-mongo.service';
import { MailerService } from '@nestjs-modules/mailer';
import { PROJECT_JOINING_INVITE } from 'lib/email-template/project-joining-invite';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectMongoService: ProjectMongoService,
    private readonly userMongoService: UserMongoService,
    private readonly queryMongoService: QueryMongoService,
    private readonly queryService: QueryService,
    private readonly waitlistsMongoService: WaitlistsMongoService,
    private readonly mailerService: MailerService,
  ) {}
  async create(createProjectDto: CreateProjectWithAdminDto) {
    const project = await this.projectMongoService.create({
      ...createProjectDto,
      dbConnectionString: await encryptData(
        createProjectDto.dbConnectionString,
      ),
    });
    console.log({ project });

    const projectPermission = {
      project: project._id,
      role: 'admin',
      isAdvancedSettings: false,
      advancedSettings: {
        query: 'admin',
        mutate: 'admin',
        members: 'admin',
        projects: 'admin',
      },
    };

    const user = await this.userMongoService.findOneAndUpdate({
      query: { _id: createProjectDto.admin },
      update: {
        $push: {
          projects: projectPermission,
        },
      },
    });

    console.log({ user });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return project;
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
    const project = await this.projectMongoService.findOne({
      query,
      projection,
    });
    const projectObj = project.toObject();

    return {
      ...projectObj,
      dbConnectionString: await decryptData(projectObj.dbConnectionString),
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectMongoService.findOneAndUpdate({
      query: { _id: id },
      update: {
        ...updateProjectDto,
        dbConnectionString: await encryptData(
          updateProjectDto.dbConnectionString,
        ),
      },
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
        select: 'name image email createdAt timeZone verified title',
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
        select: 'name image',
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

    const client = new MongoClient(await decryptData(dbConnectionString));
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
    const {
      dbCollectionName,
      dbName,
      queryString,
      queryDataTypes,
      collation,
      projection,
      sort,
    } = await this.queryMongoService.findOne({
      query: { _id: queryId },
      // projection: { dbCollectionName: 1, dbName: 1, queryString: 1 },
    });
    return await this.queryService.executeQuery({
      projectId,
      dbConnectionString: await decryptData(dbConnectionString),
      dbName,
      dbCollectionName,
      queryId,
      queryString,
      queryDataTypes,
      executeQueryDto,
      userId,
      collation,
      projection,
      sort,
    });
  }

  async listMembers(projectId: string) {
    return await this.userMongoService.findAll({
      query: {
        projects: {
          $elemMatch: { project: projectId },
        },
      },
      projection: {
        name: 1,
        email: 1,
        image: 1,
        'projects.$': 1,
      },
    });
  }

  async listInvitedMembers(projectId: string) {
    const registeredUsers =
      await this.userMongoService.findInvitedRegisteredUsers(projectId);

    const waitlistedUsers =
      await this.waitlistsMongoService.findAllUnregisteredUsers(projectId);

    return [...registeredUsers, ...waitlistedUsers];
  }

  async addMembers({
    projectId,
    addMembersDto,
    invitorEmail,
    invitorName,
    ip,
  }: {
    projectId: string;
    addMembersDto: AddMembersDto;
    invitorEmail: string;
    invitorName?: string;
    ip: string;
  }) {
    console.log({ addMembersDto, invitorEmail, invitorName, ip });
    const project = await this.projectMongoService.findOne({
      query: { _id: projectId },
    });

    // Check if the project is already present in the user's projects
    const userWithProject = await this.userMongoService.findOne({
      query: {
        email: addMembersDto.email,
        projects: { $elemMatch: { project: projectId } },
      },
    });

    if (userWithProject) {
      throw new BadRequestException(
        "Project is already present in the user's projects",
      );
    }

    //Check if the project is in the user's invited projects
    const userWithInvitedProject = await this.userMongoService.findOne({
      query: {
        email: addMembersDto.email,
        invitedProjects: { $elemMatch: { project: projectId } },
      },
    });

    if (userWithInvitedProject) {
      throw new BadRequestException(
        'User has already been invited to join the project.',
      );
    }

    // Add the project to the user's projects invite List
    const user = await this.userMongoService.findOneAndUpdate({
      query: { email: addMembersDto.email },
      update: {
        $push: {
          invitedProjects: {
            project,
            role: addMembersDto.role,
            isAdvancedSettings: addMembersDto.isAdvancedRolesOpen,
            advancedSettings: addMembersDto.advancedRoles,
          },
        },
      },
    });

    if (!user) {
      //Send the user an invite to email and add the project to the user's waitlisted projects
      const invite = await this.mailerService.sendMail({
        to: addMembersDto.email,
        from: process.env.EMAIL_USERNAME,
        subject: 'Invitation to join a project',
        text: `You have been invited to join the project ${project.name}. Click on the link to join the project.`,
        html: PROJECT_JOINING_INVITE({
          invitorEmail,
          invitorName,
          inviteeEmail: addMembersDto.email,
          projectName: project.name,
          ip: '',
        }),
      });

      const waitlist = await this.waitlistsMongoService.create({
        email: addMembersDto.email,
        projectPermissions: {
          project: projectId,
          role: addMembersDto.role,
          isAdvancedSettings: addMembersDto.isAdvancedRolesOpen,
          advancedSettings: addMembersDto.advancedRoles,
        },
      });
      // throw new NotFoundException(
      //   `User with email ${addMembersDto.email} not found. An invite has been sent to their email`,
      // );
      return {
        message: `An invite has been sent to ${addMembersDto.email} to join the project.`,
      };
    }

    return {
      message: 'User added successfully.',
      userId: user._id,
    };
  }

  async updateMember({
    projectId,
    userId,
    updateMemberDto,
  }: {
    projectId: string;
    userId: string;
    updateMemberDto: AddMembersDto;
  }) {
    const project = await this.projectMongoService.findOne({
      query: { _id: projectId },
    });

    const user = await this.userMongoService.findOneAndUpdate({
      query: { _id: userId, 'projects.project': projectId },
      update: {
        $set: {
          'projects.$.role': updateMemberDto.role,
          'projects.$.isAdvancedSettings': updateMemberDto.isAdvancedRolesOpen,
          'projects.$.advancedSettings': updateMemberDto.advancedRoles,
        },
      },
    });

    return {
      message: 'User updated successfully.',
      userId: user._id,
    };
  }

  async removeMember({
    projectId,
    userId,
  }: {
    projectId: string;
    userId: string;
  }) {
    const user = await this.userMongoService.findOneAndUpdate({
      query: { _id: userId },
      update: {
        $pull: {
          projects: { project: projectId },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User removed successfully.',
      userId: user._id,
    };
  }
}
