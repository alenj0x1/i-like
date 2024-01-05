const btnSave = document.getElementById('btn-save')
const btnDelete = document.getElementById('btn-delete')
const { dataset } = document.querySelector('.dtl-cont-val')
const userUsername = document.getElementById('user-username')
const userDisplayName = document.getElementById('user-display-name')

userUsername.addEventListener('input', (e) => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

userDisplayName.addEventListener('input', (e) => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

/** Edit user **/
btnSave.addEventListener('click', async (e) => {
  const response = await fetch(`/manage/users/edit/${dataset.userid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: userUsername.textContent,
      display_name: userDisplayName.textContent,
    }),
  })

  const result = await response.json()

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent = 'User edited correctly.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
    }, 3000)
  } else {
    switch (result.err) {
      case 'username_too_long':
        alert.textContent = 'The username field is too long.'
        break
      case 'username_too_short':
        alert.textContent = 'The username field is too short.'
        break
      case 'display_name_too_long':
        alert.textContent = 'The display name field is too long.'
        break
      case 'display_name_too_short':
        alert.textContent = 'The display name field is too short.'
        break
      default:
        alert.textContent = 'An unexpected error has occurred.'
    }

    document.querySelector('body').append(alert)
    btnSave.attributes.setNamedItem('disabled')

    setTimeout(() => {
      alert.remove()
    }, 3000)
  }
})

/** Delete user **/
btnDelete.addEventListener('click', async (e) => {
  const alert = document.createElement('span')
  alert.classList.add('alert')

  const warning = prompt('This action is irreversible. Type "yes" to continue.')
  if (!warning || warning !== 'yes') {
    alert.textContent = 'Action cancelled.'
    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
    }, 3000)
    return
  }

  const response = await fetch(`/manage/users/delete/${dataset.userid}`, {
    method: 'POST',
  })

  const result = await response.json()

  if (result.ok) {
    alert.textContent = 'User deleted correctly.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
      window.location.href = '/manage/users'
    }, 3000)
  } else {
    alert.textContent = 'An unexpected error has occurred.'
  }

  document.querySelector('body').append(alert)
  btnSave.attributes.setNamedItem('disabled')

  setTimeout(() => {
    alert.remove()
  }, 3000)
})
