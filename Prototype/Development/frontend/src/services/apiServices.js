import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "",
  },
};

export const getAnimalData = async (id, token) => {
    config.headers.Authorization = token
    try {
        return await axios.get(`/animals/:${id}`, config)
    }
    catch(error) {
        return error
    }
}

export const addMilkRecord = async (data, token) => {
    config.headers.Authorization = token
    try {
        return await axios.post(`/farm/productions/add`, data, config);
    }
    catch(error) {
        return error
    }
}

export const getMilkProductionRecords = async (token) => {
    config.headers.Authorization = token
    try {
        return await axios.get(`/farm/productions`, config);
    }
    catch(error) {
        return error
    }
}

export const addTeamMember = async (data, token) => {
    config.headers.Authorization = token
    try {
        return await axios.post(`/farm/member/add`, data, config);
    }
    catch(error) {
        return error
    }
}

export const deleteTeamMember = async (data, token) => {
    config.headers.Authorization = token
    try {
        return await axios.post(`/farm/member/delete`, data, config);
    }
    catch(error) {
        return error
    }
}

export const deleteAnimal = async (data, token) => {
    config.headers.Authorization = token
    try {
        return await axios.post(`/farm/animals/delete`, data, config);
    }
    catch(error) {
        return error
    }
}

export const addWorker = async (data, token) => {
    config.headers.Authorization = token;
    try {
        return await axios.post(`/farm/worker/add`, data, config);
    }
    catch (error) {
        return error;
    }
}

export const editWorker = async (data, token) => {
	config.headers.Authorization = token;
	try {
		return await axios.put(`/farm/worker/edit`, data, config);
	}
	catch (error) {
		return error;
	}
}