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
import { QueryService } from './query.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createQueryDto: CreateQueryDto, @Req() req: any) {
    return 'Created';
  }

  @Get()
  findAll() {
    return this.queryService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.queryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateQueryDto: UpdateQueryDto) {
  //   return this.queryService.update(+id, updateQueryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.queryService.remove(+id);
  // }
}
