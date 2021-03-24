# Phoenix

Just as a Phoenix rises from the ashes, so does the Sema Code Quality Platform.

This is the Phoenix monorepo, the single source of truth, containing all code for every project. It can be run locally with a single command...see below. For
any project that has a .env.template file, be sure to make a copy, rename it to .env and plug in the appropriate values for your local environment.

**Docker is the preferred method to run projects locally! This avoids the _but it works on my machine_ problem.**

### Getting Started

```sh
# get the code
$ git clone git@github.com:Semalab/phoenix.git

# make sure you are in the project root
$ cd phoenix

# build all docker images for mongo, apollo and web
$ sudo docker-compose build --no-cache

# Run all docker servers
$ sudo docker-compose up
# to verify that the web app is running:
# look for a "ready - started server on http://localhost:3000" message in console output

# Browse to http://localhost:3000 to test the webapp
```
