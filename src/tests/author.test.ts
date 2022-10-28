import wait from '../utils/wait';
import { AuthorController } from '../controllers/author.controller';
import App from '@/app';
import request from 'supertest';
import AuthorService from '../services/author.service';

describe('Authors Controller', () => {
  afterAll(async () => {
    await wait(500);
  });

  let author: AuthorService;
  beforeAll(() => {
    author = new AuthorService();
  });

  beforeEach(async () => {
    await author.deleteAllAuthors();
  });

  describe('[GET] /authors', () => {
    it('must return a list of authors', async () => {
      await author.createAuthor({
        firstname: 'George R',
        lastname: 'R Martins',
      });

      await author.createAuthor({
        firstname: 'David',
        lastname: 'Googins',
      });

      const app = new App([AuthorController]);

      const req = request(app.getServer()).get('/authors');
      return req.expect(200).then(response => {
        expect(response.body.authors.length).toEqual(2);
        expect(response.body.authors[0].firstname).toEqual('George R');
      });
    });
  });

  describe('[GET] /author/:id', () => {
    it('must return author if exist in the db', async () => {
      const aut = await author.createAuthor({
        firstname: 'Lewis',
        lastname: 'Caroll',
      });

      const app = new App([AuthorController]);
      const req = request(app.getServer()).get(`/author/${aut.id}`);

      return req.expect(200).then(response => {
        expect(response.body.author.firstname).toBe('Lewis');
      });
    });

    it('if user not exist must return error', async () => {
      const aut = await author.createAuthor({
        firstname: 'some',
        lastname: 'author',
      });

      const app = new App([AuthorController]);
      const req = request(app.getServer()).get(`/author/${aut.id + 1}`);

      return req.expect(400);
    });
  });

  describe('[POST] /author', () => {
    it('must insert user if parameters are ok', async () => {
      const author = {
        firstname: 'Miguel',
        lastname: 'Cervantes',
      };

      const app = new App([AuthorController]);
      const req = request(app.getServer()).post('/author').send(author);

      return req.expect(201).then(response => {
        expect(response.body.author.firstname).toBe(author.firstname);
      });
    });

    it('must fail insert if parameter is missing', async () => {
      const author = {
        lastname: 'Cervantes',
      };

      const app = new App([AuthorController]);
      const req = request(app.getServer()).post('/author').send(author);

      return req.expect(400);
    });

    it('must fail if name is to short (less 2 characters)', async () => {
      const author = {
        firstname: 'M',
        lastname: 'Cervantes',
      };

      const app = new App([AuthorController]);
      const req = request(app.getServer()).post('/author').send(author);

      return req.expect(400);
    });
  });

  describe('[PUT] /author/:id', () => {
    it('can edit an existing author', async () => {
      const data = {
        firstname: 'Franz',
        lastname: 'Kafka',
      };

      const change = 'Franzzzz';

      const aut = await author.createAuthor(data);

      const app = new App([AuthorController]);
      const req = request(app.getServer()).put(`/author/${aut.id}`).send({ firstname: change });

      return req.expect(200).then(response => {
        expect(response.body.author.firstname).toBe(change);
      });
    });

    it('if author id doesnt exist must fail', async () => {
      const data = {
        firstname: 'Franz',
        lastname: 'Kafka',
      };

      const aut = await author.createAuthor(data);

      const app = new App([AuthorController]);
      const req = request(app.getServer())
        .put(`/author/${aut.id + 1}`)
        .send({ firstname: '...' });

      return req.expect(404);
    });
  });

  describe('[DELETE] /author/:id', () => {
    it('can delete an existing author', async () => {
      const data = {
        firstname: 'Franz',
        lastname: 'Kafka',
      };

      const aut = await author.createAuthor(data);

      const app = new App([AuthorController]);
      const req = request(app.getServer()).delete(`/author/${aut.id}`);

      return req.expect(200).then(response => {
        expect(response.body.author.firstname).toBe(data.firstname);
      });
    });

    it('if author id doesnt exist must fail deleting', async () => {
      const data = {
        firstname: 'Franz',
        lastname: 'Kafka',
      };

      const aut = await author.createAuthor(data);

      const app = new App([AuthorController]);
      const req = request(app.getServer()).delete(`/author/${aut.id + 1}`);

      return req.expect(400);
    });
  });
});
