import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userMongoService: UserMongoService,
    private readonly projectService: ProjectsService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userMongoService.create(createUserDto);

    const project = await this.projectService.create({
      name: createUserDto.name,
      description: '',
      dbConnectionString: '',
      admin: user,
      mode: 'personal',
      deleted: false,
    });
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
        },
      },
      options: { new: true },
    });
    const projectId = project._id.toString();
    return userUpdated;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne({
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
    return await this.userMongoService.findOne({
      query,
      options,
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
}
