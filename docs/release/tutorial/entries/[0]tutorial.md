# Vimlet-Meta

It is a tool that generates files from templates.

## Templates

Templates are text files created by the user. 

Raw text in the template will be parsed as it is but you can use the power of javascript within tags.

Default tags are `<% //code here %>` but it can be changed by the user directly into `meta.tags`. 
**meta.tags** is an array which contains `[openTag, closeTag, echo shorcut*]` by default it is set to `["<%","%>","="]`.

* echo: It is a command that will print text within code tags.
	` Hello <% echo("World"); %>`  Will print *"Hello World"*
* template: It is a command that imports templates where it is called.
	`Hello <% template("anohterTemlate.vmi"); %>` Will print *"Hello"* followed by *"anotherTemplate.vmi"* content.
* js: VimletMeta is powered by javascript so it can be used inside of tags.
	`Hello <% for(var i = 0; i<3; i++){echo('for');} %>`  Will print *"Hello for for for"*

## Data binding

One of the meta advantages is the ability to bind data from a json. IE:
* Template:
`Hello <%= data.name%>`
* Data:
`{"name": "Peter"}`
* Result:
	*Hello Peter*

## Meta functions

1. meta.parse(template, options, callback);
	* template: template as string.
	* options: {data:{},exclude:glob pattern}
	* callback: callback after parse.
	* return: template parsed as string.
2. meta.parseTemplateGlob(include, options, callback);
	* include: glob pattern of files to parse.
    * options: {data:{},exclude:glob pattern}
	* callback.
	* return: [{relativePath:"", result:""}]
3. meta.parseTemplateGlobAndWrite(include, output, options, callback);
    * include: glob pattern of files to parse.
    * output: destination folder, it respects files structure within include path.
    * options: {data:{},exclude:glob pattern, clean:boolean}
    * callback.
4. meta.watch(include, output, options,);
    * include: glob pattern of files to parse.
    * output: destination folder, it respects files structure within include path.
    * options: {data:{},exclude:glob pattern, clean:boolean}

## Command mode

* `vimlet-meta -i include -o output -e exclude -d data -c clean`

    Calls meta.parseTemplateGlobAndWrite

* `vimlet-meta -i include -o output -e exclude -d data -c clean -w`

    Calls meta.watch
> exclude, data and clean are optional.

## File extension

We use .vmt for vimlet meta templates and .vmi for vimlet meta imported in our imported templates but any extension is welcome.
Note that meta respect file extension if it is included in template name:
* index.html.vmt after parsed will be written as index.html