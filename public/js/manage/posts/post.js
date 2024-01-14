const btnSave = document.getElementById('btn-save')
const btnDelete = document.getElementById('btn-delete')
const { dataset } = document.querySelector('.dtl-cont-val')
const postTitle = document.getElementById('post-title')
const postContent = document.getElementById('post-content')
const postTags = document.getElementById('post-tags')
const postBanner = document.getElementById('post-banner')

postTitle.addEventListener('input', () => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

postContent.addEventListener('input', () => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

postTags?.addEventListener('input', () => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

postBanner.addEventListener('input', () => {
  if (btnSave.attributes.getNamedItem('disabled'))
    btnSave.attributes.removeNamedItem('disabled')
})

/** Edit post **/
btnSave.addEventListener('click', async () => {
  const response = await fetch(`/manage/posts/edit/${dataset.postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: postTitle.textContent,
      content: postContent.textContent,
      tags: postTags.textContent,
      banner: postBanner.textContent,
    }),
  })

  const result = await response.json()

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent = 'Post edited correctly.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
    }, 3000)
  } else {
    switch (result.err) {
      case 'title_too_long':
        alert.textContent = 'The title field is too long.'
        break
      case 'title_too_short':
        alert.textContent = 'The title field is too short.'
        break
      case 'content_too_long':
        alert.textContent = 'The content field is too long.'
        break
      case 'content_too_short':
        alert.textContent = 'The content field is too short.'
        break
      case 'max_tags':
        alert.textContent = 'Max length of tags exceded. Only 25 tags'
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

/** Delete post **/
btnDelete?.addEventListener('click', async () => {
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

  const response = await fetch(`/manage/posts/delete/${dataset.postId}`, {
    method: 'POST',
  })

  const result = await response.json()

  if (result.ok) {
    alert.textContent = 'Post deleted correctly.'

    document.querySelector('body').append(alert)

    setTimeout(() => {
      alert.remove()
      window.location.href = '/manage/posts'
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
