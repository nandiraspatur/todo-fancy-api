$('#login-modal').click(function() {
  $('.ui.modal')
    .modal('show')
  ;
})

$('#login-todo').click(function() {
  $('.ui.modal')
    .modal('hide')
  ;
})

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;

$('#taskFinish').click(function() {
  $('#content').fadeOut()
  $('#content-finish').fadeIn()
  $('#taskFinish').addClass('active')
  $('#taskList').removeClass('active')
  $('#saveButton').html('Cancel')
  localStorage.position = 'taskFinish'
})

$('#taskList').click(function() {
  $('#content').fadeIn()
  $('#content-finish').fadeOut()
  $('#taskList').addClass('active')
  $('#taskFinish').removeClass('active')
  $('#saveButton').html('Done')
  localStorage.position = 'taskList'
})
