import axios from "axios"; // importing axios

// constant variable for the login user key used in local storage
export const LOGIN_USER_KEY = "BUDGET_NOTEBOOK_LOGIN_USER_KEY";

// variable to store the base URL for API requests
var baseURL;

// set the baseURL to a local development server
baseURL = "http://127.0.0.1:8000/";

// axios instance named 'api' with a specified base URL and headers
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// added a interceptor to handle requests before they are sent
api.interceptors.request.use(
  (config) => {
    // Check if the request requires a token
    if (config.requireToken) {
      // get user information from local storage
      const user = localStorage.getItem(LOGIN_USER_KEY)
        ? JSON.parse(localStorage.getItem(LOGIN_USER_KEY))
        : null;
      // Add the user's token to the request headers for authentication
      config.headers.common["Authorization"] = user.token;
    }
    return config;
  },
  // logs request errors to the console
  (err) => console.error(err)
);

// Add an interceptor to handle responses
api.interceptors.response.use(
  // If the response is successful, return the response data
  (response) => {
    return response.data;
  },
  // If the response status is not authorized or unsuccessful, remove user information from local storage
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem(LOGIN_USER_KEY);
    }
    // Reject the promise with the error
    return Promise.reject(error);
  }
);

// a class named 'API' to encapsulate methods for interacting with the backend API
export default class API {
    signUp = async (signUpBody) => {
        const formData = new FormData();
    
        for (const key in signUpBody) {
          formData.append(key, signUpBody[key]);
        }
    
        return api.post("/users/signup/", formData);
      };
    
      signIn = async (signInBody) => {
        const formData = new FormData();
        for (const key in signInBody) {
          formData.append(key, signInBody[key]);
        }
        return api.post("/users/signin/", formData);
      };
    
      updateProfile = async (updateProfileBody, id) => {
        const formData = new FormData();
        for (const key in updateProfileBody) {
          formData.append(key, updateProfileBody[key]);
        }
        return api.put(`/users/update/${id}/`, formData, { requireToken: true });
      };
    
      updateBudget = async (updateBudgetBody, id) => {
        const formData = new FormData();
        formData.append("budget", updateBudgetBody);
        return api.put(`/users/update/${id}/budget/`, formData, {
          requireToken: true,
        });
      };
    
      // Transactions
      getTransactions = (query) => {
        const { page } = query;
        return api.get("/transactions/", {
          params: { page },
          requireToken: true,
        });
      };
    
      addTransactions = (addTransactionBody) => {
        const formData = new FormData();
    
        for (const key in addTransactionBody) {
          formData.append(key, addTransactionBody[key]);
        }
    
        return api.post("/transactions/add/", formData, { requireToken: true });
      };
    
      updateTransactions = (updateTransactionBody, id) => {
        const formData = new FormData();
    
        for (const key in updateTransactionBody) {
          formData.append(key, updateTransactionBody[key]);
        }
    
        return api.put(`/transactions/update/${id}/`, formData, {
          requireToken: true,
        });
      };
    
      deleteTransactions = (id) => {
        return api.delete(`/transactions/delete/${id}/`, { requireToken: true });
      };
    
      getReportTransactions = async (params = {}) => {
        return api.get("/transactions/reports/", {
          params,
          requireToken: true,
        });
      };
    
      // Categories
      getCategories = () => {
        return api.get("/category/", {
          requireToken: true,
        });
      };
    
      getExpenseReport = () => {
        return api.get("/transactions/expense-reports/", {
          requireToken: true,
        });
      };
    
      getLast4MonthsReport = () => {
        return api.get("/transactions/reports/", {
          requireToken: true,
        });
      };
}
