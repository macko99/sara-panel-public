const getUsersNotInArea = (usersInAreaCodes, allUsers, usersInActionCodes) => {

    const usersNotInActionButInAreaCodes =
        usersInActionCodes.filter(code => !usersInAreaCodes.includes(code))

    return allUsers.filter(user => {return usersNotInActionButInAreaCodes.includes(user.public_id)})
};

export default getUsersNotInArea;