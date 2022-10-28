import wait from '../utils/wait';
import { AuthorController } from '../controllers/author.controller';
import App from '@/app';
import request from 'supertest';
import AuthorService from '../services/author.service';
import prisma from '../instances/prisma';
import BookService from '../services/book.service';
import { BookController } from '../controllers/book.controller';
import { Author } from '@prisma/client';

describe('Books Controller', () => {
  afterAll(async () => {
    await wait(500);
  });

  let author: AuthorService;
  let book: BookService;
  beforeAll(() => {
    author = new AuthorService();
    book = new BookService();
  });

  beforeEach(async () => {
    await author.deleteAllAuthors();
    await book.deleteAllBooks();
  });

  describe('[GET] /books', () => {
    it('must return a list of books', async () => {
      const auth1 = await author.createAuthor({
        firstname: 'George R',
        lastname: 'R Martins',
      });

      await book.createBookUsingAuthorId(
        {
          title: 'test',
          isbn: '1234567',
        },
        auth1.id,
      );

      await book.createBookUsingAuthorId(
        {
          title: 'another book',
          isbn: '847395',
        },
        auth1.id,
      );

      const app = new App([BookController]);

      const req = request(app.getServer()).get('/books');
      return req.expect(200).then(response => {
        expect(response.body.books.length).toEqual(2);
        expect(response.body.books[0].author.firstname).toEqual('George R');
      });
    });
  });

  describe('[GET] /book/:id', () => {
    it('must return book if exist in the db', async () => {
      const aut = await author.createAuthor({
        firstname: 'Lewis',
        lastname: 'Caroll',
      });

      const book1 = await book.createBookUsingAuthorId(
        {
          title: 'Alicia en el Pais de las Maravillas',
          isbn: '1234567',
        },
        aut.id,
      );

      const app = new App([BookController]);
      const req = request(app.getServer()).get(`/book/${book1.id}`);

      return req.expect(200).then(response => {
        expect(response.body.book.author.firstname).toBe('Lewis');
      });
    });

    it('if book not exist must return error', async () => {
      const app = new App([BookController]);
      const req = request(app.getServer()).get(`/book/3204559`);

      return req.expect(400);
    });
  });

  describe('[POST] /book', () => {
    it('must insert book if parameters are ok', async () => {
      const author1 = await author.createAuthor({
        firstname: 'Lewis',
        lastname: 'Caroll',
      });

      const book1 = {
        title: 'Alicia en el Pais de las Maravillas',
        isbn: '1072345',
        author: author1.id,
      };

      const app = new App([BookController]);
      const req = request(app.getServer()).post('/book').send(book1);

      return req.expect(201).then(response => {
        console.log(response.body);
        expect(response.body.book.title).toBe(book1.title);
      });
    });

    it('must handle error book if parameter is missing', async () => {
      const book1 = {
        title: 'Alicia en el Pais de las Maravillas',
        isbn: '1072345',
      };

      const app = new App([BookController]);
      const req = request(app.getServer()).post('/author').send(book1);

      return req.expect(404);
    });
  });

  describe('[PUT] /book/:id', () => {
    it('can edit an existing book', async () => {
      const data = {
        firstname: 'Franz',
        lastname: 'Kafka',
      };

      const aut1 = await author.createAuthor(data);

      const bookData = {
        title: 'Alicia en el Pais de las Maravillas',
        isbn: '1072345',
      };

      const book1 = await book.createBookUsingAuthorId(bookData, aut1.id);

      const isbn = '23423434';
      const app = new App([BookController]);
      const req = request(app.getServer()).put(`/book/${book1.id}`).send({ isbn });

      return req.expect(200).then(response => {
        expect(response.body.book.isbn).toBe(isbn);
      });
    });
  });

  describe('[DELETE] /book/:id', () => {
    it('can delete an existing book', async () => {
      const authorData = {
        firstname: 'Franz',
        lastname: 'Kafka',
      };

      const bookData = {
        title: 'Metamorfosis',
        isbn: '1072345aasd',
      };

      const aut1 = await author.createAuthor(authorData);
      const book1 = await book.createBookUsingAuthorId(bookData, aut1.id);

      const app = new App([BookController]);
      const req = request(app.getServer()).delete(`/book/${book1.id}`);

      return req.expect(200).then(response => {
        expect(response.body.book.isbn).toBe(bookData.isbn);
      });
    });

    it('if book id doesnt exist must fail deleting', async () => {
      const app = new App([BookController]);
      const req = request(app.getServer()).delete(`/book/92348`);

      return req.expect(400);
    });
  });
});
