<p align='center'>
<img src='https://vimlet.com/resources/img/commons-txt.png' title='Vimlet Commons' alt='Vimlet Commons' height="150">
</p>

## Provides a cross environment standardized API for common used functions.
This module is a constant effort of improvement to achieve a stable and flexible, free open-source solution, for common case developing needs.

**Currently supporting:**

* OS
* Run
* Request
* Compress
* Util
* Progress

You can access the source code at [vimlet/commons](https://github.com/vimlet/vimlet-commons)

## Instalation:

* Via NPM: `npm install @vimlet/commons`

## Basic usage:

```javascript
const commons = require("@vimlet/commons");

var src = require("path").join(__dirname, "resources/compress/pack");
var dst = require("path").join(__dirname, "resources/compress/file.zip");

commons.compress.pack(src, dst, "zip", null, function(error) {
    if(error) {
        console.log("Fail");
    } else {
        console.log("Success");
    }
});
```

## Compress

`compress.pack(file, dest, options, doneHandler)`

Compress.

* file: Source file or directory.
* dest: Destination file.
* options: 
1. packHandler: Progression callback. `function(error, entry, entrySize, totalSize, totalCount)`.
2. outputHandler: Default output callback `function(out)`, redirects stdout when provided.
3. format: Compression format (zip, tar, tgz).
* doneHandler: Default done callback `function(error, data)`.


`compress.unpack(file, dest, options, doneHandler)`

Uncompress.

* file: Source file or directory.
* dest: Destination folder.
* options: 
1. unpackHandler: Progression callback. `function(error, entry, entrySize, totalSize, totalCount)`.
2. outputHandler: Default output callback `function(out)`, redirects stdout when provided.
3. format: Compression format (zip, tar, tgz).
* doneHandler: Default done callback `function(error, data)`.


## Copy

`copy.copy(include, output, options, callback);`

Copy files in given pattern.
* include: Directory to look for files.
* output: Directory where files will be written.
* options: 
1. exclude: Used to skip files that you don't want to copy.
2. clean: Empty output directory before copy.
* callback.
    
`copy.watch(include, output, options);`

Watch for file changes in given pattern.
Watch for file changes in given pattern.
* include: Directory to look for files.
* output: Directory where files will be written.
* options: 
1. exclude: Used to skip files that you don't want to copy.
2. clean: Empty output directory before copy.


## Io

`io.getFiles(dir, options)`

Get files from directory. Return an array of objects like:
```
{
    root: "Root path",
    files: "Array with paths to files"
}
```
* dir: Array of patterns to search or single pattern.
* options:
1. exclude: patterns to exclude from search.
3. ignoreExtension: ignore file extensions.

`io.absoluteFiles(index)`

Get files from index object. Return an array of absolute paths.

* index: Object with root and relative paths.

`io.getRootFromPattern(pattern)`

Get root folder from a given pattern.

`io.isDirectory(path)`

Return true if path is a path to a directory, false if it is a path to a file.

`io.getFileSize(path)`

Return the size of the file in bytes.

`io.deleteFolderRecursive(folderPath, callback)`
`io.deleteFolderRecursiveSync(folderPath)`

Delete a folder and all its content.

`io.isInPattern(filePath, pattern, options)`

Return true if given file belongs to given pattern. False if not.

* options:
1. exlude: files to exclude from search.

`io.writeToDisk(output, data, callback)`

Write data to disk.

* output: Path to write the file.
* data: Data to write.

`io.getCommonBasePath(paths)`

Return a path that all given paths have in common.

* paths: String with multiple paths to compare.

## Os

`os.isWindows()`

`os.isLinux()`

`os.isMac()`

`os.is64Bit()`

`os.getUnixUserProfile()`

`os.setUserEnvironmentVariable(key, value, callback)`

Sets environment variables without admin privileges.
* key: Enviroment variable key.
* value: Enviroment variable value.
* callback

`os.addToUserPath(value, callback)`

Sets path variables without admin privileges.
* value: Path value to append.
* callback

`os.killProcessByName(name, options, callback)`

Kill a process by its name.
* name: Name of the process to be killed.
* options:
1. execHandler: Default output callback `function(out)`, redirects stdout when provided.
* callback

`os.createSymlink(dest, src, options, callback)`

Creates a symbolic link without admin privileges.
* dest: Symlink destination path.
* src: Symlink source path.
* options:
2. execHandler: Default output callback `function(out)`, redirects stdout when provided.
* callback

`os.findExec(binary, callback)`

Asserts if a command is accessible from the command line.

* binary: Symlink destination path.
* callback

## Progress

`progress.paintProgress(value, outputHandler)`

Prints progress at a given percent.

* value: Progress percent.
* outputHandler: Default output callback `function(out)`, redirects stdout when provided.

`progress.showProgress(value, options, outputHandler)`

Prints progress percent by value and total and returns the percent.

* value: Current progress value.
* options:
1. paintProgress: Function that actually does the painting. 
2. total: Total progress value.
* outputHandler: Default output callback `function(out)`, redirects stdout when provided.

`progress.progressHandler(total, max, options, mainOutputHandler)`

Handle progress painting avoiding duplicated output of the same progress.
* total: Total percent value.
* max:Provide a virtual limit that avoids printing over this value.
* options:
1. paintProgress: Function that actually does the painting.
* mainOutputHandler: Default output callback `function(out)`, redirects stdout when provided.

## Request

`request.download(url, dest, options, doneHandler)`

Downloads a file.
* url: The URL source to download. 
* dest: he place where the downloaded file will be stored.
* options:
1. downloadHandler: A progress callback `function(received, total, statusCode)`.
2. outputHandler: Default output callback `function(out)`, redirects stdout when provided.
* doneHandler: Default done callback `function(error, status)`.

## Run

`run.exec(command, options, doneHandler)`

Runs a file or command and streams its output.
* command: File or command to be executed.
* options:
1. execHandler: Default output callback `function(out, error)`, redirects stdout when provided.
2. args: Executable arguments(string[]).
3. workingDirectory: The path from where the executable will run.
* doneHandler: Default done callback `function(error, exitCode)`.

`run.fetch(command, options, doneHandler)`

Runs a file or command and buffers its output.
* command: File or command to be executed.
* options:
1. args: Executable arguments(string[]).
2. workingDirectory: The path from where the executable will run.
* doneHandler: Default done callback `function(error, exitCode)`.


## License
This project is under MIT License. See [LICENSE](https://github.com/vimlet/vimlet-commons/blob/master/LICENSE) for details.

