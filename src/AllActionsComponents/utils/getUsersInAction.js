const getUsersInAction = (usersInActionCodes, allUsers, inAction) => {

    return inAction
        ? allUsers.filter(user => {return usersInActionCodes.includes(user.public_id)})
        : allUsers.filter(user => {return !usersInActionCodes.includes(user.public_id)});
};

export default getUsersInAction;