import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "",
  },
};

export const getAnimalData = async (id, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.get(`/farm/animals/${id}`, config);
  } catch (error) {
    return error;
  }
};

export const addMilkRecord = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/farm/productions/add`, data, config);
  } catch (error) {
    return error;
  }
};

export const updateMilkRecord = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/farm/productions/edit`, data, config);
  } catch (error) {
    return error;
  }
};

export const getMilkProductionRecords = async (token) => {
  config.headers.Authorization = token;
  try {
    return await axios.get(`/farm/productions`, config);
  } catch (error) {
    return error;
  }
};

export const addTeamMember = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/farm/member/add`, data, config);
  } catch (error) {
    return error;
  }
};

export const deleteTeamMember = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/farm/member/delete`, data, config);
  } catch (error) {
    return error;
  }
};

export const deleteAnimal = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/farm/animals/delete`, data, config);
  } catch (error) {
    return error;
  }
};

//Customer
export const getCustomerData = async (id, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.get(`/customer/${id}`, config);
  } catch (error) {
    return error;
  }
};
export const deleteCustomer = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/customer/delete`, data, config);
  } catch (error) {
    return error;
  }
};

export const addWorker = async (data, token) => {
  config.headers.Authorization = token;
  console.log(token);
  try {
    return await axios.post(`/farm/worker/add`, data, config);
  } catch (error) {
    return error;
  }
};

export const editWorker = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.put(`/farm/worker/edit`, data, config);
  } catch (error) {
    return error;
  }
};

export const addInventoryCategory = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/farm/inventory/category/add`, data, config);
  } catch (error) {
    return error;
  }
};

export const addInventoryItem = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/farm/inventory/item/add`, data, config);
  } catch (error) {
    return error;
  }
};

export const addItemTransaction = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(
      `/farm/inventory/item/transaction/add`,
      data,
      config
    );
  } catch (error) {
    return error;
  }
};

export const getItemTransactions = async (id, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.get(`/farm/inventory/item/${id}`, config);
  } catch (error) {
    return error;
  }
};

export const deleteItemTransaction = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(
      `/farm/inventory/item/transaction/delete`,
      data,
      config
    );
  } catch (error) {
    return error;
  }
};

export const addMilkSupply = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.post(`/record/supply/add`, data, config);
  } catch (error) {
    return error;
  }
};

export const getMilkSupply = async (token) => {
  config.headers.Authorization = token;
  try {
    return await axios.get(`/record/supply`, config);
  } catch (error) {
    return error;
  }
};

export const getMilkSupplyById = async (id, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.get(`/record/supply/${id}`, config);
  } catch (error) {
    return error;
  }
};

export const updateMilkSupplyById = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.put(`/record/supply/update`, data, config);
  } catch (error) {
    return error;
  }
};

export const updateRateList = async (data, token) => {
  config.headers.Authorization = token;
  try {
    return await axios.put(`/farm/miscellaneous/rate/update`, data, config);
  } catch (error) {
    return error;
  }
};

export const getRateList = async (token) => {
  config.headers.Authorization = token;
  try {
    return await axios.get(`/farm/miscellaneous/rate`, config);
  } catch (error) {
    return error;
  }
};

export const addInvoice = async(data, token) => {
  config.headers.Authorization = token;
  try {
    console.log("Here in API");
    return await axios.post(`/farm/expense/addInvoice`, data, config);
  } catch (error) {
    console.log("Here in api");
    console.log(error.message);
    return error.message;
  }
};
