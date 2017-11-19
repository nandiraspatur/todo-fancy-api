// facebook sdk---------------------------------------
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  if (response.status === 'connected') {
    localStorage.setItem('accesstokenfb', response.authResponse.accessToken || null)
    loginTodo('');
  } else {
    document.getElementById('status').innerHTML = 'Please log ' +
    'into this app.';
  }
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '304382863389021',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.11' // use graph api version 2.8
  });
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginFb() {
  FB.login(function(response){
    statusChangeCallback(response)
  },{scope: 'public_profile,email'});
}
// facebook sdk---------------------------------------


// jQuery---------------------------------------
$(document).ready(function() {
  console.log(localStorage);
  if(localStorage.getItem('accesstokentodo')){
    loginTodo('')
    $('#logout').css("display", "block" );
    $('#login-fb').css("display", "none" );
  }
})

$('#login-fb').click(function() {
  loginFb()
})

$('#logout').click(function() {
  logout()
})

$('#show-task').click(function() {
  getTask()
})

$('#save-task').click(function() {
  let input = $('input[name=task-name]').val()
  saveNewTask(input);
  $('input[name=task-name]').val('')
})

$('#login-todo').click(function() {
  let userData = {
    username: $('input[name=username]').val(),
    password: $('input[name=password]').val()
  }
  loginTodo(userData);
})
// jQuery---------------------------------------


// javascript---------------------------------------
// send logout request to server
function logout() {
  localStorage.clear()
  axios.get('http://localhost:3000/users/logout')
  .then(response => {
    console.log(response);
    getUserData()
    $('#logout').css("display", "none" );
    $('#login-fb').css("display", "block" );
  })
  .catch(err => {
    console.log(err);
  })
}

// login to api server
function loginTodo(userData) {
  axios.post('http://localhost:3000/users/login', {
      username: userData.username || '',
      password: userData.password || ''
    },{
      headers: {
        accesstokenfb: localStorage.getItem('accesstokenfb') || ''
      }
  })
  .then(function(response) {
    if(response.data){
      if(response.data){
        localStorage.setItem('accesstokentodo', response.data.accessTokenTodo)
        getUserData()
        $('#login-fb').css("display", "none" );
        $('#logout').css("display", "block" );
      }else{
        console.log('Incorrect username/password');
      }
    }
  })
  .catch(function(err) {
    console.log(err);
  })
}

// get data user from server
function getUserData() {
  axios.get('http://localhost:3000/users', {
    headers: {
      accesstokenfb: localStorage.getItem('accesstokenfb') || '',
      accesstokentodo: localStorage.getItem('accesstokentodo')
    }
  })
  .then(function(responseTodo) {
    console.log(responseTodo);
    $('#user-content').html(userHandle(responseTodo.data));
  })
  .catch(function(err) {
    $('#user-content').html('Please login/register');
  })
}

// handle data user from server convert to html
function userHandle(dataUser) {
  console.log(dataUser);
  return `
    <div>
      <p>Selamat Datang,</p>
      <h3>${dataUser.firstname} ${dataUser.lastname}</h3>
    </div>
  `
}

// get data tasks list from server
function getTask() {
  axios.get('http://localhost:3000/task', {
    headers: {
      accesstokenfb: localStorage.getItem('accesstokenfb'),
      accesstokentodo: localStorage.getItem('accesstokentodo')
    }
  })
  .then(response => {
    $('#content').html(taskHandle(response.data))
  })
  .catch(err => {
    $('#content').html('Please login/register..')
    console.log(err);
  })
}

// handle data task from server convert to html
function taskHandle(taskData) {
  let tasks = ``
  taskData.forEach(t => {
    tasks += `
      <div>
        <p><b>Task Name :</b> ${t.task_name}</p>
        <p><b>Status :</b> ${t.status}</p>
      </div>
    `
  })
  return tasks
}

// Save new task
function saveNewTask(input) {
  axios.post('http://localhost:3000/task', {
    task_name: input
    }, {
    headers: {
      accesstokenfb: localStorage.getItem('accesstokenfb'),
      accesstokentodo: localStorage.getItem('accesstokentodo')
    }
  })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.log(err);
  })
}
// javascript---------------------------------------
