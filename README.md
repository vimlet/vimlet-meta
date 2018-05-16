[//]: # (badges)

![license](https://vimlet.com/vimlet/VimletDoc/master/docs/readme/1526497658517/license.svg?raw=true "License")
![build](https://vimlet.com/vimlet/VimletDoc/master/docs/readme/1526497658517/build.svg?raw=true "Build")
![docs](https://vimlet.com/vimlet/VimletDoc/master/docs/readme/1526497658517/docs.svg?raw=true "Docs")

[//]: # (badges)




# **VimletMeta**

It is a tool that generate files from templates.

## Features

* Data binding.
* Inheritance templates.
* Glob patters to search for template files.
* Watcher to look for changes and update files on the fly.

## Installation

npm install @vimlet/meta -g

## Usage

* `meta.parse(template, options, callback);`

    Returns the result of given template.

* `meta.parseTemplateGlob(include, options, callback);`

    Returns an object with the result. `{"relativePath":"",
    "result":""}`

* `meta.parseTemplateGlobAndWrite(include, output, options, callback);`

    Write the results to output folder while keeping files structure.

* `meta.watch(include, output, options);`

    Do parseTemplateGlobAndWrite and keep looking for changes.

    **options**

    `{
        "exclude": "glob patterns",
        "output": "string",
        "data": {},
        "clean": false
    }`

    * exclude: Used to skip files that you don't want to parse.
    * output: Directory where files will be written using parseTemplateGlobAndWrite.
    * data: Data to be bind.
    * clean: Empty output directory before parse.

### Command mode:

* `vimlet-meta -i include -o output -e exclude -d data -c clean`

    Calls meta.parseTemplateGlobAndWrite

* `vimlet-meta -i include -o output -e exclude -d data -c clean -w`

    Calls meta.watch

## Example

>* Template:
>` Hello I'm a template <%echo("Raw text");%>`
>
>* Result:
> `Hello I'm a template Raw text

>* Template:
>` Hello I'm a template <% data.name %>`
>
>* Data:
> `{"name":"VimletMeta"}`
>* Result:
> `Hello I'm a template VimletMeta`

>* Template1:
>` Hello I'm a template <%template(template2.vmi)%>`
>
>* Template2:
> `I'm another template`
>
>* Result:
> `Hello I'm a template I'm another template`






## Documentation

WIP

## License
vComet is released under MIT License. See [LICENSE](https://github.com/vimlet/VimletMeta/blob/master/LICENSE) for details.