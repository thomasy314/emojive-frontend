import backendConfig from "../config/backend.config";

function requestClientId(): Promise<string> {
    return new Promise((res, rej) => {
        fetch(backendConfig.HTTP_ENDPOINT + "/auth", {
            headers: {
                "accept": "application/json",
            }
        })
            .then(authResponse => {
                authResponse.json().then(clientIdResponse => {
                    res(clientIdResponse.clientId)
                });
            })
            .catch(rej)
    })
}

export {
    requestClientId
};
