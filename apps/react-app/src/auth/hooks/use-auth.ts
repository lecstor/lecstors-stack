import { useContext } from "react";

import { authContext, AuthContext } from "../provider";

const useAuth = (): AuthContext => useContext(authContext);

export default useAuth;
