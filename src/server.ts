import App from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { IndexController } from '@controllers/index.controller';
import { UsersController } from '@controllers/users.controller';
import validateEnv from '@utils/validateEnv';
import { AuthorController } from '@controllers/author.controller';

validateEnv();

const app = new App([AuthController, IndexController, UsersController, AuthorController]);
app.listen();
