import { getUser } from './manageApp'

export function filterUserData(user, role) {
  switch (role) {
    case 'mod':
      return {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        like: user.like,
        roles: user.roles,
        status: user.status,
        account_status: user.account_status,
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
        status: user.status,
        account_status: user.account_status,
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

export async function filterSanctionData(
  sanction,
  { include_mod, include_user }
) {
  return {
    id: sanction._id,
    moderators: include_mod
      ? await Promise.all(
          sanction.moderators.map(
            async (modId) => await getUser(modId, 'manage')
          )
        )
      : sanction.moderators,
    user: include_user ? await getUser(sanction.user) : sanction.user,
    subject: sanction.subject,
    content: sanction.content,
    interactions: sanction.interactions,
    status: sanction.status,
    sanction: sanction.sanction_type,
    time: sanction.sanction_time,
    created: sanction.createdAt,
    updated: sanction.updatedAt,
  }
}

export async function filterSanctionsData(
  sanctions,
  { include_mod, include_user }
) {
  return include_mod || include_user
    ? await Promise.all(
        sanctions.map(
          async (sanction) =>
            await filterSanctionData(sanction, { include_mod, include_user })
        )
      )
    : sanctions
}
