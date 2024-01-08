const btnSave = document.getElementById('btn-save')
const btnDelete = document.getElementById('btn-delete')
const { dataset } = document.querySelector('.dtl-cont-val')
const topicName = document.getElementById('topic-name')
const topicDescription = document.getElementById('topic-description')
const topicBanner = document.getElementById('topic-banner')

topicName.addEventListener('input', (e) => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

topicDescription.addEventListener('input', (e) => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

topicBanner.addEventListener('input', (e) => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

/** Edit topic **/
btnSave.addEventListener('click', async (e) => {
  const response = await fetch(`/manage/topics/edit/${dataset.topicId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: topicName.textContent,
      description: topicDescription.textContent,
      banner: topicBanner.textContent,
    }),
  })

  const result = await response.json()

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent = 'Topic edited correctly.'

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

  const response = await fetch(`/manage/topics/delete/${dataset.topicId}`, {
    method: 'POST',
  })

  const result = await response.json()

  if (result.ok) {
    alert.textContent = 'Topic deleted correctly.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
      window.location.href = '/manage/topics'
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
