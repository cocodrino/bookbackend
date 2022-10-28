import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { AuthorController } from '@controllers/author.controller';
import { BookController } from '@controllers/book.controller';

validateEnv();

const app = new App([IndexController, AuthorController, BookController]);
app.listen();
