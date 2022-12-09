const getUsername = (username, user) => {

    if(username.length > 32 && username.includes('-')){
        return user.phone.slice(3,6)+' '+user.phone.slice(6,9)+' '+user.phone.slice(9,12);
    } else {
        return username;
    }
};

export default getUsername;