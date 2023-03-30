<div align="center">
<h3 align="center">Nestjs Template</h3>
  <p align="center">
    This project is a boilerplate for Nestjs projects.
    <br />
    <a href="docs">
        <strong>Explore the docs</strong>
    </a> |
    <a href="https://lucid.app/">
        <strong>Explore lucid charts</strong>
    </a>

  </p>
</div>

# Build with

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Typeorm](https://typeorm.io/)
- [MySQL](https://www.mysql.com/)
- [RabbitMQ](https://www.rabbitmq.com/)

# Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node](https://nodejs.org/en/) (at least the latest LTS)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) (at least 1.0)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose) (if you want to use the
  docker-compose file)

Make sure you have the .env file in the root of the project.

- You can ask one from the fellow developers or create your own using the .env.example as a reference.

> Does not depend on any other services from SB to work.

### Starting Database

Start MYSQL and RabbitMQ services before running the server.
```bash
# from the project root
docker-compose -f docker/docker-compose.yml up -d database rabbitmq
```

### Dependencies

#### Node dependencies
```bash
# from the project root
yarn
```

#### Database Migration
```bash
# To run the migrations
make migrate

# To revert the migrations
make revert-migration

# To generate a new migration
make generate-migration name="migration-name"
```

### Running Tests
```yarn
# from the project root
yarn test
```

### Starting the server
```bash
# from the project root
yarn start:dev
```

