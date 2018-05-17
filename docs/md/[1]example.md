## template.txt.vmt
```[javascript]
<% var user=data.user || "Peter"%>
<% template("template.txt.vmi");%>
Total users age: 
<% var totalAge = 0;
 for(var key in data){
     totalAge += data[key].age;
     }
     echo(totalAge);
 %>
 ```

## template.txt.vmi
```[javascript]
Hello <%= data[user].name%>.
Your age is <%= data[user].age%>.
```

## data
```[json]
{
    "peter":{
        "name":"Peter",
        "age":18
    },
    "jonh":{
        "name":"Jonh",
        "age":32
    }
}
```

## Call
meta.parseTemplateGlobAndWrite("template.txt.vmt", "output");

## Result
*output/template.txt*
```
Hello Peter.

Your age is 18.

Total users age: 50
```