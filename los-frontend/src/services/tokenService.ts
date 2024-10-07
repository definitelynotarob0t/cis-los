let token: string | null = null;

const setToken = (userToken: string) => {
  token = `Bearer ${userToken}`;
}

const getToken = () => token;

export default { setToken, getToken }