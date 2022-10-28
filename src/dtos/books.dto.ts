import { MinLength, IsString } from 'class-validator';
import { CreateAuthorDto } from '@dtos/authors.dto';

export class CreateBookDto {
  @IsString()
  @MinLength(2)
  public title: string;

  @IsString()
  @MinLength(5)
  public isbn: string;

  author: CreateAuthorDto;
}
