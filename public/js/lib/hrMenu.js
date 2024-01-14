const btnMenu = document.getElementById('hr-btn-mn')
const hrMenu = document.querySelector('.hr-mn')
const main = document.querySelector('main')

window.addEventListener('resize', () => {
  // Check if the window size is 768px and if main contains the "hidden" class, to remove it.
  if (window.innerWidth >= 768 && main?.classList.contains('hidden')) {
    main?.classList.remove('hidden')
  }
})

btnMenu.addEventListener('click', (e) => {
  if (hrMenu.classList.contains('hidden')) {
    hrMenu.classList.remove('hidden')

    // Hidden main content
    main?.classList.add('hidden')
    return
  }

  hrMenu.classList.add('hidden')

  // Show main content
  main?.classList.remove('hidden')
})
