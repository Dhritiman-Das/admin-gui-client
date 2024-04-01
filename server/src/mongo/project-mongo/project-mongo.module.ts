import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project-mongo.schema';
import { ProjectMongoService } from './project-mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
  ],
  providers: [ProjectMongoService],
  exports: [
    ProjectMongoService,
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
    ProjectMongoService,
  ],
})
export class ProjectMongoModule {}
