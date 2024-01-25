const spconfHrBanner = document.querySelector('.spconf-hr-banner')
const background = document.querySelector('.background')
const fmBtn = document.querySelector('.fm-btn')
const focusState = {
  nm: {
    status: false,
    elem: null,
  },
  desc: {
    status: false,
    elem: null,
  },
}

// Enable fmBtn and other input functionality
document.querySelectorAll('.spconf-nm, .spconf-desc, .spconf-mng-usrnm, .spconf-bnr').forEach((elem, index) => {
  elem.addEventListener('input', ({ target }) => {
    if (fmBtn.classList.contains('disabled')) fmBtn.classList.remove('disabled')

    checkFocusState(index)

    // .spconf-nm
    if (index === 0) {
      if (!focusState.nm.elem) focusState.nm.status = true
      focusState.nm.elem = elem
    }

    // .spconf-desc
    if (index === 1) {
      if (!focusState.desc.status) focusState.desc.status = true
      focusState.desc.elem = elem
    }

    // .spconf-bnr
    if (index === 3) {
      if (elem.value.length === 0) {
        const defaultBnr = spconfHrBanner.dataset.spaceBnr

        spconfHrBanner.style.background = `url('${defaultBnr}') top`
        spconfHrBanner.style.backgroundSize = 'cover'

        background.style.background = `url('${defaultBnr}') top`
        background.style.backgroundSize = 'cover'
        return
      }

      spconfHrBanner.style.background = `url('${target.value}') top`
      spconfHrBanner.style.backgroundSize = 'cover'

      background.style.background = `url('${target.value}') top`
      background.style.backgroundSize = 'cover'
    }
  })
})

// Update space
document.querySelector('.fm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch(e.target.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: document.querySelector('.spconf-nm').textContent,
      description: document.querySelector('.spconf-desc').textContent,
      newManager: e.target[0].value,
      banner: e.target[1].value,
    }),
  })

  const alert = document.createElement('span')
  alert.classList.add('alert')

  const result = await response.json()

  if (result.spaceId) {
    window.location.href = `/spaces/${result.spaceId}`
  } else {
    switch (result.err) {
      case 'name_too_short':
        alert.textContent = 'The name field is too short.'
        break
      case 'name_too_long':
        alert.textContent = 'The name field is too long.'
        break
      case 'description_too_short':
        alert.textContent = 'The description field is too short.'
        break
      case 'description_too_long':
        alert.textContent = 'The description field is too long.'
        break
      case 'invalid_space_id':
        alert.textContent = 'Space id invalid.'
        break
      case 'user_not_found':
        alert.textContent = 'User not found.'
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

// Check the status of the name and description fields to return them to their default status.
function checkFocusState(index) {
  if (index !== 0 && focusState.nm.status && focusState.nm.elem?.textContent.length === 0) {
    const defaultNm = focusState.nm.elem.dataset.spaceNm

    focusState.nm.elem.textContent = defaultNm
  }

  if (index !== 1 && focusState.desc.status && focusState.desc.elem?.textContent.length === 0) {
    const defaultDesc = focusState.desc.elem.dataset.spaceDesc

    focusState.desc.elem.textContent = defaultDesc
  }
}
