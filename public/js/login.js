const fm = document.querySelector('form')

fm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_username: e.target[0].value,
      user_password: e.target[1].value,
    }),
  })

  let result = await response.json()
  console.log(result)

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent = 'User logged correctly. Coming soon.'
  } else {
    if (result.err === 'username_or_password_incorrect') {
      alert.textContent = 'Username or password incorrect.'
    }
  }

  document.querySelector('body').append(alert)

  setTimeout(() => {
    alert.remove()
  }, 2000)
})
