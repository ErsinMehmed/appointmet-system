# Project Setup
1. git clone <repository-url>
2. cd symfony-react
3. yarn install or npm install
4. composer install

# Database Setup
To set up the database, run the following command:
1. php bin/console doctrine:database:create
2. php bin/console doctrine:migrations:migrate
3. php bin/console doctrine:fixtures:load

# Build for development
1. npm run dev
2. npm run watch