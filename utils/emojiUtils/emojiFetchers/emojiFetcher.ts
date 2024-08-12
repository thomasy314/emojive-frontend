/**
 * Given a url and a response processor,
 * the function makes a request to fetch emoji metadata
 * and convert it into a desired format
 * @param {string} url the url containing emoji metadata
 * @param {Function} responseProcessor function that takes response from fetch request and formats it into desired output
 * @returns {Promise<ResponseType>} a promise containing the fetched emoji metadata
 */
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
