import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { Project } from 'src/mongo/project-mongo/project-mongo.schema';
import { decryptData } from 'lib/helpers';
import { RequestWithUser } from 'types/request';
import { CheckAbility } from 'src/casl/abilities.decorator';
import { Action } from 'src/casl/casl-ability.factory';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      console.log({ createUserDto });

      return this.usersService.create(createUserDto);
    } catch (error) {
      console.log({ error });
    }
  }

  @Public()
  @Post('/exist')
  @HttpCode(HttpStatus.OK)
  async checkIfUserExist(@Body() checkIfUserExistDto: { email: string }) {
    console.log({ checkIfUserExistDto });

    const user = await this.usersService.checkIfUserExist(
      checkIfUserExistDto.email,
    );
    console.log({ user });

    if (user) {
      return { userExist: true, _id: user._id };
    }
    return { userExist: false };
  }

  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user.userId;
    const user = await this.usersService.findOne({
      query: { _id: userId },
      populate: {
        path: 'projects',
        populate: {
          path: 'project',
          select: 'name mode dbConnectionString',
          model: 'Project',
        },
      },
    });
    console.log({ user });
    if (!user?.projects) return user;
    // Decrypt the dbConnectionString for each project
    for (const userProject of user?.projects) {
      console.log({ userProject });

      userProject.project.dbConnectionString = await decryptData(
        userProject.project.dbConnectionString,
      );
    }

    const { invitedProjects, ...userWithoutInvitedProjects } = user.toObject();

    return {
      ...userWithoutInvitedProjects,
      invitedProjectsLength: user.invitedProjects?.length || 0,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('projects/invites')
  async getInvitedProjects(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.usersService.getInvitedProjects(userId);
  }

  @Patch('projects/invites/:projectId')
  @CheckAbility({
    action: Action.Update,
    subject: Project,
    allowPersonNotInProject: true,
  })
  async handleProjectInvite(
    @Body() body: { accept: boolean },
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
  ) {
    const userId = req.user.userId;
    const accept = body.accept;
    return this.usersService.handleProjectInvite(userId, projectId, accept);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ query: { _id: id } });
  }

  @Patch('')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.userId;
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
