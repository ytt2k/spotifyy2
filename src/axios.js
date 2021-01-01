import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("spotifyAuthToken");

let instance = axios.create({
  headers: {
    get: {
      Authorization: "Bearer " + token
    }
  }
});

export default instance;
