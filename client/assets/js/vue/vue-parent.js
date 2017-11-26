var app = new Vue({
  el: '#vnx',
  data: {
    taskListIn: '',
    taskListCom: '',
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
    console.log(localStorage.getItem('accesstokentodo'));
    if(localStorage.getItem('accesstokentodo')){
      axios.get('http://localhost:3000/users',
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
    })
    .catch(err => console.log(err))
    }
  },
  methods: {
    loginTodo: function() {
      axios.post('http://localhost:3000/users/login',{
        username: this.username,
        password: this.password
      })
      .then(response => {
        localStorage.setItem('accesstokentodo', response.data.accesstokentodo)
        window.location.replace('http://localhost:8080')
      })
      .catch(err => console.log(err))
    },
    newTaskSave: function() {
      axios.post('http://localhost:3000/task',{
        task_name: this.newTask
      },{
        headers: {
          accesstokentodo: localStorage.getItem('accesstokentodo')
        }
      })
      .then(response => {
        this.taskListIn.push(response.data);
        this.newTask = ''
      })
      .catch(err => console.log(err))
    },
    logout: function() {
      localStorage.clear()
      axios.get('http://localhost:3000/users/logout')
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
      this.selectedTask.forEach(t => {
        axios.put(`http://localhost:3000/task/done/${t}`,{},{
          headers: {
            accesstokentodo: localStorage.getItem('accesstokentodo')
          }
        })
        .then(response => {
          console.log('Completed');
        })
        .catch(err => console.log(err))
      })
      window.location.reload()
    },
    deleteTask: function() {
      this.selectedTask.forEach(t => {
        axios.delete(`http://localhost:3000/task/${t}`,{
          headers: {
            accesstokentodo: localStorage.getItem('accesstokentodo')
          }
        })
        .then(response => {
          console.log('Deleted');
        })
        .catch(err => console.log(err))
      })
      window.location.reload()
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
      axios.post('http://localhost:3000/users/register', userData)
      .then(response => {
        $('.ui.basic.modal')
          .modal('hide')
        ;
      })
      .catch(err => console.log(err))
    }
  }
})
