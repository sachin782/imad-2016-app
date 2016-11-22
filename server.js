var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var bodyParser=require('body-parser');
var session = require('express-session');

var app = express();
app.use(morgan('combined'));

var config = {
  host: 'db.imad.hasura-app.io',
  user: 'rsbeoriginal',
  port: '5432',
  password: 'db-rsbeoriginal-951',
  database: 'rsbeoriginal',
};

var pool = new Pool(config);

//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));


function createTemplateReq (data,comment,userId,userFullName) {
    var title = data.title;
    var body = data.body;
    var likes = data.likes;
    var dislikes =data.dislikes;
    var articleId=data.id;
    
    var commentTemplate="";
    
    var i;
    var n= comment!==null?comment.length:0;
    for(i=0;i<n;i++){
        commentTemplate+=`
        <div class="list-group-item white row" style="margin:3%;background-color:#f2f2f2;border-radius:5px">
                        <div class="col-md-1">
                            <img src="/ui/blog/res/list_item.jpg" class="left" style="width:48px;height:48px;border-radius:50%">
                        </div>
                        <div class="col-md-5" style="margin-left:1%">
                            <h5><strong>${comment[i].full_name}</strong></h4>
                            <h4><small>${comment[i].comment}</small></h4>
                        </div>
                    </div>
        `;
    }
    
    var htmlTemplate = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Material Design</title>

    <!-- Bootstrap -->
    <link href="/ui/blog/css/bootstrap.min.css" rel="stylesheet">
    <link href="/ui/blog/css/style.css" rel="stylesheet">
    
  </head>
  <body>
      <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
    <!--Navigation Bar-->
    <div class="navbar navbar-static-top bs-docs-nav shadow" style="background-color:red;border-radius: 5px;width:100%; height:7.5%; padding:0.5%; position:fixed">
  		<div class="row">
            <div>
                <div class="col-md-1 left" style="margin-left:1%">
                <button id="bt_back" type="button" class="btn btn-default btn-lg">
                  <span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span> Back
                </button>
                <script>
                $('#bt_back').click(function(){
                    window.location.href = "/blog";
                });
                </script>
                </div>
                <div style="margin-left:40%" class="col-md-1 center "><h3><strong>Blog</strong></h3></div>
                <!-- Single button -->
                    <div id="login_area" class="col-md-1 right btn-group" style=" margin-right:5%">
                      
                    </div>
            </div>
            </div>
  	</div>
      <br><br>
  	<div class="row" >
  		<div id="col-left" class="margin-top-bottom left" style="margin-left:20%">            
            <div class="margin-top-bottom white shadow list-group-item" style="border-radius:4px;padding:1%">
                    <h3><strong>`+title+`</strong></h3>
                    <p><h4><small>`+body+` </small></h4></p>
                    <div><h5><small>`+likes+` Likes | `+dislikes+` Dislikes</small></h5>
                    </div>
            </div>
            <!--Comment Section -->
                <!-- Write a Comment Section-->
            <div class="margin-top-bottom white shadow" style="padding:2%">         
                <label><h4 class="page-header" style="margin:2%">Comments</h4></label>
                <div class="input-group" style="padding:1%;background-color:#f3f3f3">
                    <span class="input-group-addon" >
                        <img src="/ui/blog/res/list_item.jpg" class="left" style="width:48px;height:48px;border-radius:50%;">
                    </span>
                    <input id="txt_comment" type="text" class="form-control" placeholder="Write a comment . . . " style="height:48px" >
                    <button id="bt-comment" class="btn btn-success right margin-right-left" style="margin-right:4%;margin-top: 1%;"><strong>Comment</strong></button>
                    <script>
                    console.log(document.getElementById('txt_comment').value);
                    $(document).ready(function() {
                        $("#bt-comment").click(function(){
                            console.log(document.getElementById('txt_comment').value);
                            
                            var request = new XMLHttpRequest();
                            request.onreadystatechange = function () {
                                if (request.readyState === XMLHttpRequest.DONE) {
                                    if (request.status === 200) {
                                        $.ajax({
                                          url:"/comment",
                                          type:"POST",
                                          headers: { 
                                            "Content-Type": "application/x-www-form-urlencoded"
                                          },
                                          data:
                                          {
                                            articleId: "${articleId}",
                                            userId: "${userId}",
                                            comment: document.getElementById('txt_comment').value ,
                                            fullName: "${userFullName}"
                                        
                                        },
                                          dataType:"json",
                                          success: function(data) {
                                            alert('Comment posted on database.');
                                            location.reload();
                                        }
                                        });  
                                    } else {
                                            alert('Login first to comment on an Article');
                                    }
                                }
                            };
                            
                            request.open('GET', '/check-login', true);
                            request.send();
                            
                            
                        });  
                    });
                    
                    </script>
                </div>
                <!--Comments by users -->
                <ul id="list-comment" class="list-group">
                    ${commentTemplate}
                </ul>
            </div>
            
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
      <script src="http://getbootstrap.com/dist/js/bootstrap.min.js"></script>
      <script type="text/javascript" src="/ui/main.js"></script>
  </body>
</html>
    `;
    return htmlTemplate;
}

function createTemplate (data,comment) {
    var title = data.title;
    var body = data.body;
    var likes = data.likes;
    var dislikes =data.dislikes;
    var articleId=data.id;
    
    var commentTemplate="";
    
    var i;
    for(i=0;i<comment.length;i++){
        commentTemplate+=`
        <div class="list-group-item white row" style="margin:3%;background-color:#f2f2f2;border-radius:5px">
                        <div class="col-md-1">
                            <img src="/ui/blog/res/list_item.jpg" class="left" style="width:48px;height:48px;border-radius:50%">
                        </div>
                        <div class="col-md-5" style="margin-left:1%">
                            <h5><strong>${comment[i].full_name}</strong></h4>
                            <h4><small>${comment[i].comment}</small></h4>
                        </div>
                    </div>
        `;
    }
    
    var htmlTemplate = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Material Design</title>

    <!-- Bootstrap -->
    <link href="/ui/blog/css/bootstrap.min.css" rel="stylesheet">
    <link href="/ui/blog/css/style.css" rel="stylesheet">
    
  </head>
  <body>
      <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
    <!--Navigation Bar-->
    <div class="navbar navbar-static-top bs-docs-nav shadow" style="background-color:red;border-radius: 5px;width:100%; height:7.5%; padding:0.5%; position:fixed">
  		<div class="row">
            <div>
                <div class="col-md-1 left" style="margin-left:1%">
                <button id="bt_back" type="button" class="btn btn-default btn-lg">
                  <span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span> Back
                </button>
                <script>
                $('#bt_back').click(function(){
                    window.location.href = "/blog";
                });
                </script>
                </div>
                <div style="margin-left:40%" class="col-md-1 center "><h3><strong>Blog</strong></h3></div>
                <!-- Single button -->
                    <div id="login_area" class="col-md-1 right btn-group" style=" margin-right:5%">
                      
                    </div>
            </div>
            </div>
  	</div>
      <br><br>
  	<div class="row" >
  		<div id="col-left" class="margin-top-bottom left" style="margin-left:20%">            
            <div class="margin-top-bottom white shadow list-group-item" style="border-radius:4px;padding:1%">
                    <h3><strong>`+title+`</strong></h3>
                    <p><h4><small>`+body+` </small></h4></p>
                    <div><h5><small>`+likes+` Likes | `+dislikes+` Dislikes</small></h5>
                    </div>
            </div>
            <!--Comment Section -->
                <!-- Write a Comment Section-->
            <div class="margin-top-bottom white shadow" style="padding:2%">         
                <label><h4 class="page-header" style="margin:2%">Comments</h4></label>
                <div class="input-group" style="padding:1%;background-color:#f3f3f3">
                    <span class="input-group-addon" >
                        <img src="/ui/blog/res/list_item.jpg" class="left" style="width:48px;height:48px;border-radius:50%;">
                    </span>
                    <input id="txt_comment" type="text" class="form-control" placeholder="Write a comment . . . " style="height:48px" >
                    <button id="bt-comment" class="btn btn-success right margin-right-left" style="margin-right:4%;margin-top: 1%;" disabled><strong>Comment</strong></button>
                    <script>
                    console.log(document.getElementById('txt_comment').value);
                    $(document).ready(function() {
                        $("#bt-comment").click(function(){
                            console.log(document.getElementById('txt_comment').value);
                            
                            var request = new XMLHttpRequest();
                            request.onreadystatechange = function () {
                                if (request.readyState === XMLHttpRequest.DONE) {
                                    if (request.status === 200) {
                                         alert('Login first to comment on an Article');     
                                    }
                                }
                            };
                            
                            request.open('GET', '/check-login', true);
                            request.send();
                            
                            
                        });  
                    });
                    
                    </script>
                </div>
                <!--Comments by users -->
                <ul id="list-comment" class="list-group">
                    ${commentTemplate}
                </ul>
            </div>
            
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
      <script src="http://getbootstrap.com/dist/js/bootstrap.min.js"></script>
      <script type="text/javascript" src="/ui/main.js"></script>
  </body>
</html>
    `;
    return htmlTemplate;
}

app.get('/db', function (req, res) {
  pool.query('SELECT * FROM article ,user;',function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
        res.send(JSON.stringify(result.rows));   
      }
  });
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/blog', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/blog', 'index.html'));
});

app.get('/blog/sign-up', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/blog', 'sign-up.html'));
});

app.get('/blog/article/:id', function (req, res) {
    var comments;
    pool.query("SELECT * FROM comment WHERE article_id = $1", [req.params.id], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        //if (result.rows.length === 0) {
           // res.status(404).send('Article not found');
        //} else {
            comments = result.rows;
        //}
    }
  });
  pool.query("SELECT * FROM article WHERE id = $1", [req.params.id], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            if (req.session && req.session.auth && req.session.auth.userId) {
                res.send(createTemplateReq(articleData,comments,req.session.auth.userId,req.session.auth.userFullName)); 
                console.log('req template');
            }else{
                res.send(createTemplate(articleData,comments));
                console.log('req without template');
            }
            
        }
    }
  });
});

app.get('/ui/blog/css/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/blog/css', 'bootstrap.min.css'));
});

app.get('/ui/blog/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/blog/css', 'style.css'));
});

app.get('/ui/blog/res/list_item.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/blog/res', 'list_item.jpg'));
});

app.get('/ui/blog/fonts/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/blog/fonts', '*.*'));
});

app.post('/comment',function(req,res){
    var a_id=req.body.articleId;
    var u_id=req.body.userId;
    var c=req.body.comment;
    var f_name=req.body.fullName;
    
    pool.query(`INSERT INTO comment (article_id,user_id,comment,full_name) VALUES (${a_id},${u_id},'${c}','${f_name}');`,function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send('Success');
        }
    });
    console.log(req.body);
    res.send(req.body);
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
                //res.send(password.toString());
                console.log('db: '+dbString);
                console.log('password: '+password);
              if (password === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id,
                                    userName: result.rows[0].username,
                                    userFullName: result.rows[0].full_name
                };
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
             // res.send(result.rows[0].username);    
             res.send("Hey "+req.session.auth.userFullName);
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   //res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
   res.sendFile(path.join(__dirname, 'ui/blog', 'index.html'));
});


app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var full_name= req.body.full_name
   //var salt = crypto.randomBytes(128).toString('hex');
   //var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password,full_name) VALUES ($1, $2, $3)', [username, password, full_name], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          //res.status(200).send('User successfully created: ' + username);
          res.status(200).send('success');
      }
   });
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
