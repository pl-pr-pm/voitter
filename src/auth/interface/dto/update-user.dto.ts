import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  username: string;

  @IsString()
  @MaxLength(16)
  @MinLength(8)
  password: string;

  @IsString()
  imageUrl: string;
}
