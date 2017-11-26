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

// javascript---------------------------------------
$(document)
  .ready(function() {
    $('.ui.form')
      .form({
        fields: {
          email: {
            identifier  : 'email',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your e-mail'
              },
              {
                type   : 'email',
                prompt : 'Please enter a valid e-mail'
              }
            ]
          },
          password: {
            identifier  : 'password',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your password'
              },
              {
                type   : 'length[6]',
                prompt : 'Your password must be at least 6 characters'
              }
            ]
          }
        }
      })
    ;
  })
;

$('.ui.dropdown')
  .dropdown()
;
