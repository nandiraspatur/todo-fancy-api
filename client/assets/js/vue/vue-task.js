Vue.component('task-list', {
  template:`
  <div class="item">
    <div class="content">
    <div class="ui checkbox">
      <input name="example" type="checkbox" :value="task_list._id" v-model="checkbox" @click="selectTask"">
      <label>{{task_list.task_name}}</label>
    </div>
    </div>
  </div>
  `,
  data: function() {
    return {
      checkbox: []
    }
  },
  props: ['task_list'],
  methods: {
    selectTask: function() {
      this.$emit('selected-task', this.task_list._id)
    }
  }
})
