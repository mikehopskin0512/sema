# Phoenix

Just as a Phoenix rises from the ashes, so does the Sema Code Quality Platform.

This is the Phoenix monorepo, the single source of truth, containing all code for every project. It can be run locally with a single command...see below. For
any project that has a .env.template file, be sure to make a copy, rename it to .env and plug in the appropriate values for your local environment.

**Docker is the preferred method to run projects locally! This (should) avoid the _but it works on my machine_ problem.**

## Getting Started

```sh
# get the code
$ git clone git@github.com:Semalab/phoenix.git

# make sure you are in the project root
$ cd phoenix

# build all docker images for mongo, apollo and web
# rerun this if you change any docker image build config, such as package.json or node_modules
$ sudo docker-compose build --no-cache

# Run all docker servers
$ sudo docker-compose up
# to verify that the web app is running:
# look for a "ready - started server on http://localhost:3000" message in console output

# Browse to http://localhost:3000 to test the webapp
```

## Development approach

Branch off, and pull request against `qa`

### Running a single service

```sh
docker-compose up [SERVICE...] # SERVICE specified in docker-compose.yml, e.g. apollo
```

### Running Migrations

By default, migrations will only run locally, but you could update `MONGOOSE_URI` in `apollo/.env` to run migrations on staging/production.

```sh
docker-compose up apollo-migrations
```

### Development best practices

In order to follow [best practices](https://12factor.net/) to maintain local environment parity with deployment environments, you should interact with services through `docker-compose` whenever possible.

For example, if you wanted to add a new package `migrate` to `apollo`, you would run:

```sh
docker-compose run apollo npm install migrate
```

This updates the _image's_ `node_modules` as well as registers this change in the `package.json` and `package-lock.json` for committing. You should avoid running `npm install` directly, since it will install to the host's `node_modules` and override the `node_modules` on the container, thereby causing the container to have an outdated `node_modules`. See more [here](https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose).
