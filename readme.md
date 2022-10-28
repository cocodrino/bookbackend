# BOOK API ZAREGO

## Instalación
correr
```bash
pnpm install
pnpm run dev
```

si se usa `yarn/npm` se puede sustituir el comando `pnpm` pero deberá cambiarlo en los scripts de *package.json* adicionalmente

## Estructura Proyecto
El esquema de la DB se encuentra dentro de **prisma/schema.prisma** en caso de requerir hacer una migración ó regenerar db puede correrse

```
npx prisma migrate reset // para volver a crear las tablas en la db
o npx
prisma migrate dev //para actualizar la db local con los cambios en el archivo
```

no obstante para simplificar incluyo las db en sqlite

1) **src/controller/{book,author}.controller.ts** incluye los diferentes endpoints
2) **src/http/{books,authors}.http** contiene las llamadas a los diferentes endpoints,util para probar localmente
3) **src/services/{book,author}.service.ts** contiene las peticiones a la DB, usando Prisma
4) **src/tests/{author,book}.test.ts** contiene los tests unitarios
5) **src/instances/prisma.ts** crea el singleton para ser usado por prisma para las operaciones en la db
6) **src/utils** carpeta con utilidades varias

#### Sobre los test unitarios
Los tests unitarios utilizan la base de datos ubicada en **prisma/test.db** definida según la variable de entorno definida en los
archivos .env

#### DB Development
La base de datos local para pruebas está ubicada en **prisma/dev.db**

https://gitlab.com/clagccs/bookbackend

