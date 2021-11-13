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
