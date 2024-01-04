const fm = document.querySelector('form')

fm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: e.target[0].value,
      content: e.target[1].value,
      sanction_type: e.target[3].value,
      sanction_time: e.target[5].value,
    }),
  })

  const alert = document.createElement('span')
  alert.classList.add('alert')

  const result = await response.json()

  if (result.userId) {
    window.location.href = `/manage/sanctions/${result.userId}`
  } else {
    switch (result.err) {
      case 'user_required':
        alert.textContent = 'The username field is required.'
        break
      case 'display_name_required':
        alert.textContent = 'The display name field is required.'
        break
      case 'password_required':
        alert.textContent = 'The password field is required.'
        break
      case 'password_confirm_required':
        alert.textContent = 'The confirm password field is required.'
        break
      case 'password_confirm_is_not_equal':
        alert.textContent = 'Confirmation password does not match.'
        break
      case 'user_registered':
        alert.textContent = 'The user is registered. Try another username.'
        break
      default:
        alert.textContent = 'An unexpected error has occurred.'
    }
    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
    }, 3000)
  }
})
