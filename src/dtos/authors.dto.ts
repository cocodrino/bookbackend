import { MinLength, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2)
  public firstname: string;

  @IsString()
  @MinLength(2)
  public lastname: string;
}
