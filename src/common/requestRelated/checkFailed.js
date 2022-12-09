function checkFailed (then) {
    return function (responses) {
        const someFailed = responses.some(response => response.error)
        if (someFailed) {
            throw responses
        }
        return then(responses)
    }
}

export default checkFailed;