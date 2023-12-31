export function filterUserData(user, role) {
  switch (role) {
    case 'admin':
      return user
    default:
      return {
        id: user._id.toString(),
        username: user.username,
        display_name: user.display_name,
        like: user.like,
        create_account: user.createdAt,
      }
  }
}
