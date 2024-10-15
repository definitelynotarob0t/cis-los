let token: string | null = null;

const tokenService = {
	setToken: (userToken: string) => {
		token = `Bearer ${userToken}`;
		// Store token in sessionStorage for persistence across reloads
		sessionStorage.setItem("token", token); 
	},
	getToken: () => {
		// First check if the token is in memory, otherwise retrieve it from sessionStorage
		if (!token) {
			token = sessionStorage.getItem("token"); // Fetch from sessionStorage if not in memory
		}
		return token;
	},
	clearToken: () => {
		token = null;
		sessionStorage.clear(); // Clear from sessionStorage on logout
	}
};

export default tokenService;
