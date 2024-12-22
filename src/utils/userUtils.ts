import { UserResponse, UserMap } from '../types/users';

export function updateAllUsers(userDetails: UserResponse[], allUsers: UserMap): void {
  userDetails.forEach((user) =>
    allUsers.set(user.user_id.toString(), `${user.first_name} ${user.last_name}`)
  );
}
