import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserMongoModule } from 'src/mongo/user-mongo/user-mongo.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectsService } from 'src/projects/projects.service';
import { WaitlistsMongoModule } from 'src/mongo/waitlists-mongo/waitlists-mongo.module';

@Module({
  imports: [UserMongoModule, ProjectsModule, WaitlistsMongoModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
