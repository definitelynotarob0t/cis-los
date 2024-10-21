import axios from "axios";
import { Los } from "../types/types";
import tokenService from "./tokenService";
import { apiBaseUrl, apiPassword } from "../constants";

const losUrl = `${apiBaseUrl}/loses`;


const getLoses = async () => {
	const token = tokenService.getToken(); 
	const config = {
		headers: { Authorization: token, "x-api-password": apiPassword }
	};
	const response = await axios.get(losUrl, config);
	return response.data;
};


const getUserLoses = async (userId: number) => {
	try {
		const allLoses = await getLoses();
		// Filter loses by userId
		return allLoses.filter((los: Los) => los.userId === userId);
	} catch (error) {
		console.error("Failed to fetch user loses:", error);
	}
};

const getLos = async (id: number) => {
	const token = tokenService.getToken(); 

	const config = {
		headers: { Authorization: token, "x-api-password": apiPassword }
	};
	const response = await axios.get(`${losUrl}/${id}`, config);
	return response.data;
};


const updateLos = async (los: Los) => {
	const token = tokenService.getToken(); 

	const config = {
		headers: { Authorization: token }
	};

	const response = await axios.put(`${losUrl}/${los.id}`, los, config);

	return response.data;
};


const createLos = async (newLos: Omit<Los, "id">) => {
	const token = tokenService.getToken(); 

	const config = {
		headers: { Authorization: token }
	};
	const response = await axios.post(losUrl, newLos, config);
	return response.data;
};

const deleteLos = async (id: number) => {
	const token = tokenService.getToken(); 

	const config = {
		headers: { Authorization: token }
	};
	await axios.delete(`${losUrl}/${id}`, config);
};


export default { getLoses, getUserLoses, getLos, updateLos, createLos, deleteLos };