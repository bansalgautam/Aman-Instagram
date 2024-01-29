import axios from "axios";
import store from "../redux/store";

import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";
import { setLoading, showToast } from "../redux/slices/appConfigslice";
import { TOAST_FAILURE } from "../App";

let baseURL = "https://insta-backend-wc4u.onrender.com/";
if (process.env.NODE_ENV === "production") {
  baseURL = process.env.REACT_APP_SERVER_URL;
}
export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

// --------------REQUEST INETERCEPTORS------------

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  store.dispatch(setLoading(true));

  return request;
});

// -------------------------RESPONSE INTERCEPTORS----------------
axiosClient.interceptors.response.use(
  async (response) => {
    store.dispatch(setLoading(false));
    const data = response.data;
    if (data.status === "ok") {
      return data;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;

    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );

    if (statusCode === 401 && !originalRequest._retry) {
      // means the access token has expired
      originalRequest._retry = true;

      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(`/auth/refresh`);

      if (response.data.status === "ok") {
        setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;

        const refreshedResponse = await axios(originalRequest);
        return refreshedResponse.data;
      } else {
        window.location.replace("/login", "_self");
        removeItem(KEY_ACCESS_TOKEN);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
  async (error) => {
    store.dispatch(setLoading(false));
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.message,
      })
    );
    return Promise.reject(error);
  }
);
