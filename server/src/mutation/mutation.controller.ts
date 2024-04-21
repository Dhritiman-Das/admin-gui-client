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
import { MutationService } from './mutation.service';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { UpdateMutationDto } from './dto/update-mutation.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CheckAbility } from 'src/casl/abilities.decorator';
import { Action } from 'src/casl/casl-ability.factory';
import { Mutation } from 'src/mongo/mutation-mongo/mutation-mongo.schema';
import { RequestWithUser } from 'types/request';

@UseGuards(AuthGuard)
@Controller('mutations')
export class MutationController {
  constructor(private readonly mutationService: MutationService) {}

  // @UseGuards(AuthGuard)
  @CheckAbility({
    action: Action.Create,
    subject: Mutation,
  })
  @Post()
  create(
    @Body() createMutationDto: CreateMutationDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    console.log({ uzer: userId });

    return this.mutationService.create(createMutationDto, userId);
  }

  @CheckAbility({
    action: Action.Read,
    subject: Mutation,
  })
  @Get()
  findAll() {
    return this.mutationService.findAll();
  }

  @CheckAbility({
    action: Action.Read,
    subject: Mutation,
  })
  @Get('project/:projectId')
  findAllForProject(@Param('projectId') projectId: string) {
    return this.mutationService.findAllForProject(projectId);
  }

  @CheckAbility({
    action: Action.Read,
    subject: Mutation,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mutationService.findOne(id);
  }

  @CheckAbility({
    action: Action.Update,
    subject: Mutation,
  })
  @Patch(':mutationId')
  update(
    @Param('mutationId') mutationId: string,
    @Body() updateMutationDto: UpdateMutationDto,
  ) {
    return this.mutationService.update(mutationId, updateMutationDto);
  }

  @CheckAbility({
    action: Action.Delete,
    subject: Mutation,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mutationService.remove(id);
  }

  @CheckAbility({
    action: Action.Read,
    subject: Mutation,
  })
  @Post(':mutationId/query')
  executeQuery(
    @Param('mutationId') mutationId: string,
    @Body() body: Record<string, any>,
  ) {
    return this.mutationService.executeQuery(body, mutationId);
  }

  @CheckAbility({
    action: Action.Read,
    subject: Mutation,
  })
  @Post(':mutationId/execute')
  executeMutation(
    @Req() req: RequestWithUser,
    @Param('mutationId') mutationId: string,
    @Body()
    body: { queryDto: Record<string, any>; mutationDto: Record<string, any> },
  ) {
    const { queryDto, mutationDto } = body;
    const userId = req.user.userId;
    return this.mutationService.executeMutation(
      queryDto,
      mutationDto,
      mutationId,
      userId,
    );
  }
}
