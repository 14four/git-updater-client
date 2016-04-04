If you run this application from a git directory, it will connect to a server that can take a webhook to auto-update.

```
Usage: git-updater-client <command> [options]

Commands:
  url  The url to connect to.

Options:
  -h, --help     Show help                                             [boolean]
  -b, --branch   The specific branch to do a "git pull origin" from.
  -c, --command  A command to run following a webhook update from server.

Examples:
  app.js http://webserver -c node app.js  Run and execute a command following
                                          post webhook update.

Copyright 2016, This requires a valid git repository with an "origin" for remote
updating from.
```
