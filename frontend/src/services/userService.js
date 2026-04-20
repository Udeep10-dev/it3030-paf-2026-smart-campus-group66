import axios from "../api/axios";

const userService = {
  getAssignableUsers: () => axios.get("/users/assignable"),
};

export default userService;
