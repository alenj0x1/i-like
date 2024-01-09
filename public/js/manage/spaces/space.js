const btnSave = document.getElementById('btn-save')
const btnDelete = document.getElementById('btn-delete')
const { dataset } = document.querySelector('.dtl-cont-val')
const spaceName = document.getElementById('space-name')
const spaceDescription = document.getElementById('space-description')
const spaceBanner = document.getElementById('space-banner')

spaceName.addEventListener('input', () => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

spaceDescription.addEventListener('input', () => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

spaceBanner.addEventListener('input', () => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

/** Edit space **/
btnSave.addEventListener('click', async () => {
  const response = await fetch(`/manage/spaces/edit/${dataset.spaceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: spaceName.textContent,
      description: spaceDescription.textContent,
      banner: spaceBanner.textContent,
    }),
  })

  const result = await response.json()

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent = 'Space edited correctly.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
    }, 3000)
  } else {
    switch (result.err) {
      case 'name_too_long':
        alert.textContent = 'The name field is too long.'
        break
      case 'name_too_short':
        alert.textContent = 'The name field is too short.'
        break
      case 'description_too_long':
        alert.textContent = 'The description field is too long.'
        break
      case 'description_too_short':
        alert.textContent = 'The description field is too short.'
        break
      case 'banner_invalid':
        alert.textContent = 'The banner field is invalid.'
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

/** Delete topic **/
btnDelete.addEventListener('click', async () => {
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

  const response = await fetch(`/manage/spaces/delete/${dataset.spaceId}`, {
    method: 'POST',
  })

  const result = await response.json()

  if (result.ok) {
    alert.textContent = 'Space deleted correctly.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
      window.location.href = '/manage/spaces'
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
