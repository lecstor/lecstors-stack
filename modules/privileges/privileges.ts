/**************************************************************************
ONLY APPEND TO THIS LIST - THE ORDER OF EXISTING ENTRIES MUST BE MAINTAINED
***************************************************************************
Unless of course you are happy to wipe the database.
In that case you can do what you like.

The entries in this array represent the bits in the privileges field of
group records in the database.

Each user inherits the privileges in the groups they are a member of and
all groups that are descendents of those groups. Privileges apply to users
and resources that are descendents of those groups.
***************************************************************************/

export type Privilege = {
  id: string;
  name: string;
  description: string;
};

export const PRIVILEGES: Privilege[] = [
  {
    id: "addNewUser",
    name: "Add New User",
    description: "Add a new user to a descendent group"
  },
  {
    id: "inviteNewUser",
    name: "Invite New User",
    description:
      "Invite a new user to join the organisation in a descendent group"
  },
  {
    id: "inviteGroupMember",
    name: "Invite Group Member",
    description: "Invite a user to join a descendent group"
  },
  {
    id: "deleteUser",
    name: "Delete User",
    description: "Delete users that are members of descendent groups"
  },
  {
    id: "viewResources",
    name: "View Resources",
    description: "View resources that are descendents of this group"
  },
  {
    id: "createGroup",
    name: "Create Group",
    description: "Create a group as a descendent of this group"
  },
  {
    id: "deleteGroup",
    name: "Delete Group",
    description: "Delete groupss that are descendents of this group"
  },
  {
    id: "addGroupMember",
    name: "Add Group Member",
    description: "Add a user to a descendent group"
  },
  {
    id: "removeGroupMember",
    name: "Remove Group Member",
    description: "Remove a user from a descendent group"
  },
  {
    id: "createTodo",
    name: "Create Todo",
    description: "Create a Todo"
  },
  {
    id: "deleteTodo",
    name: "Delete Todo",
    description: "Delete a Todo"
  },
  {
    id: "changeTodoStatus",
    name: "Change Todo Status",
    description: "Change the status of a Todo"
  },
  {
    id: "assignTodo",
    name: "Assign Todo",
    description: "Assign a Todo to a group"
  }
];
