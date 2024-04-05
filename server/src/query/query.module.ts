import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { QueryMongoModule } from 'src/mongo/query-mongo/query-mongo.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserMongoModule } from 'src/mongo/user-mongo/user-mongo.module';
import { ProjectMongoModule } from 'src/mongo/project-mongo/project-mongo.module';
import { HistoryModule } from 'src/history/history.module';
import { CaslModule } from 'src/casl/casl.module';
import { MutationMongoModule } from 'src/mongo/mutation-mongo/mutation-mongo.module';

@Module({
  imports: [
    QueryMongoModule,
    UserMongoModule,
    ProjectMongoModule,
    MutationMongoModule,
    HistoryModule,
    CaslModule,
  ],
  controllers: [QueryController],
  providers: [
    QueryService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [QueryService],
})
export class QueryModule {}
