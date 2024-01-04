const btnSave = document.getElementById('btn-save')
const btnDelete = document.getElementById('btn-delete')
const { dataset } = document.querySelector('.dtl-cont-val')
const userUsername = document.getElementById('user-username')
const userDisplayName = document.getElementById('user-display-name')

document.addEventListener('DOMContentLoaded', (ev) => {
  console.log('here')
})

userUsername.addEventListener('input', (e) => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

userDisplayName.addEventListener('input', (e) => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

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
