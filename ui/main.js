var button=document.getElementById('counter');
button.onclick=function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
    if(request.status===200){
    counter=counter+1;
    var counter=request.responseText;
    var span=document.getElementById('count');
    span.innerHTML=couner.toString();
    }
    }
};
request.open('GET',http://sachin782.imad.hasura-app.io/counter,true);
request.send(null);
};