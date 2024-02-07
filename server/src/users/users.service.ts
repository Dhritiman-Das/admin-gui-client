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
      name: '',
      description: '',
      dbConnectionString: '',
      admin: user,
      mode: 'personal',
      members: [user],
      deleted: false,
    });
    const userUpdated = await this.userMongoService.findOneAndUpdate({
      query: { _id: user._id },
      update: {
        $push: {
          projects: project,
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
  }: {
    query: any;
    projection?: any;
    options?: any;
  }) {
    return await this.userMongoService.findOne({ query });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
