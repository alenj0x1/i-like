const btnMenu = document.getElementById('hr-btn-mn')
const hrMenu = document.querySelector('.hr-mn')

btnMenu.addEventListener('click', (e) => {
  if (hrMenu.classList.contains('hidden')) {
    hrMenu.classList.remove('hidden')

    // Hidden main content
    document.querySelector('main')?.classList.add('hidden')
    return
  }

  hrMenu.classList.add('hidden')

  // Show main content
  document.querySelector('main')?.classList.remove('hidden')
})
