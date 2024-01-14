const fm = document.querySelector('form')

fm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: e.target[0].value,
      description: e.target[1].value,
      banner: e.target[2].value,
      topic: e.target[3].value,
    }),
  })

  const alert = document.createElement('span')
  alert.classList.add('alert')

  const result = await response.json()

  if (result.ok) {
    window.location.href = `/topics/${result.topicId}`
  } else {
    switch (result.err) {
      case 'name_missing':
        alert.textContent = 'The username field is required.'
        break
      case 'name_too_short':
        alert.textContent = 'The username field is too short.'
        break
      case 'name_too_long':
        alert.textContent = 'The username field is too long.'
        break
      case 'description_missing':
        alert.textContent = 'The description field is required.'
        break
      case 'name_too_short':
        alert.textContent = 'The description field is too short.'
        break
      case 'name_too_long':
        alert.textContent = 'The description field is too long.'
        break
      case 'banner_invalid':
        alert.textContent = 'The banner field is invalid.'
        break
      case 'topic_missing':
        alert.textContent = 'The topic field is required.'
        break
      case 'space_name_taken':
        alert.textContent = 'Space name taken.'
        break
      case 'topic_invalid':
        alert.textContent = 'Topic field is invalid.'
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
