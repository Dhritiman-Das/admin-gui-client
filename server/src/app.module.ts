import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UserMongoService } from './mongo/user-mongo/user-mongo.service';
import { ProjectMongoService } from './mongo/project-mongo/project-mongo.service';
import { UserMongoModule } from './mongo/user-mongo/user-mongo.module';
import { ProjectMongoModule } from './mongo/project-mongo/project-mongo.module';
import { ProjectsModule } from './projects/projects.module';
import { QueryMongoModule } from './mongo/query-mongo/query-mongo.module';
import { QueryModule } from './query/query.module';
import { ExecutionModule } from './execution/execution.module';
import { AuthModule } from './auth/auth.module';
import { HistoryMongoModule } from './mongo/history-mongo/history-mongo.module';
import { HistoryModule } from './history/history.module';
import { CaslModule } from './casl/casl.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { RateLimitingMiddleware } from './middleware/rate-limiting.middleware';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsMongoService } from './mongo/notifications-mongo/notifications-mongo.service';
import { NotificationsMongoModule } from './mongo/notifications-mongo/notifications-mongo.module';
import { WaitlistsMongoModule } from './mongo/waitlists-mongo/waitlists-mongo.module';
import { MutationModule } from './mutation/mutation.module';
import { MutationMongoService } from './mongo/mutation-mongo/mutation-mongo.service';
import { MutationMongoModule } from './mongo/mutation-mongo/mutation-mongo.module';
import { ExtractProjectMiddleware } from 'middlewares/extract-project.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      defaults: {
        from: `"Dhritiman @ EasyDB" <${process.env.EMAIL_FROM}>`,
      },
    }),
    UsersModule,
    UserMongoModule,
    ProjectMongoModule,
    ProjectsModule,
    QueryMongoModule,
    QueryModule,
    ExecutionModule,
    AuthModule,
    HistoryMongoModule,
    HistoryModule,
    CaslModule,
    NotificationsModule,
    NotificationsMongoModule,
    WaitlistsMongoModule,
    MutationModule,
    MutationMongoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserMongoService,
    ProjectMongoService,
    NotificationsMongoService,
    MutationMongoService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        LoggingMiddleware,
        RateLimitingMiddleware,
        ExtractProjectMiddleware,
      )
      .forRoutes('*');
  }
}
