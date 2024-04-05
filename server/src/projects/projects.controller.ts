import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryService } from 'src/query/query.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateQueryDto } from 'src/query/dto/create-query.dto';
import { AddMembersDto } from './dto/add-members.dto';
import { Action } from 'src/casl/casl-ability.factory';
import { CheckAbility } from 'src/casl/abilities.decorator';
import { Project } from 'src/mongo/project-mongo/project-mongo.schema';
import { Query } from 'src/mongo/query-mongo/query-mongo.schema';
import { Member } from './entities/project.entity';
import { Request } from 'express';
import { RequestWithUser } from 'types/request';
import { Mutation } from 'src/mongo/mutation-mongo/mutation-mongo.schema';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly queryService: QueryService,
  ) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
  ) {
    const admin = req.user.userId;
    console.log({ admin });
    return this.projectsService.create({ ...createProjectDto, admin });
  }

  @CheckAbility({
    action: Action.Read,
    subject: Project,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne({ query: { _id: id } });
    console.log({ project });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  @CheckAbility({
    action: Action.Update,
    subject: Project,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @CheckAbility({
    action: Action.Update,
    subject: Project,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  //query
  @CheckAbility({
    action: Action.Create,
    subject: Query,
  })
  @Post(':projectId/query')
  createQuery(
    @Param('projectId') projectId: string,
    @Body() createQueryDto: CreateQueryDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId as string;

    return this.queryService.create(createQueryDto, userId, projectId);
  }

  @CheckAbility({
    action: Action.Update,
    subject: Query,
  })
  @Patch(':projectId/query/:queryId')
  updateQuery(
    @Param('projectId') projectId: string,
    @Param('queryId') queryId: string,
    @Body() updateQueryDto: any,
  ) {
    return this.queryService.update(queryId, updateQueryDto);
  }

  @CheckAbility({
    action: Action.Read,
    subject: Project,
  })
  @Post('/:projectId/query/:queryId/execute')
  executeQuery(
    @Body() executeQueryDto: any,
    @Param('projectId') projectId: string,
    @Param('queryId') queryId: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId as string;
    return this.projectsService.executeQuery({
      executeQueryDto,
      queryId,
      projectId,
      userId,
    });
  }

  @CheckAbility({
    action: Action.Read,
    subject: Query,
  })
  @Get('/:projectId/query')
  listQueries(@Param('projectId') projectId: string) {
    return this.projectsService.listQueries({ projectId });
  }

  @CheckAbility({
    action: Action.Read,
    subject: Query,
  })
  @Get('/:projectId/query/:queryId')
  getQuery(
    @Param('projectId') projectId: string,
    @Param('queryId') queryId: string,
  ) {
    return this.projectsService.listQuery({ projectId, queryId });
  }

  @CheckAbility({
    action: Action.Update,
    subject: Query,
  })
  @Delete('/:projectId/query/:queryId')
  deleteQuery(
    @Param('projectId') projectId: string,
    @Param('queryId') queryId: string,
  ) {
    return this.projectsService.deleteQuery({ projectId, queryId });
  }

  @CheckAbility({
    action: Action.Read,
    subject: Mutation,
  })
  @Get('/:projectId/mutations')
  listMutations(@Param('projectId') projectId: string) {
    return this.projectsService.listMutations({ projectId });
  }

  @CheckAbility({
    action: Action.Create,
    subject: Query,
  })
  @Get('/:projectId/db-details')
  listDbDetails(@Param('projectId') projectId: string) {
    return this.projectsService.listDbDetails(projectId);
  }
  //members
  @CheckAbility({
    action: Action.Read,
    subject: Member,
  })
  @Get('/:projectId/members')
  listMembers(@Param('projectId') projectId: string) {
    return this.projectsService.listMembers(projectId);
  }

  @CheckAbility({
    action: Action.Read,
    subject: Member,
  })
  @Get('/:projectId/members/invited')
  listInvitedMembers(@Param('projectId') projectId: string) {
    return this.projectsService.listInvitedMembers(projectId);
  }

  @CheckAbility({
    action: Action.Update,
    subject: Member,
  })
  @Post('/:projectId/members')
  addMembers(
    @Param('projectId') projectId: string,
    @Body() addMembersDto: AddMembersDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    const userEmail = req.user.email;
    const userName = req.user.name;
    console.log({ user: req.user, ip: req.ip });

    const ip = req.ip;
    return this.projectsService.addMembers({
      projectId,
      addMembersDto,
      invitorEmail: userEmail,
      invitorName: userName,
      ip,
    });
  }

  @CheckAbility({
    action: Action.Update,
    subject: Member,
  })
  @Patch('/:projectId/members/:userId')
  updateMember(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() updateMemberDto: any,
  ) {
    return this.projectsService.updateMember({
      projectId,
      userId,
      updateMemberDto,
    });
  }

  @CheckAbility({
    action: Action.Update,
    subject: Member,
  })
  @Delete('/:projectId/members/:userId')
  removeMember(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectsService.removeMember({ projectId, userId });
  }
}
