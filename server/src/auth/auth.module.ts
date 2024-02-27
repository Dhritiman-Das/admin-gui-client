import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ProjectMongoModule } from 'src/mongo/project-mongo/project-mongo.module';
import { QueryMongoModule } from 'src/mongo/query-mongo/query-mongo.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    UsersModule,
    ProjectMongoModule,
    QueryMongoModule,
    CaslModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
