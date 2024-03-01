import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectMongoModule } from 'src/mongo/project-mongo/project-mongo.module';
import { QueryModule } from 'src/query/query.module';
import { QueryMongoModule } from 'src/mongo/query-mongo/query-mongo.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserMongoModule } from 'src/mongo/user-mongo/user-mongo.module';
import { CaslModule } from 'src/casl/casl.module';
import { WaitlistsMongoModule } from 'src/mongo/waitlists-mongo/waitlists-mongo.module';

@Module({
  imports: [
    ProjectMongoModule,
    QueryModule,
    QueryMongoModule,
    UserMongoModule,
    CaslModule,
    WaitlistsMongoModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
