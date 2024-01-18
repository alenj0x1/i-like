const fmAppr = document.querySelector('.sett-appr')
const fmPriv = document.querySelector('.sett-priv')
const fmAcc = document.querySelector('.sett-acc')

const saveAppr = document.getElementById('save-appr')
const savePriv = document.getElementById('save-priv')
const changePass = document.getElementById('changePass')
const deleteAcc = document.getElementById('delete-acc')

/** APPEARANCE **/

// Remove class 'disabled' of inputs and textarea - Appearance
document
  .querySelectorAll('.sett-appr .fm-i, .sett-appr .fm-txtar, .sett-appr .fm-icolor')
  .forEach((inp, key) => {
    inp.addEventListener('input', ({ target }) => {
      if (saveAppr.classList.contains('disabled')) saveAppr.classList.remove('disabled')

      if (key === 0) {
        const displayName = document.querySelector('.profile-thb-disname')
        const displayNameCurrent = displayName.dataset.displayName

        target.value
          ? (displayName.textContent = target.value)
          : (displayName.textContent = displayNameCurrent)
      } else if (key === 1) {
        const username = document.querySelector('.profile-thb-username')
        const usernameCurrent = username.dataset.username

        target.value
          ? (username.textContent = '@' + target.value)
          : (username.textContent = '@' + usernameCurrent)
      } else if (key === 2) {
        const aboutMe = document.querySelector('.profile-thb-abtme')
        const aboutMeCurrent = aboutMe.dataset.aboutMe

        target.value ? (aboutMe.textContent = target.value) : (aboutMe.textContent = aboutMeCurrent)
      } else if (key === 3) {
        const banner = document.querySelector('.profile-thb-bnr')
        const bannerCurrent = banner.dataset.banner

        target.value ? setBackground(banner, target.value) : setBackground(banner, bannerCurrent)
      } else if (key === 4) {
        const avatar = document.querySelector('.profile-thb-avtr')
        const avatarCurrent = avatar.dataset.avatar

        target.value ? setBackground(avatar, target.value) : setBackground(avatar, avatarCurrent)
      } else if (key === 5) {
        const profileThb = document.querySelector('.profile-thb')
        const profileThbMn = document.querySelector('.profile-thb-mn')

        profileThb.style.backgroundColor = target.value
        profileThbMn.style.backgroundColor = target.value
      }
    })
  })

// Content count of textarea - Appearance
document.querySelector('.fm-txtar').addEventListener('input', ({ target }) => {
  document.querySelector('.abtme_count').textContent = `${target.value.length}/300`
})

// Update appearance settings
fmAppr.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      display_name: e.target[0].value,
      username: e.target[1].value,
      about_me: e.target[2].value,
      banner_url: e.target[3].value,
      avatar_url: e.target[4].value,
      color: e.target[5].value,
    }),
  })

  let result = await response.json()

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent = 'Preferences updated correctly'
  } else {
    switch (result.err) {
      case 'display_name_too_short':
        alert.textContent = 'The display name is too short.'
        break
      case 'display_name_too_long':
        alert.textContent = 'The display name is too long.'
        break
      case 'username_too_short':
        alert.textContent = 'The username is too short.'
        break
      case 'username_too_long':
        alert.textContent = 'The username is too long.'
        break
      case 'banner_invalid':
        alert.textContent = 'The banner is invalid.'
        break
      case 'about_me_too_long':
        alert.textContent = 'The about me is too long.'
        break
      default:
        alert.textContent = 'An unexpected error has occurred.'
    }
  }

  document.querySelector('body').append(alert)

  setTimeout(() => {
    alert.remove()
    window.location.href = '/settings'
  }, 1000)
})

/** PRIVACY **/

// Remove class 'disabled' of inputs and textarea - Appearance
document.querySelectorAll('.sett-priv .fm-icheck').forEach((inp, key) => {
  inp.addEventListener('input', () => {
    if (savePriv.classList.contains('disabled')) savePriv.classList.remove('disabled')
  })
})

// Update privacy settings
fmPriv.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hidden_posts_likes: e.target[0].checked,
      hidden_favorites: e.target[1].checked,
      hidden_badges: e.target[2].checked,
      hidden_followers: e.target[3].checked,
      hidden_following: e.target[4].checked,
    }),
  })

  let result = await response.json()

  const alert = document.createElement('span')
  alert.classList.add('alert')

  if (result.ok) {
    alert.textContent = 'Preferences updated correctly'
  } else {
    alert.textContent = 'An unexpected error has occurred.'
  }

  document.querySelector('body').append(alert)

  setTimeout(() => {
    alert.remove()
    window.location.href = '/settings'
  }, 1000)
})

function setBackground(elem, value) {
  if (!value || !isValidUrl(value)) {
    elem.style.backgroundColor = `${elem.dataset.color}`
    return
  }

  elem.style.background = `url('${value}')`
  elem.style.backgroundPosition = 'center'
  elem.style.backgroundSize = 'cover'
}
