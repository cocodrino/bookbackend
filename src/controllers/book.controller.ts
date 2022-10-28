import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { validationMiddleware } from '@middlewares/validation.middleware';
import BookService from '@services/book.service';
import { CreateBookDto } from '@dtos/books.dto';
import { HttpException } from '@exceptions/HttpException';

@Controller()
export class BookController {
  public book: BookService = new BookService();

  @Get('/books')
  @OpenAPI({ summary: 'Return a list of books' })
  async getBooks() {
    const books = await this.book.findAllBooks();
    return { books };
  }

  @Get('/book/:id')
  @OpenAPI({ summary: 'Return find book' })
  async getBookById(@Param('id') bookId: number) {
    const book = await this.book.findBookById({ id: bookId });

    if (!book) throw new HttpException(400, 'data not found for the symbol');

    return { book };
  }

  @Post('/book')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateBookDto, 'body'))
  @OpenAPI({ summary: 'Create a new bookr' })
  async createBook(@Body() bookData: CreateBookDto) {
    const book = await this.book.createBook({ ...bookData });

    if (!book) throw new HttpException(404, 'Error. Please check that book id is set correctly and book exists');

    return { book };
  }

  @Put('/book/:id')
  @UseBefore(validationMiddleware(CreateBookDto, 'body', true))
  @OpenAPI({ summary: 'Update an book' })
  async updateBook(@Param('id') userId: number, @Body() userData: Partial<CreateBookDto>) {
    const book = await this.book.updateBook({ where: { id: userId }, data: { ...userData } });

    if (!book) throw new HttpException(404, 'Error. Please check that book id is set correctly and book exists');

    return { book };
  }

  @Delete('/book/:id')
  @OpenAPI({ summary: 'Delete an book' })
  async deleteBook(@Param('id') bookId: number) {
    const book = await this.book.deleteBook({ id: bookId });

    if (!book) throw new HttpException(400, 'Error. Please check that book id is set correctly and book exists');

    return { book };
  }
}
