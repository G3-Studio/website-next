## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/)

### Installing

1. Clone the repo
```sh
git clone
```
2. Install NPM packages
```sh
npm install
```

### Database

1. Create a database in PostgreSQL
2. Use prisma to generate the database schema
```sh
npx prisma generate
```
3. Migrate the database
```sh
npx prisma migrate dev
```

### Running the app

1. Start the server
```sh
npm run dev
```
2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
