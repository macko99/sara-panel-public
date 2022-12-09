const getPeriodPaths = (locations, timeInterval) => {
    let periodPaths = [[locations[0]]];
    let j=0;


    for(let i=1; i<locations.length; i++){

        const timeDiff = locations[i].time - locations[i-1].time;

        if(timeDiff > timeInterval || timeDiff < 1 ) {
            periodPaths.push([]);
            j++;
        }
        periodPaths[j].push(locations[i]);

    }


    return periodPaths;
}

export default getPeriodPaths;