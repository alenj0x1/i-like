const form = document.querySelector('.rdt-post')
const bannerPost = document.querySelector('.rdt-post-banner')
const bannerInput = document.querySelector('.fm-i')
const contentInput = document.querySelector('.rdt-content')
const contentCount = document.querySelector('.rdt-content-count')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: e.target[0].value,
      content: e.target[1].value,
      banner: e.target[2].value,
      tags: e.target[3].value,
    }),
  })

  const alert = document.createElement('span')
  alert.classList.add('alert')

  const result = await response.json()

  if (result.ok) {
    window.location.href = `/spaces/${result.spaceId}`
  } else {
    switch (result.err) {
      case 'title_missing':
        alert.textContent = 'The title field is required.'
        break
      case 'name_too_short':
        alert.textContent = 'The title field is too short.'
        break
      case 'name_too_long':
        alert.textContent = 'The title field is too long.'
        break
      case 'content_missing':
        alert.textContent = 'The content field is required.'
        break
      case 'name_too_short':
        alert.textContent = 'The content field is too short.'
        break
      case 'name_too_long':
        alert.textContent = 'The content field is too long.'
        break
      case 'banner_invalid':
        alert.textContent = 'The banner field is invalid.'
        break
      case 'invalid_space_id':
        alert.textContent = 'Space id invalid.'
        break
      case 'post_title_taken':
        alert.textContent = 'Post title taken.'
        break
      case 'max_tags':
        alert.textContent = 'Max length of tags exceded. Only 25 tags'
        break
      case 'invalid_banner':
        alert.textContent = 'Invalid banner URL.'
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

bannerInput.addEventListener('input', ({ target }) => {
  bannerPost.style.background = `center url('${target.value}')`
  bannerPost.style.backgroundSize = 'cover'
})

contentInput.addEventListener('input', ({ target }) => {
  contentCount.textContent = `${target.value.length}/4000`
})
