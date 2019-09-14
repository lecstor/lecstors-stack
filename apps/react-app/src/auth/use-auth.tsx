import { useContext } from "react";

import authContext, { AuthContext } from "./context";

const useAuth = (): AuthContext => useContext(authContext);

export default useAuth;
