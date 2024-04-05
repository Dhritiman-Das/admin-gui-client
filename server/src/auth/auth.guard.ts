import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserMongoService } from 'src/mongo/user-mongo/user-mongo.service';
import { ProjectMongoService } from 'src/mongo/project-mongo/project-mongo.service';
import { QueryMongoService } from 'src/mongo/query-mongo/query-mongo.service';
import { CHECK_ABILITY, RequiredRule } from 'src/casl/abilities.decorator';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
import { MutationMongoService } from 'src/mongo/mutation-mongo/mutation-mongo.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly userMongoService: UserMongoService,
    private readonly projectMongoService: ProjectMongoService,
    private readonly queryMongoService: QueryMongoService,
    private readonly mutationMongoService: MutationMongoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    console.log({ rules });

    try {
      console.log('Bout to go in');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      const userId = payload.userId;
      const user = await this.userMongoService.findOne({
        query: { _id: userId },
      });
      request['user'] = { ...user.toObject(), userId: user?._id };
      console.log('authgrd', request['user']);

      let projectId = request.params.projectId;
      const queryId = request.params.queryId;
      const mutationId = request.params.mutationId;
      console.log({ mutationId });
      let isOwner = false;
      let allowPersonNotInProject = false;

      if (queryId) {
        const query = await this.queryMongoService.findOne({
          query: { _id: queryId },
        });
        projectId = query.project;
        isOwner = query.author.toString() === userId;
      } else if (mutationId) {
        const mutation = await this.mutationMongoService.findOne({
          query: { _id: mutationId },
        });
        projectId = mutation.project;
        isOwner = mutation.author.toString() === userId;
      }
      for (const rule of rules) {
        if (rule.allowPersonNotInProject) {
          allowPersonNotInProject = true;
          break;
        }
      }

      if (!!!projectId || !!allowPersonNotInProject) {
        return true;
      }

      const ability = this.caslAbilityFactory.createForUser(
        user,
        projectId,
        isOwner,
      );
      try {
        rules.forEach((rule) =>
          ForbiddenError.from(ability).throwUnlessCan(
            rule.action,
            rule.subject,
          ),
        );
        return true;
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new UnauthorizedException(
            'User is not authorized to access this resource',
          );
        }
      }
    } catch (error) {
      console.error('Auth guard error:', error);

      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
