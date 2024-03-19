import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { ProjectsService } from 'src/projects/projects.service';
import { WaitlistsMongoService } from 'src/mongo/waitlists-mongo/waitlists-mongo.service';
import { User, UserDocument } from 'src/mongo/user-mongo/user-mongo.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly userMongoService: UserMongoService,
    private readonly projectService: ProjectsService,
    private readonly waitlistsMongoService: WaitlistsMongoService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userMongoService.create(createUserDto);
    console.log({ user });

    const project = await this.projectService.create({
      name: createUserDto.name,
      description: '',
      dbConnectionString: '',
      admin: user,
      mode: 'personal',
    });
    const waitlistedProjectsObj = await this.waitlistsMongoService.findOne({
      email: createUserDto.email,
    });
    console.log({ waitlistedProjectsObj });

    let waitlistedProject = [];
    if (waitlistedProjectsObj) {
      waitlistedProject = waitlistedProjectsObj.project;
    }
    const userUpdated = await this.userMongoService.findOneAndUpdate({
      query: { _id: user._id },
      update: {
        $push: {
          projects: {
            project,
            role: 'admin',
            isAdvancedSettings: false,
            advancedSettings: {
              query: 'admin',
              mutate: 'admin',
              members: 'admin',
              projects: 'admin',
            },
          },
          invitedProjects: waitlistedProject,
        },
      },
      options: { new: true },
    });

    if (userUpdated && !!waitlistedProjectsObj) {
      await this.waitlistsMongoService.findOneAndDelete({
        query: { email: createUserDto.email },
      });
    }
    // const projectId = project._id.toString();
    return userUpdated;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne({
    query,
    projection,
    populate,
  }: {
    query: any;
    projection?: any;
    populate?: any;
  }): Promise<UserDocument> {
    return await this.userMongoService.findOne({
      query,
      projection,
      populate,
    });
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userMongoService.findOneAndUpdate({
      query: { _id: userId },
      update: updateUserDto,
      options: { new: true },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkIfUserExist(email: string) {
    return await this.userMongoService.findOne({
      query: { email },
    });
  }

  async getInvitedProjects(userId: User) {
    const user = await this.findOne({
      query: { _id: userId },
      projection: { invitedProjects: 1 },
      populate: {
        path: 'invitedProjects',
        populate: {
          path: 'project',
          select: 'name mode',
          model: 'Project',
        },
      },
    });
    return user.invitedProjects;
  }

  async handleProjectInvite(userId: User, projectId: string, accept: boolean) {
    if (!userId || !projectId || typeof accept !== 'boolean') {
      throw new Error('Invalid parameters');
    }

    try {
      if (accept) {
        const user = await this.userMongoService.findOne({
          query: {
            _id: userId,
            'invitedProjects.project': projectId,
          },
        });
        const project = user?.invitedProjects.find(
          (invitedProject) => invitedProject.project.toString() === projectId,
        );

        if (!!!user || !!!project) {
          throw new Error('User not invited to this project');
        }

        return this.userMongoService.findOneAndUpdate({
          query: { _id: userId },
          update: {
            $push: { projects: project },
            $pull: { invitedProjects: { project: projectId } },
          },
          options: {
            new: true,
          },
        });
      } else {
        return this.userMongoService.findOneAndUpdate({
          query: { _id: userId },
          update: {
            $pull: {
              invitedProjects: { project: projectId },
            },
          },
          options: { new: true },
        });
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error handling project invite');
    }
  }
}
