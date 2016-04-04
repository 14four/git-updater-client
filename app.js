var io = require("socket.io-client");
var async = require("async");
var exec = require("child_process").exec;
var argv = require('yargs')
            .usage('Usage: $0 <command> [options]')
            .command("url", "The url to connect to.")
            .help('h')
            .alias("h", "help")
            .alias("b", "branch")
            .describe('b', 'The specific branch to do a "git pull origin" from.')
            .describe('c', 'A command to run following a webhook update from server.')
            .example('$0 http://webserver -c node app.js', 'Run and execute a command following post webhook update.')
            .demand(1)
            .alias('c', 'command')
            .epilog('Copyright 2016, This requires a valid git repository with an "origin" for remote updating from.')
            .argv;
if (argv._.length == 0)
{
  console.log("Please add a domain to connect to.");
  console.log("$> git-updater http://site");
  return;
}

var socket = io(argv._[0])
socket.on('connect', function(){ console.log("Connected"); });
socket.on('connect_error', function(){ console.log("Error connecting to: " + argv._[0], "retrying..."); });
socket.on('event', function(data){});
socket.on('disconnect', function(){ console.log("Disconnected."); });

var c = argv.command;
if (c)
  console.log("Executing command after update:[" + c + "]");

var b = argv.branch
if (!b)
  b = "master";
console.log("Using branch:[" + b + "]");

socket.on("update", function(data){
  console.log("Update message received.", data);
  var child = exec("git pull origin "+(argv.branch ? argv.branch : ""));
  child.stdout.on('data', function(data) {
      process.stdout.write(data);
  });
  child.stderr.on('data', function(data) {
      process.stdout.write(data);
  });
  child.on('close', function(code) {
    if (code == 0 && c)
    {
      console.log("Executing remote command.");
      exec(c, function(err, stdout, stderr)
      {
        console.log("Remote command executed.");
        process.stdout.write(stdout);
      })
    }
  });
});
