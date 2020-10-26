# Phoenix

Just as a Phoenix rises from the ashes, so does the Sema Code Quality Platform.

This is the Phoenix monorepo, the single source of truth, containing all code for every project. It can be run locally with a single command...see below. For
any project that has a .env.template file, be sure to make a copy, rename it to .env and plug in the appropriate values for your local environment.

**Docker is the preferred method to run projects locally! This avoids the _but it works on my machine_ problem.**

### Getting Started

```sh
# make sure you are in the project root
# to run all projects, as well as install/run postgres and mongodb:
$ docker-compose up
# to run only a single project:
$ docker-compose run <project name>
# for example, to run ONLY eric:
$ docker-compose run eric
# note - there are variables that need values within the docker-compose file and these can be
# specfied in 2 ways:
# 1. make a copy and of .env.template in the project root (name it .env) and set the values there OR
# 2. pass the values via the command line like so (running only eric in this example)
$ ORG=<org name> USERNAME=<github username> PASSWORD=<github password> REPO=<github repo url> docker-compose run eric
# To uninstall/tear down the infra locally run:
$ docker-compose down
```
