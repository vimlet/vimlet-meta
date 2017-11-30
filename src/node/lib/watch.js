var watch = require('glob-watcher');


exports.watch = function(include, exclude){
  var watcher = watch(include);
  watcher.on('change', function(path, stat) {
    console.log("file changeed",path);
  // `path` is the path of the changed file
  // `stat` is an `fs.Stat` object (not always available)
});
watcher.on('add', function(path, stat) {
  console.log("file added",path);
  // `path` is the path of the changed file
  // `stat` is an `fs.Stat` object (not always available)
});
watcher.on('unlink', function(path, stat) {
  console.log("file unlinked",path);
  // `path` is the path of the changed file
  // `stat` is an `fs.Stat` object (not always available)
});
};
