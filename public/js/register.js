const fm = document.querySelector('form')

fm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_username: e.target[0].value,
      user_display_name: e.target[1].value,
      user_password: e.target[2].value,
      user_password_confirm: e.target[3].value,
      user_password_hint: e.target[4].value,
    }),
  })

  let result = await response.json()

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent =
      'You have successfully created your account. Coming soon.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
    }, 3000)
  } else {
    switch (result.err) {
      case 'username_required':
        alert.textContent = 'The username field is required.'
        break
      case 'username_too_long':
        alert.textContent = 'The username field is too long.'
        break
      case 'username_too_short':
        alert.textContent = 'The username field is too short.'
        break
      case 'display_name_required':
        alert.textContent = 'The display name field is required.'
        break
      case 'display_name_too_long':
        alert.textContent = 'The display name field is too long.'
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
