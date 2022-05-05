# Phoenix

Just as a Phoenix rises from the ashes, so does the Sema Code Quality Platform.

This is the Phoenix monorepo, the single source of truth, containing all code for every project. It can be run locally with a single command...see below. For
any project that has a .env.template file, be sure to make a copy, rename it to .env and plug in the appropriate values for your local environment.

**Docker is the preferred method to run projects locally! This (should) avoid the _but it works on my machine_ problem.**

## Getting Started

```sh
# get the code
$ git clone https://github.com/Semalab/phoenix

# make sure you are in the project root
$ cd phoenix

# build all docker images for mongo, apollo and web
# rerun this if you change any docker image build config,
# such as package.json or node_modules
$ ./setup

# Run all docker servers
$ docker-compose up
# to verify that the web app is running:
# look for a "ready - started server on http://localhost:3000" message in console output

# Browse to http://localhost:3000 to test the webapp
```


## Code Style

We use Prettier and ESLint to ensure a consistent code style and basic
code quality standards in our codebase. It is recommended that you set
up your editor to run Prettier and ESLint automatically. Check out
[this guide](https://semalab.atlassian.net/l/c/mdsnY52F) if you need help.


## Deploying chrome extension

```sh
# make sure you are in the themis dir
$ cd phoenix/themis

# read help message from deploy script
$ ./deploy.sh -h 

# set all necessary variables and run script
$ ./deploy.sh -a [GOOGLE_APP_ID]
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
$ docker-compose run apollo npm install migrate
```

This updates the _image's_ `node_modules` as well as registers this change in the `package.json` and `package-lock.json` for committing. You should avoid running `npm install` directly, since it will install to the host's `node_modules` and override the `node_modules` on the container, thereby causing the container to have an outdated `node_modules`. See more [here](https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose).

### Common issues with running docker compose

1. Error starting  web-dev-i proxy: listen tcp 0.0.0.0:3000: bind: address already in use

   Solution: This error means that some container is already running so remove all the running containers `docker rm -f $(docker ps -aq)`

2. Newly installed node modules not getting reflected on running the conatiner

   Solution: In this case remove the image build previously after you install the new module, run `docker images` to get the docker image id for the application and then run `docker rmi -f <image-id>` to remove the image and run `docker-compose up` again.
   
3. After adding new npm modules, docker-compose up shows `Error: Cannot find module`

   Solution:
   
   a. delete all docker layers (this is system-wide for all docker projects on your machine)
   
   b. rebuild them from scratch
   
```sh
# remove all layers
sudo docker system prune

# if getting disk space errors
sudo docker volume prune

# rebuild
docker-compose build --no-cache
```
          
