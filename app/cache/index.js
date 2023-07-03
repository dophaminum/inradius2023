const NodeCache = require("node-cache");

let cache;

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.

if (process.env.NODE_ENV === "production") {
  cache = new NodeCache();
} else {
  if (!global.__cache) {
    global.__cache = new NodeCache();
  }
  cache = global.__cache;
}

export default cache;
