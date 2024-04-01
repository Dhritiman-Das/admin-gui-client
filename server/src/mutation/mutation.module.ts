import { Module } from '@nestjs/common';
import { MutationService } from './mutation.service';
import { MutationController } from './mutation.controller';
import { MutationMongoModule } from 'src/mongo/mutation-mongo/mutation-mongo.module';
import { MutationMongoService } from 'src/mongo/mutation-mongo/mutation-mongo.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { ProjectMongoModule } from 'src/mongo/project-mongo/project-mongo.module';
import { UserMongoModule } from 'src/mongo/user-mongo/user-mongo.module';
import { CaslModule } from 'src/casl/casl.module';
import { QueryMongoModule } from 'src/mongo/query-mongo/query-mongo.module';

@Module({
  imports: [
    MutationMongoModule,
    ProjectMongoModule,
    QueryMongoModule,
    UserMongoModule,
    CaslModule,
  ],
  controllers: [MutationController],
  providers: [
    MutationService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class MutationModule {}
