import React from 'react';
import PathWithCurrentPosition from "../PathWithCurrentPosition";

const getPathsToMap = (paths, setSelectedUser, usersData, pathsToHide) => {

    const usersPaths = [];

    for(let i=0; i<paths.length; i++){

            const userID = paths[i].user;
            const userPathIndex = usersPaths.findIndex(rescuer => rescuer.userID === userID)

            // user's path in array -> add a location point
            if (userPathIndex >= 0){
                usersPaths[userPathIndex].locations.push(paths[i]);
            }
            // user's path not in array -> add user and his location to his path array
            else {
                usersPaths.push({
                    userID: userID,
                    locations: [paths[i]]
                })
            }
        }

    // ----- RENDER -----
    return usersPaths.map(userPath => {

        if(pathsToHide.includes(userPath.userID)){
            return null
        } else {
            return <PathWithCurrentPosition
                key={userPath.userID}
                userPath={userPath}
                userData={usersData.find(user => user.id === userPath.userID)}
                setSelectedUser={setSelectedUser}
            />;
        }
    });
};

export default getPathsToMap;