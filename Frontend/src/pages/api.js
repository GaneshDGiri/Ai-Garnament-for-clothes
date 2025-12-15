import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 1. Fetch all products with filters
export const getProducts = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  try {
    const response = await axios.get(`${API_URL}/products?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// 2. Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};