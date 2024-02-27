Clonar el repositorio.
Crear una copia del .env.template y renombrarlo a .env y cambiar las variables de entorno.
Instalar dependencias yarn install
Levantar la base de datos docker compose up -d
Correr las migraciones de Primsa ```npx prisma migrate dev````
Ejecutar seed yarn run seed
Correr el proyecto yarn dev