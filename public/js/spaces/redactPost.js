const form = document.querySelector('.rdt-post')
const bannerPost = document.querySelector('.rdt-post-banner')
const bannerInput = document.querySelector('.fm-i')
const descriptionInput = document.querySelector('.rdt-description')
const descriptionCount = document.querySelector('.rdt-description-count')

form.addEventListener('submit', ({ target }) => {})

bannerInput.addEventListener('input', ({ target }) => {
  bannerPost.style.background = `center url('${target.value}')`
  bannerPost.style.backgroundSize = 'cover'
})

descriptionInput.addEventListener('input', ({ target }) => {
  descriptionCount.textContent = `${target.value.length}/4000`
})
