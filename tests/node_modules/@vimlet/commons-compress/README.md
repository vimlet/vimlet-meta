# Compress

Tool that pack and unpack files or folders.

## Installation

npm install @vimlet/commons-compress

It will be also installed as a module within @vimlet/commons

## Usage

>## compress.pack(file, dest, options, doneHandler)
>
>Compress.
>
>* file: Source file or directory.
>* dest: Destination file.
>* options: 
>1. packHandler: Progression callback. `function(error, entry, entrySize, totalSize, totalCount)`.
>2. outputHandler: Default output callback `function(out)`, redirects stdout when provided.
>3. format: Compression format (zip, tar, tgz).
>* doneHandler: Default done callback `function(error, data)`.


>## compress.unpack(file, dest, options, doneHandler)
>
>Uncompress.
>
>* file: Source file or directory.
>* dest: Destination folder.
>* options: 
>1. unpackHandler: Progression callback. `function(error, entry, entrySize, totalSize, totalCount)`.
>2. outputHandler: Default output callback `function(out)`, redirects stdout when provided.
>3. format: Compression format (zip, tar, tgz).
>* doneHandler: Default done callback `function(error, data)`.

### Command mode:

* `vimlet-compress -i inlcude -o output -p`
    
    Calls pack.

* `vimlet-compress -i inlcude -o output -u`
    
    Calls unpack.

> |Params|Shorcut|Description|Default|
> |---|---|---|---|
> |--include|-i|File, folder or pattern to pack / unpack|-|
> |--exclude|-e|File, folder or pattern to exclude from packing|-|
> |--output|-o|Destination file or folder|-|
> |--format|-f|'zip', 'tar' or 'tgz'|'zip'|
> |--pack|-p|Call pack function|Pack is called by default if unpack is not specified|
> |--unpack|-u|Call unpack function|-|
> |--help|-h|Show help|-|
* `Note that if not pack neither unpack is selected, it will pack by default.`


## License
This project is under MIT License. See [LICENSE](https://github.com/vimlet/vimlet-commons/blob/master/LICENSE) for details.