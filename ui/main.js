console.log('Loaded!');
function loadLoginForm() {
    var loginHtml = `
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Log in <span class="caret"></span>
                      </button>
                      <ul class="dropdown-menu" style="padding:1%;">
                        <li style="padding: inherit;" ><input id="txt_username" type="text" class="form-control" placeholder="Username "></li>
                        <li style="padding: inherit;" ><input id="txt_password" type="password" class="form-control" placeholder="Password" ></li>
                        <li style="padding: inherit;" align="right" ><button type="button" id="bt_login" class="btn btn-success" data-loading-text="Signing you in ..."><strong>Sign in</strong></button></li>
                        <li role="separator" class="divider"></li>
                        <li style="background-color:gold;" ><small>Don't have an account?</small><br>
                            <a href="/blog/sign-up">Sign up</a></li>
                      </ul>
        `;
    document.getElementById('login_area').innerHTML = loginHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('bt_login');
    submit.onclick = function () {
        var $btn = $(this).button('loading');
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Success!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  //alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              //loadLogin();
              $btn.button('reset');
          }  
          // Not done yet
        
        };
          // Make the request
        var username = document.getElementById('txt_username').value;
        var password = document.getElementById('txt_password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
        window.location.href = window.location.pathname;
        //location.reload(true);
    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i>${username}</i> <span class="caret"></span>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a href="/blog/profile">Profile</a></li>
                        <li><a href="/logout">Logout</a></li>
                      </ul>
    `;
    
    
    
}
    
function loadLogin() {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send();
}

loadLogin();