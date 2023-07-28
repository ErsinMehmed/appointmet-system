# Appointment System

Appointment System: a versatile system for efficiently managing appointments and relevant information

## Getting Started

> 1. Clone the repository to your local machine using `git clone https://github.com/ErsinMehmed/appointmet-system.git`
> 2. Navigate to the project directory using `cd appointmet-system`
> 3. `yarn install` or `npm install`
> 4. `composer install`

## Database Setup

To set up the database, run the following command:

> 1. Create the database: `php bin/console doctrine:database:create`
> 2. Run the database migrations to create the necessary tables: `php bin/console doctrine:migrations:migrate`
> 3. Load initial data into the database: `php bin/console doctrine:fixtures:load`

## Build for development

To build the Appointment System for development, execute the following commands:

> 1. Build the frontend assets: `npm run dev`
> 2. Alternatively, you can use the watch mode to automatically rebuild when changes are detected: `npm run watch`

## Libraries

The following libraries and tools have been used in this project:

- [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [SweetAlert2](https://github.com/sweetalert2/sweetalert2)
- [Axios](https://axios-http.com/docs/intro)
- [MobX](https://mobx.js.org/README.html)
- [React](https://react.dev/learn)
- [Symfony](https://symfony.com/doc/current/index.html)

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) License.
