// returns color by given id from list
const getAlmostUniqueColor = (index) => {
    const colorList = [
        'royalblue',
        'Crimson',
        'magenta',
        'Coral',
        'CornflowerBlue',
        'Cornsilk',
        'Cyan',
        'DarkTurquoise',
        'DarkViolet',
        'DeepPink',
        'DeepSkyBlue',
        'HotPink',
        'IndianRed',
        'purple',
        'Ivory',
        'hotpink',
        'indianred',
        'LavenderBlush',
        'MediumVioletRed',
        'MidnightBlue',
        'Fuchsia',
        'MistyRose'
    ]

    return colorList[index%colorList.length];
};

export default getAlmostUniqueColor;