# API

Sema web application back-end

### Getting Started

```sh
# install dependencies
$ npm install
$ npm install -g migrate
# start server
$ npm start
# project will be available on http://localhost:3001
# files will automatically rebuild and refresh the browser as you make changes
# in a separate terminal, run db migrations
$ migrate down
$ migrate up
```

### Directory Layout

```
.
├── /logs/                      # Server logs
├── /migrations/                # Database migration scripts
├── /src/                       # The source code of the application
│   ├── /shared/                # Common resources used in each route
│   ├── /<dir>/                 # API route (i.e. /auth/ === /v1/auth/)
├── .env.template               # ENV vars for local development
│── build-and-deploy.sh         # run to create a new build (defaults to qa)
└── package.json                # The list of 3rd party libraries and utilities
```
