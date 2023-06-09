# Architecture

- [Architecture](#architecture)
  - [`.vscode`](#vscode)
  - [`docs`](#docs)
  - [`src`](#src)
    - [`common`](#common)
    - [`decorators`](#decorators)
    - [`interceptors`](#interceptors)
    - [`filters`](#filters)
    - [`guards`](#guards)
    - [`interfaces`](#interfaces)
    - [`migrations`](#migrations)
    - [`providers`](#providers)
    - [`shared`](#shared)
    - [`modules`](#modules)
    - [`app.module.ts`](#appmodulets)
  - [`.*.env`](#env)
  - [`.eslintrc`](#eslintrcjs)

## `.vscode`

Settings and extensions specific to this project, for Visual Studio Code.

## `docs`

You found me! :wink:


## `src`

Where we keep all our source files.

### `common`

Where we keep common typescript files, e.g. constants and DTOs.

### `decorators`

This folder contains all global [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

### `interceptors`

Where we are keep [interceptors](https://docs.nestjs.com/interceptors)

### `filters`

In this folder you can find app level [exception-filters](https://docs.nestjs.com/exception-filters).

### `guards`

You can store all guards here

### `interfaces`

This folder contains typescript [interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

### `migrations`

Folder to store application migrations which will be generated by typeorm.

### `providers`

These are utility functions you may want to share between many files in your application. They will always be pure and never have side effects, meaning if you provide a function the same arguments, it will always return the same result.

### `shared`

Shared module with global singleton services.

### `modules`

Where all our NestJS modules lives. See [NestJS modules documentation](https://docs.nestjs.com/modules) for more.

### `app.module.ts`

The root application module which makes use of all the other modules.

## `.env`

Environment variables which will load before app start and will be stored in `process.env`

## `.eslintrc.js`

Eslint configuration file, See [the eslint doc](https://eslint.org/) for more.
