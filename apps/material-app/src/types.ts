export type Privilege = {
  id: string;
  name: string;
  description: string;
};

export type Privileges = {
  [key: string]: Privilege;
};

export type Member = {
  id: string;
  firstname: string;
  surname: string;
  email: string;
};

export type Group = {
  id: string;
  name: string;
  type?: string;
  description?: string;
  isPrimary?: boolean;
  primaryGroup: Group;
  primaryGroupId: string;
  groupId?: string;
  privileges: Privileges;
  members: Member[];
};

export type GroupTreeNode = Group & { children: GroupTreeNode[] };

export type Credentials = {
  username: string;
  password: string;
};

export type UserDetails = {
  firstname: string;
  surname: string;
  email: string;
};

type AuthUser = {
  id: string;
  firstname: string;
  surname: string;
  groups: Group[];
};

export type Auth = {
  loggedIn: boolean;
  user: AuthUser;
};

export type AuthContext = {
  auth: Auth;
  // setAuth: React.Dispatch<React.SetStateAction<Auth>>;
  setAuth: (auth: Auth | null) => void;
  fetchUser: () => void;
};
