import axios from "axios";

export const request = axios.create({
  baseURL: "https://mern-blog-webstie-fullstack.onrender.com",
});
