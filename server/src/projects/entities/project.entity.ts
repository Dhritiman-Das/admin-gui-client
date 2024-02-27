import { AdvancedSettings, User } from 'src/mongo/user-mongo/user-mongo.schema';

export class Project {}

export class Member {
  user: User;
  permissions: AdvancedSettings;
}
