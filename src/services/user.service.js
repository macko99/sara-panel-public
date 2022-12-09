import api from "./api";

// ALL USERS
// GET
const getAllUsers = () => {
  return api.get('users/rich');
}

// -- POST --
const postNewUser = (data) => {
  return api.post("register", data);
}

const postNewAdhocUser = (data) => {
  return api.post("register/one_time", data);
}

const postUserCodeGenerate = (data) => {
  return api.post("codes/generate/", data);
}

const postSMSinvite = (data) => {
  return api.post("sms/send/invite", data);
}

// -- PATCH --
const patchNewUserColor = (data) => {
  return api.patch("users/set_color", data);
}

const patchNewUserInterval = (data) => {
  return api.patch("users/set_interval", data);
}

// DEL
const delUser = (userID) => {
  return api.delete("users/" + userID)
}



// ALL ACTIONS
// -- GET --
const getActions = () => {
  return api("actions/all");
}

const getUsersInOneAction = (actionID) => {
  return api.get('actions/' + actionID + '/users')
}

// -- POST --
const postNewAction = (data) => {
  return api.post("actions", data);
}

const postAddUserToAction = (data) => {
  return api.post("actions/add_user", data);
}


// -- DEL --
const delAction = (actionID) => {
  return api.delete("actions/" + actionID);
}

const delUserFromAction = (data) => {
  return api.delete("actions/del_user", {
      data: data
  })
}



// ACTION EDITION
// -- GET --
const getAreas = (actionID) => {
  return api.get('areas/' + actionID + '/rich');
}

const getPaths = (actionID) => {
  return api.get('locations/' + actionID);
}

const getResources = (actionID) => {
  return api.get('resources/' + actionID + '/all')
}

const getActionDetails = (actionID) => {
  return api.get('actions/' + actionID);
}

const getUsersInArea = (areaID) => {
  return api.get('areas/' + areaID + '/users');
}

const getBlob = (uuid) => {
  return api.get('resources/blob?uuid=' + uuid)
}

// -- POST --
const postNewArea = (area, actionID) => {
  return api.post("actions/" + actionID + "/add_area", area)
}

const postAddUserToArea = (data) => {
  return api.post("areas/add_user", data);
}

const patchActionToggle = (toggle) => {
  return api.patch("actions/toggle", toggle)
}

// -- DEL --
const delActionArea = (areaID) => {
  return api.delete('areas/' + areaID)
}

const delUserFromArea = (data) => {
  return api.delete("areas/del_user", {
    data: data
  })
}

// -- NOTIFICATIONS --
const postSendNotify = (data, urlEnd) => {
  return api.post( "notifications/send/" + urlEnd, data);
}

export default {
  getUsersInOneAction,
  postAddUserToAction,
  delUserFromAction,
  getActions,
  postNewAction,

  postNewArea,
  patchActionToggle,
  getBlob,
  delActionArea,
  getUsersInArea,
  postAddUserToArea,
  delUserFromArea,
  delAction,

  getAreas,
  getPaths,
  getResources,
  getActionDetails,

  getAllUsers,
  postNewUser,
  postNewAdhocUser,
  postUserCodeGenerate,
  postSMSinvite,
  patchNewUserColor,
  patchNewUserInterval,
  delUser,

  postSendNotify
};
