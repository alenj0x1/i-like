const btnMenu = document.getElementById('hr-btn-mn')
const hrMenu = document.querySelector('.hr-mn')
const backgrounds = [
  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2103&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1596430222039-4a2d7b4cd767?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=2001&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1551482850-d649f078ed01?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1614670453169-89b992542686?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]
let currentBackground = 0

document.addEventListener('DOMContentLoaded', () => {
  changeBackground()
})

btnMenu.addEventListener('click', (e) => {
  if (hrMenu.classList.contains('hidden'))
    return hrMenu.classList.remove('hidden')

  hrMenu.classList.add('hidden')
})

// Changes body image every 3 seconds, iterating over 'backgrounds'
function changeBackground() {
  if (currentBackground === 0) execChange()

  function execChange() {
    if (currentBackground === backgrounds.length) currentBackground = 0

    const { style } = document.querySelector('body')
    style.background = `linear-gradient(to bottom, rgb(0, 0, 0, 0.7), rgb(0, 0, 0.5)), url("${backgrounds[currentBackground]}")`
    style.backgroundPosition = 'center'
    style.backgroundSize = 'cover'

    currentBackground++
  }

  setInterval(() => execChange(), 3000)
}
