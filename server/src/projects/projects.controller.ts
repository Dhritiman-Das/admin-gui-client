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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryService } from 'src/query/query.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateQueryDto } from 'src/query/dto/create-query.dto';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly queryService: QueryService,
  ) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    console.log({ user: req.user });
    const userEmail = req.user as string;
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Req() req) {
    console.log({ user: req.user });

    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne({ query: { _id: id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  //query
  @Post(':projectId/query')
  createQuery(
    @Param('projectId') projectId: string,
    @Body() createQueryDto: CreateQueryDto,
    @Req() req: any,
  ) {
    console.log({ createQueryDto });
    console.log({ user: req.user });

    const userId = req.user.userId as string;
    return this.queryService.create(createQueryDto, userId, projectId);
  }

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

  @Get('/:projectId/db-details')
  listDbDetails(@Param('projectId') projectId: string) {
    return this.projectsService.listDbDetails(projectId);
  }
}
