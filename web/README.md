Phoenix
===============================================

Just as a Phoenix rises from the ashes, so does the Sema Code Quality Platform.

### Getting Started

```sh
$ git clone git@github.com:Semalab/phoenix.git
$ cd phoenix
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
