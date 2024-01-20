const usrFollow = document.querySelector('.usr-follow')
const followersVal = document.querySelector('.followers-val')

usrFollow.addEventListener('click', async (e) => {
  await fetch(
    `/interactions/${usrFollow.dataset.followedByUser === '1' ? 'unfollow' : 'follow'}/${
      usrFollow.dataset.userId
    }`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then(async (response) => {
    const { color, background, followers } = await response.json()

    if (response.status === 200 || 201) {
      // Unfollow
      if (usrFollow.dataset.followedByUser === '1') {
        usrFollow.style.backgroundColor = background.normal
        usrFollow.dataset.followedByUser = '0'
        usrFollow.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="usr-icon font-${color}">
            <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
          </svg>
        `

        followersVal.textContent = followers
        return
      }

      // Follow
      usrFollow.dataset.followedByUser = '1'
      usrFollow.style.backgroundColor = background.opaque
      usrFollow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="usr-icon font-${color}">
          <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM472 200H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H472c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
        </svg>
      `

      followersVal.textContent = followers
    }
  })
})
