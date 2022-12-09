const getUsersInArea = (usersInAreaCodes, allUsers) => {

    return allUsers.filter(user => {return usersInAreaCodes.includes(user.public_id)})

};

export default getUsersInArea;