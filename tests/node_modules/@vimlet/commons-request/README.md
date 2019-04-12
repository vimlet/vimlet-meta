# Request

Request manager.

## Installation

npm install @vimlet/commons-request

It will be also installed as a module within @vimlet/commons

## Usage

>## request.download(url, dest, options, doneHandler)
>
>Downloads a file.
>* url: The URL source to download. 
>* dest: he place where the downloaded file will be stored.
>* options:
>1. downloadHandler: A progress callback `function(received, total, statusCode)`.
>2. outputHandler: Default output callback `function(out)`, redirects stdout when provided.
>* doneHandler: Default done callback `function(error, status)`.

## License
This project is under MIT License. See [LICENSE](https://github.com/vimlet/vimlet-commons/blob/master/LICENSE) for details.