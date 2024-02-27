import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './casl-ability.factory';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbility = (...args: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, args);
