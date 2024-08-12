function loadEmojiDataFromURL<ResponseType>(url: string, responseProcessor: (response: any) => ResponseType): Promise<ResponseType> {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                response.json().then((jsonResponse: Object) => {
                    resolve(responseProcessor(jsonResponse))
                });
            })
            .catch(reason => {
                reject(reason);
            });
    });
}

export {
    loadEmojiDataFromURL
};
