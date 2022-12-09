const getTimeFromTimestamp = (timestamp) => {

    const date = new Date(timestamp*1000);
    return date.toLocaleTimeString()
};

export default getTimeFromTimestamp;