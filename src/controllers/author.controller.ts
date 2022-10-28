import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { validationMiddleware } from '@middlewares/validation.middleware';
import AuthorService from '@services/author.service';
import { CreateAuthorDto } from '@dtos/authors.dto';
import { HttpException } from '@exceptions/HttpException';

@Controller()
export class AuthorController {
  public author: AuthorService = new AuthorService();

  @Get('/authors')
  @OpenAPI({ summary: 'Return a list of authors' })
  async getAuthors() {
    const authors = await this.author.findAllAuthor();
    return { authors };
  }

  @Get('/author/:id')
  @OpenAPI({ summary: 'Return find author' })
  async getAuthorById(@Param('id') authorId: number) {
    const author = await this.author.findAuthorById({ id: authorId });

    if (!author) throw new HttpException(400, 'data not found for the symbol');

    return { author };
  }

  @Post('/author')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateAuthorDto, 'body'))
  @OpenAPI({ summary: 'Create a new author' })
  async createAuthor(@Body() authorData: CreateAuthorDto) {
    const author = await this.author.createAuthor({ ...authorData });

    if (!author) throw new HttpException(400, 'Error. Please check that author data is not repeated');

    return { author };
  }

  @Put('/author/:id')
  @UseBefore(validationMiddleware(CreateAuthorDto, 'body', true))
  @OpenAPI({ summary: 'Update an author' })
  async updateAuthor(@Param('id') userId: number, @Body() userData: Partial<CreateAuthorDto>) {
    const author = await this.author.updateAuthor({ where: { id: userId }, data: { ...userData } });

    if (!author) throw new HttpException(404, 'Error. Please check that author id is set correctly and author exists');

    return { author };
  }

  @Delete('/author/:id')
  @OpenAPI({ summary: 'Delete an author' })
  async deleteAuthor(@Param('id') authorId: number) {
    const author = await this.author.deleteAuthor({ id: authorId });

    if (!author) throw new HttpException(400, 'Error. Please check that author id is set correctly and author exists');

    return { author };
  }
}
