import { MinLength, IsString, IsNotEmpty } from 'class-validator';
import { CreateAuthorDto } from '@dtos/authors.dto';

export class CreateBookDto {
  @IsString()
  @MinLength(2)
  public title: string;

  @IsString()
  @MinLength(5)
  public isbn: string;

  //TODO check why using AuthorDto is not working
  @IsNotEmpty()
  public author: { firstname: string; lastname: string } | number;
}
