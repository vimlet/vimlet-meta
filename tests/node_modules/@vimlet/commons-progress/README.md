# Progress

Feedback of running progress to the user.

## Installation

npm install @vimlet/commons-progress

It will be also installed as a module within @vimlet/commons

## Usage


>## progress.paintProgress(value, outputHandler)
>
>Prints progress at a given percent.
>
>* value: Progress percent.
>* outputHandler: Default output callback `function(out)`, >redirects stdout when provided.

>## progress.showProgress(value, options, outputHandler)
>
>Prints progress percent by value and total and returns the percent.
>
>* value: Current progress value.
>* options:
>1. paintProgress: Function that actually does the painting. 
>2. total: Total progress value.
>* outputHandler: Default output callback `function(out)`, redirects stdout when provided.

>## progress.progressHandler(total, max, options, mainOutputHandler)
>
>Handle progress painting avoiding duplicated output of the same progress.
>* total: Total percent value.
>* max:Provide a virtual limit that avoids printing over this value.
>* options:
>1. paintProgress: Function that actually does the painting.
>* mainOutputHandler: Default output callback `function(out)`, redirects stdout when provided.

## License
This project is under MIT License. See [LICENSE](https://github.com/vimlet/vimlet-commons/blob/master/LICENSE) for details.