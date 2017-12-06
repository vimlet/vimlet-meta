<%
function getAge(age){
  return age;
}
%>
This template simply call a function and it prints the result via echo.
<% echo('Result age is: ' + getAge(data.age))%>
