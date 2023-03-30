import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from '../../shared/typeorm/paginate/pagination';
import { ApiPaginatedSwagger } from '../../decorators/api-paginated-swagger.decorator';
import { PaginateOptionsDto } from '../../shared/typeorm/paginate/paginate-options.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Auth(Scope.ADMIN)
    @Post()
    async create(@Body() createUserDto: UserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    // @Auth(Scope.ADMIN)
    @Put()
    async edit(@Body() data: UserDto): Promise<unknown> {
        return this.userService.edit(data);
    }

    // @Auth(Scope.ADMIN)
    @Get()
    @ApiPaginatedSwagger(User)
    async findAll(
        @Query() paginateOptions: PaginateOptionsDto,
    ): Promise<Pagination<User>> {
        return this.userService.findAll(paginateOptions);
    }

    // @Auth(Scope.ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    // @Auth(Scope.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<unknown> {
        return this.userService.remove(id);
    }
}
