import emojiveBackend from "@config/axios.config";

function useEmojive() {
  async function createUser(userName, languages, countryCode) {
    const newUserData = await emojiveBackend
      .post("/user/create", {
        userName,
        languages,
        countryCode,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });

    return newUserData;
  }

  return {
    createUser,
  };
}

export default useEmojive;
