import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { paginate } from '../../shared/typeorm/paginate/paginate';
import { Pagination } from '../../shared/typeorm/paginate/pagination';
import { PaginateOptionsDto } from '../../shared/typeorm/paginate/paginate-options.dto';

@Injectable()
export class UserService {
    private readonly _logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
    ) {}

    async create(createUserDto: UserDto): Promise<User> {
        const userExists = await this.findOne(createUserDto.userId);

        if (userExists) {
            throw new ConflictException('User already exists.');
        }

        return this._userRepository.save({
            userId: createUserDto.userId,
            name: createUserDto.name,
        });
    }

    async edit(userDto: UserDto): Promise<UpdateResult> {
        return this._userRepository.update(
            { userId: userDto.userId },
            { name: userDto.name },
        );
    }

    async findAll(
        paginateOptions: PaginateOptionsDto,
    ): Promise<Pagination<User>> {
        return paginate<User>(this._userRepository.createQueryBuilder(), {
            page: paginateOptions.page,
            limit: paginateOptions.limit,
        });
    }

    async findOne(id: number): Promise<User> {
        return this._userRepository.findOne({ where: { userId: id } });
    }

    async remove(id: number): Promise<DeleteResult> {
        return this._userRepository.delete({ userId: id });
    }
}
