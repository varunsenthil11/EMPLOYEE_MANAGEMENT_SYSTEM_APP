import axios from "axios";
const authfetch = axios.create({
    baseURL: 'http://192.168.106.156:2000'
  });
export default authfetch;