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
  if(localStorage.getItem('accesstokentodo')){
    getUserData()
    $('#logout').css("display", "block" );
    $('#login-button').css("display", "none" );
    $('#open-message').html('Wellcome!')
    $('#action').css("display", "block" );
  }else{
    $('#action').css("display", "none" );
    $('#logout').css("display", "none" );
    $('#login-button').css("display", "block" );
    $('#open-message').html('Wellcome to TODO List Fancy API Web Page...')
  }
})

$("#id-task").dblclick(function() {
  alert( "Hello World!" );
});

$('#login-fb').click(function() {
  loginFb()
})

$('#logout').click(function() {
  logout()
})

$('#save-task').click(function() {
  let input = $('input[name=task-name]').val()
  saveNewTask(input);
  $('input[name=task-name]').val('')
})

$('#login-todo').click(function() {
  let userData = {
    username: $('input#login[name=username]').val(),
    password: $('input#login[name=password]').val()
  }
  loginTodo(userData);
})

$('#saveButton').click(function() {
  var val = $('#id-task:checked').map(function() {return this.value;}).get()
  $('#content-finish').fadeIn()
  val.forEach(function(v) {
    finishTask(v)
  })
})

$('#deleteButton').click(function() {
  var val = $('#id-task:checked').map(function() {return this.value;}).get()
  val.forEach(function(v) {
    deleteTask(v)
  })
})
// jQuery---------------------------------------


// javascript---------------------------------------
// send logout request to server
function logout() {
  localStorage.clear()
  axios.get('http://localhost:3000/users/logout')
  .then(response => {
    getUserData()
    $('#login-button').css("display", "block" );
    $('#logout').css("display", "none" );
    $('#user-content').html('');
    $('#content').html('');
    $('#action').css("display", "none" );
    $('#content-finish').html('');
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
        accesstokenfb: localStorage.accesstokenfb || '',
      }
  })
  .then(function(response) {
    if(response.data){
      if(response.data){
        localStorage.setItem('accesstokentodo', response.data.accessTokenTodo)
        getUserData()
        $('#action').css("display", "block" );
        $('#login-button').css("display", "none" );
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
  $('#content').html(`<div class="ui icon message">
  <i class="notched circle loading icon"></i>
  <div class="content">
    <div class="header">
      Just one second
    </div>
    <p>We're fetching that content for you.</p>
  </div>
</div>`)
  axios.get('http://localhost:3000/users', {
    headers: {
      accesstokenfb: localStorage.accesstokenfb || '',
      accesstokentodo: localStorage.accesstokentodo
    }
  })
  .then(function(responseTodo) {
    $('#user-content').html(userHandle(responseTodo.data));
    $('#content').html(taskHandle(responseTodo.data.task_list));
    $('#content-finish').html(taskFinishHandle(responseTodo.data.task_list));
    if(localStorage.position == 'taskFinish'){
      $('#content').css("display", "none" )
      $('#content-finish').fadeIn()
    }else{
      $('#content-finish').css("display", "none" )
      $('#content').fadeIn()
    }
  })
  .catch(function(err) {
    console.log(err);
  })
}

// handle data user from server convert to html
function userHandle(dataUser) {
  return `
    ${dataUser.firstname} ${dataUser.lastname}
  `
}

// handle data task from server convert to html
function taskHandle(taskData) {
  let tasks = ``
  taskData.forEach(t => {
    if(!t.status){
      tasks += `
      <div class="ui message">
      <i class="tasks icon"></i>
      ${t.task_name}
      <div class="ui toggle checkbox" style="float:right;">
      <input id="id-task" value="${t._id}" type="checkbox">
      <label></label>
      </div>
      </div>
      `
    }
  })
  return tasks
}

function taskFinishHandle(taskData) {
  let tasks = ``
  taskData.forEach(t => {
    if(t.status){
      tasks += `
      <div class="ui green message">
        <i class="checkmark box icon"></i>
        ${t.task_name}
        <div class="ui toggle checkbox" style="float:right;">
          <input id="id-task" value="${t._id}" type="checkbox">
          <label></label>
        </div>
      </div>
      `
    }
  })
  return tasks
}

// Save new task
function saveNewTask(input) {
  axios.post('http://localhost:3000/task', {
    task_name: input
    }, {
    headers: {
      accesstokenfb: localStorage.accesstokenfb,
      accesstokentodo: localStorage.accesstokentodo
    }
  })
  .then(response => {
    getUserData()
    console.log(response);
  })
  .catch(err => {
    console.log(err);
  })
}

// Set task finished
function finishTask(idTask) {
  if(idTask){
    axios.put(`http://localhost:3000/task/done/${idTask}`, {}, {
      headers: {
        accesstokenfb: localStorage.accesstokenfb,
        accesstokentodo: localStorage.accesstokentodo
      }
    })
    .then(response => {
      getUserData()
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    })

  }
}

// delete task
function deleteTask(idTask) {
  if(idTask){
    axios.delete(`http://localhost:3000/task/${idTask}`, {
      headers: {
        accesstokenfb: localStorage.accesstokenfb,
        accesstokentodo: localStorage.accesstokentodo
      }
    })
    .then(response => {
      getUserData()
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    })
  }
}
// javascript---------------------------------------
