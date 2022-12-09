import React, {useEffect, useState} from 'react';
import UserService from "../services/user.service";
import MySpinner from "../common/MySpinner";
import AllUsersStates from "../AllUsersComponents/AllUsersStates";
import requestBasicGet from "../services/getRequestBasic";

const AllUsers = () => {

    // ----- STATES -----
    const [loading, setLoading] = useState(true);
    const [usersData, setUsersData] = useState('');

    const [usersDataRequest, setUsersDataRequest] = useState('');

    // ----- HOOKS -----
    // GET users data from server
    useEffect(() => {
        requestBasicGet(UserService.getAllUsers, setUsersData, '', 'users')
        setLoading(false);
    }, [usersDataRequest])


// ----- RENDER -----
    if(loading) return <MySpinner />;

    return (
        <div>
            {usersData &&
            <AllUsersStates
                users={usersData}
                setUsersDataRequest={setUsersDataRequest}
            />
            }
        </div>
    );
};

export default AllUsers;