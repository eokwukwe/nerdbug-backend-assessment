# nerdbug-backend-assessment

## Technologies
- [Jest](https://jestjs.io/)
- [MySQL](https://www.mysql.com/)
- [Express.js](https://expressjs.com/)
- [Node.js >=18.x](https://nodejs.org/en/)
- [Typescript >=5.x](https://www.typescriptlang.org/)
- [Sequelize ORM >=6.x](https://sequelize.org/)

## Steps to run the code

### Step 1: Clone the project

```bash
git clone https://github.com/eokwukwe/nerdbug-backend-assessment.git
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Environment Variables

Copy the `.env.example` file to `.env` and set the environment variables.

### Step 4: Create database

```bash
npm run db:create
```

### Step 5: Run migrations

```bash
npm run db:migrate
```

### Step 6: Run seeder

```bash
npm run db:seed
```

### Step 7: Start the application

```bash
npm run dev
```

### Step 8: To run the tests

```bash
npm run test
```
