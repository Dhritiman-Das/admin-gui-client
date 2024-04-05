import { Injectable } from '@nestjs/common';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { UpdateMutationDto } from './dto/update-mutation.dto';
import { MutationMongoService } from 'src/mongo/mutation-mongo/mutation-mongo.service';
import { Mutation } from 'src/mongo/mutation-mongo/mutation-mongo.schema';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';

@Injectable()
export class MutationService {
  constructor(
    private readonly mutationMongoService: MutationMongoService,
    private readonly projectMongoService: ProjectMongoService,
    private readonly userMongoService: UserMongoService,
  ) {}
  async create(createMutationDto: CreateMutationDto) {
    const project = await this.projectMongoService.findOne({
      query: {
        _id: createMutationDto.project,
      },
    });
    const author = await this.userMongoService.findOne({
      query: {
        _id: createMutationDto.author,
      },
    });
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
    return this.mutationMongoService.findOne({ query: { _id: id } });
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
}
