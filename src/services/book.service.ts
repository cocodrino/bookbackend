// heavily inspired by this doc https://docs.nestjs.com/recipes/prisma

import { default as prisma } from '@/instances/prisma';
import { Prisma, Book } from '@prisma/client';
import * as console from 'console';
import { CreateAuthorDto } from '@dtos/authors.dto';
import { CreateBookDto } from '@dtos/books.dto';

class BookService {
  public async findAllBooks(): Promise<Book[]> {
    return prisma.book.findMany({ include: { author: { select: { firstname: true, lastname: true } } } });
  }

  public async findBookById(bookId: Prisma.BookWhereUniqueInput): Promise<Book> {
    return prisma.book.findUnique({ where: bookId, include: { author: true } });
  }

  public async createBookUsingAuthorDetails(bookData: Omit<CreateBookDto, 'author'>, author: CreateAuthorDto): Promise<Book> {
    try {
      return await prisma.book.create({
        data: {
          ...bookData,
          author: { connectOrCreate: { where: { firstname_lastname: author }, create: author } },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  public async createBookUsingAuthorId(bookData: Omit<CreateBookDto, 'author'>, author: number): Promise<Book> {
    try {
      return await prisma.book.create({ data: { ...bookData, authorId: author } });
    } catch (e) {
      console.error(e);
    }
  }

  public async updateBook(params: { where: Prisma.BookWhereUniqueInput; data: Prisma.BookUpdateInput }): Promise<Book> {
    try {
      const { data, where } = params;
      return await prisma.book.update({ data, where });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  public async deleteBook(bookId: Prisma.BookWhereUniqueInput): Promise<Book> {
    try {
      return await prisma.book.delete({ where: bookId });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  public async deleteAllBooks() {
    if (process.env.NODE_ENV === 'test') await prisma.book.deleteMany({ where: { id: { gte: 0 } } });
  }
}

export default BookService;
