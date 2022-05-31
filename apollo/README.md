# API

Sema web application back-end

### Getting Started

```sh
# install dependencies
$ npm install
# start server
$ npm start
# project will be available on http://localhost:3001
# files will automatically rebuild and refresh the browser as you make changes
# in a separate terminal, run db migrations
$ npm run migrate
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

### Deploying to QA

```sh
# make sure you have the phoenix AWS profile configured (will need AWS Access Key ID and Secret):
$ aws configure --profile phoenix
# run your build and deploy script
# defaults to qa
$ bash ./build-and-deploy.sh
```

### Pushing to production

1. update `build-and-deploy.sh`'s environment variables:
   - ENV=prod
   - NODE_ENV = production
2. run your build and deploy script:
   ```sh
   $ bash ./build-and-deploy.sh
   ```
   > NOTE: If you've configured your docker to run without elevated privileges (as in you can just run `docker` without `sudo docker`), you'll need to replace the scripts usage of `sudo docker` to just `docker`.
