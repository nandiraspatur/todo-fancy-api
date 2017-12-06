var app = new Vue({
  el: '#vnx',
  data: {
    taskListIn: [],
    taskListCom: [],
    showTask: false,
    fullname: '',
    newTask: '',
    selectedTask: [],
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
  },
  created: function() {
    if(localStorage.getItem('accesstokentodo')){
      $('.ui.basic.modal')
        .modal('show')
      ;
      axios.get('http://todo.api.bhinfinix.com/users',
      {
        headers: {
          accesstokentodo: localStorage.getItem('accesstokentodo')
        }
      }
    )
    .then(response => {
      $('.ui.basic.modal')
        .modal('hide')
      ;
      var task = response.data.task_list
      var completed = []
      var incomplete = []
      task.forEach(t => {
        if(t.status == true){
          completed.push(t)
        }else{
          incomplete.push(t)
        }
      })
      this.taskListIn = incomplete;
      this.taskListCom = completed;
      this.fullname = `${response.data.firstname} ${response.data.lastname}`
    })
    .catch(err => console.log(err))
    }
  },
  methods: {
    loginTodo: function(input) {
      $('.ui.basic.modal')
        .modal('show')
      ;
      axios.post('http://todo.api.bhinfinix.com/users/login',{
        username: this.username || '',
        password: this.password || ''
      },{
        headers: {
          accesstokenfb: localStorage.getItem('accesstokenfb') || '',
        }
      })
      .then(response => {
        localStorage.setItem('accesstokentodo', response.data.accesstokentodo)
        if(localStorage.getItem('accesstokentodo')){
          axios.get('http://todo.api.bhinfinix.com/users',
          {
            headers: {
              accesstokentodo: localStorage.getItem('accesstokentodo')
            }
          }
        )
        .then(response => {
          var task = response.data.task_list
          var completed = []
          var incomplete = []
          task.forEach(t => {
            if(t.status == true){
              completed.push(t)
            }else{
              incomplete.push(t)
            }
          })
          this.taskListIn = incomplete;
          this.taskListCom = completed;
          this.fullname = `${response.data.firstname} ${response.data.lastname}`
          window.location.replace('http://localhost:8080')
        })
        .catch(err => console.log(err))
      }
      })
      .catch(err => console.log(err))
    },
    loginFb: () => {
      var self = this
      FB.login(response => {
        statusChangeCallback(response)
      },{scope: 'public_profile,email'});
    },
    newTaskSave: function() {
      $('.ui.basic.modal')
        .modal('show')
      ;
      axios.post('http://todo.api.bhinfinix.com/task',{
        task_name: this.newTask
      },{
        headers: {
          accesstokentodo: localStorage.getItem('accesstokentodo')
        }
      })
      .then(response => {
        $('.ui.basic.modal')
          .modal('hide')
        ;
        this.taskListIn.push(response.data);
        this.newTask = ''
      })
      .catch(err => console.log(err))
    },
    logout: function() {
      localStorage.clear()
      this.fullname = ''
      axios.get('http://todo.api.bhinfinix.com/users/logout')
      .then(response => {
        window.location.replace("http://localhost:8080/login.html")
      })
      .catch(err => console.log(err))
    },
    showIncomplete: function() {
      this.showTask = false;
      $('#incomplete').addClass('active')
      $('#completed').removeClass('active')
      $('#buttonAction').html('Completed')
    },
    showCompleted: function() {
      this.showTask = true;
      $('#incomplete').removeClass('active')
      $('#completed').addClass('active')
      $('#buttonAction').html('Incomplete')
    },
    addSelectTask: function(selectedTask) {
      this.selectedTask.push(selectedTask)
    },
    setTaskCompleted: function() {
      $('.ui.basic.modal')
        .modal('show')
      ;
      this.selectedTask.forEach(t => {
        axios.put(`http://todo.api.bhinfinix.com/task/done/${t}`,{},{
          headers: {
            accesstokentodo: localStorage.getItem('accesstokentodo')
          }
        })
        .then(({data}) => {
          console.log('Completed');
          window.location.reload()
        })
        .catch(err => console.log(err))
      })
    },
    deleteTask: function() {
      $('.ui.basic.modal')
        .modal('show')
      ;
      this.selectedTask.forEach((t, i) => {
        console.log(i)
        console.log(this.selectedTask.length)
        axios.delete(`http://todo.api.bhinfinix.com/task/${t}`,{
          headers: {
            accesstokentodo: localStorage.getItem('accesstokentodo')
          }
        })
        .then(response => {
          $('.ui.basic.modal')
          .modal('hide')
          ;
        })
        .catch(err => console.log(err))
        if(i == this.selectedTask.length-1){
          console.log('Deleted');
          window.location.reload()
        }
      })
    },
    signupModal: function() {
      $('.ui.tiny.modal')
        .modal('show')
      ;
    },
    signup: function() {
      $('.ui.basic.modal')
        .modal('show')
      ;
      var userData = {
        username: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email
      }
      axios.post('http://todo.api.bhinfinix.com/users/register', userData)
      .then(response => {
        $('.ui.basic.modal')
          .modal('hide')
        ;
        localStorage.setItem('accesstokentodo', response.data.accesstokentodo)
        window.location.replace('http://localhost:8080')
      })
      .catch(err => console.log(err))
    }
  }
})
