import axios from "axios";
import tokenService from "./tokenService";
import { apiBaseUrl } from "../constants";

const loginUrl = `${apiBaseUrl}/login`;

const login = async (credentials: { email: string, password: string }) => {
	const response = await axios.post(loginUrl, credentials);
	return response.data;
};

const logout = () => {
	tokenService.clearToken();
};

export default { login, logout };
