// heavily inspired by this doc https://docs.nestjs.com/recipes/prisma

import { default as prisma } from '@/instances/prisma';
import { Author, Prisma } from '@prisma/client';
import * as console from 'console';

class AuthorService {
  public async findAllAuthor(): Promise<Author[]> {
    return prisma.author.findMany();
  }

  public async findAuthorById(authorId: Prisma.AuthorWhereUniqueInput): Promise<Author> {
    return prisma.author.findUnique({ where: authorId });
  }

  public async createAuthor(authorData: Prisma.AuthorCreateInput): Promise<Author> {
    return prisma.author.create({ data: authorData });
  }

  public async updateAuthor(params: { where: Prisma.AuthorWhereUniqueInput; data: Prisma.AuthorUpdateInput }): Promise<Author> {
    try {
      const { data, where } = params;
      return await prisma.author.update({ data, where });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  public async deleteAuthor(authorId: Prisma.AuthorWhereUniqueInput): Promise<Author> {
    try {
      return await prisma.author.delete({ where: authorId });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  public async deleteAllAuthors() {
    if (process.env.NODE_ENV === 'test') await prisma.author.deleteMany({ where: { id: { gte: 0 } } });
  }
}

export default AuthorService;
