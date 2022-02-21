import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  username: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(8)
  password: string;
}
