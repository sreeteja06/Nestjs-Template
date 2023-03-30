import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UserDto {
    @IsPositive()
    userId: number;

    @IsNotEmpty()
    @IsString()
    name: string;
}
