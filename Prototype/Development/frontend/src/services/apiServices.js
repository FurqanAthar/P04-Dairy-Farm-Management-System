import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: '',
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
