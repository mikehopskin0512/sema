# Phoenix

Phoenix front-end web application

### Getting Started

```sh
$ npm install
$ npm run dev
# project will be available on http://localhost:3000
# files will automatically rebuild and refresh the browser as you make changes
```

### Directory Layout

```
.
├── /.storybook/                # Storybook configuration
├── /public/                    # Static files that can be used in the build
├── /src/                       # The source code of the application
│   ├── /components/            # All components used in the app live here
│   ├── /hooks/                 # React hooks
│   ├── /pages/                 # Every page is a route accessible in the browser
├── /stories/                   # For storybook stories
│── /styles                     # Global application styles
│── .env.template               # ENV vars for local development
│── next.config.js              # Used by next.js to add advanced behavior
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
