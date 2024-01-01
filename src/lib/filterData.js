export function filterUserData(user, role) {
  switch (role) {
    case 'admin':
      return {
        id: user._id.toString(),
        username: user.username,
        display_name: user.display_name,
        like: user.like,
        roles: user.roles,
        created_account: user.createdAt,
        last_change_account: user.updatedAt,
      }
    default:
      return {
        id: user._id.toString(),
        username: user.username,
        display_name: user.display_name,
        like: user.like,
        roles: user.roles,
        created_account: user.createdAt,
      }
  }
}

export function filterUsersData(users) {
  return users.map((user) => {
    return {
      id: user._id.toString(),
      username: user.username,
      display_name: user.display_name,
      like: user.like,
      roles: user.roles,
      created_account: user.createdAt,
      last_change_account: user.updatedAt,
    }
  })
}
