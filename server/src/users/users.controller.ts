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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('/exist')
  @HttpCode(HttpStatus.OK)
  async checkIfUserExist(@Body() checkIfUserExistDto: { email: string }) {
    const user = await this.usersService.checkIfUserExist(
      checkIfUserExistDto.email,
    );

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
    console.log(user.projects);

    // Decrypt the dbConnectionString for each project
    for (const userProject of user.projects) {
      console.log({ userProject });

      userProject.project.dbConnectionString = await decryptData(
        userProject.project.dbConnectionString,
      );
    }

    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
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
