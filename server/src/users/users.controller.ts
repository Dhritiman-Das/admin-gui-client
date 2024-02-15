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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log({ createUserDto });

    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('/exist')
  @HttpCode(HttpStatus.OK)
  async checkIfUserExist(@Body() checkIfUserExistDto: { email: string }) {
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
  getMe(@Req() req: any) {
    const userId = req.user.userId;
    console.log({ userId });

    return this.usersService.findOne({
      query: { _id: userId },
    });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ query: { _id: id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
