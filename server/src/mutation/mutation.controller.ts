import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MutationService } from './mutation.service';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { UpdateMutationDto } from './dto/update-mutation.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CheckAbility } from 'src/casl/abilities.decorator';
import { Action } from 'src/casl/casl-ability.factory';
import { Mutation } from 'src/mongo/mutation-mongo/mutation-mongo.schema';

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
  create(@Body() createMutationDto: CreateMutationDto) {
    return this.mutationService.create(createMutationDto);
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
}
