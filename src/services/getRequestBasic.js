import errorAlert from "../common/requestRelated/errorAlert";

function requestBasicGet(UserServiceGet, setData, id='', type= '') {
    UserServiceGet(id)
        .then((response) => {
                if(response.status >= 200 && response.status <= 299){
                    // console.log(String(UserServiceGet), response.data)
                    if(type === 'users')
                        setData(response.data.users)
                    else if (type === 'paths')
                        setData(response.data.locations)
                    else
                        setData(response.data)
                }
            },
            (error) => {errorAlert(error)}
        );
}

export default requestBasicGet;