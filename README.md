# Northcoders News API

## 1. Project Summary

**Northcoders News API (NC News)** is a backend server designed to provide a programmatic interface for accessing application data, akin to a real-world backend service like Reddit. This API enables developers to interact with data related to articles, topics, comments, and users through structured endpoints. These endpoints provide a way for frontend applications to retrieve and manipulate data efficiently.

## Link to the Hosted Version

You can access the live version of the API [here](https://kaleemashraf21.github.io/nc-newsAPI).

## Features Implemented

For the time being, the following features are implemented:

- **Retrieve** articles, topics, comments, and user information
- **Add** a new comment to an article
- **Update** article details
- **Delete** comments

## 2. File Setup Instructions

### 2.1 Cloning the Repository

To start, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/kaleemashraf21/nc-newsAPI.git
```

### 2.2 Creating .env Files

Create two environment files in the root of the project folder:

.env.development

```bash
PGDATABASE=nc_news
```

.env.test

```bash
PGDATABASE=nc_news_test
```

These files will allow you to connect to the appropriate database depending on whether you're running the development or test scripts.

### 2.3 Setting Up the Database

Once you have created the .env files, set up the development and test databases by running:

```bash
npm run setup-dbs
```

### 3. Installing Dependencies

All required dependencies are listed in the package.json file. To install them, simply run:

```bash
npm install
```

### 4. Minimum Required Versions of Node.js and Postgres

Ensure the following minimum versions are installed on your system:

- Node.js: v22.9.0 or higher
- PostgreSQL: 16.4 or higher

To check your installed versions, run:

```bash
node -v
psql -V
```

### 5. Seeding the Local Database

To seed the database with development data, run:

```bash
npm run seed
```

This will populate the database with initial data. You can verify the database content through psql by running:

```bash
\c nc_news
```

If running tests, the app.test.js file within the **tests** folder will automatically seed the test database. Access the test database with:

```bash
\c nc_news_test
```

### 6. Running Tests

The project includes a test suite to verify the functionality and performance of the endpoints. To view the test code, check the app.test.js file located in the **tests** folder. To run the test suite, execute:

```bash
npm test
```

This command will run all tests defined in the app.test.js file

This portfolio project was created as part of a Full Stack Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com).
