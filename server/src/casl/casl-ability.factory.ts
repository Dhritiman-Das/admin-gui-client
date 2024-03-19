import {
  InferSubjects,
  AbilityBuilder,
  AbilityClass,
  MongoAbility,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { FlattenMaps, ObjectId, Types } from 'mongoose';
import { Project } from 'src/mongo/project-mongo/project-mongo.schema';
import { Query } from 'src/mongo/query-mongo/query-mongo.schema';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';
import { Member } from 'src/projects/entities/project.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof User | typeof Project | typeof Query | typeof Member>
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

type Permissions = 'read-only' | 'read-write' | 'admin';

const permissionMap: {
  [key in Permissions]: Action[];
} = {
  'read-only': [Action.Read],
  'read-write': [Action.Read, Action.Create, Action.Update],
  admin: [Action.Manage],
};

const resourceMap = {
  projects: Project,
  query: Query,
  members: Member,
};

@Injectable()
export class CaslAbilityFactory {
  createForUser(
    user: User,
    projectId: Types.ObjectId,
    isOwner: boolean,
    allowPersonNotInProject: boolean = false,
  ) {
    console.log({ hellohello: allowPersonNotInProject });

    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    let hasMatchingProject = false;

    if (isOwner) {
      can(Action.Manage, 'all');
    }

    user?.projects.forEach((permission) => {
      if (permission.project.toString() === projectId.toString()) {
        hasMatchingProject = true;
        const advSettings = permission.advancedSettings.toObject();

        Object.entries(advSettings).forEach(([resource, access]) => {
          permissionMap[access]?.forEach((action) => {
            const resourceObj = resourceMap[resource] || null;
            can(action, resourceObj);
            console.log({
              status: 'can',
              action,
              resource,
              resourceObj,
            });
          });
        });
      }
    });

    if (!!!hasMatchingProject && !!!allowPersonNotInProject) {
      throw new UnauthorizedException('User not authorized for this project');
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
