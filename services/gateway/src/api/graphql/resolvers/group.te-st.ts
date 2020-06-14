import { ApolloServer, gql } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import cuid from "cuid";

import schema from "../schema";

import { createUserInGroup, getUser } from "../../../db/user";

import User from "../../../db/models/user/user.model";

import {
  ensureResourcePrivilege,
  ensureUserPrivilege,
  isAuthenticated
} from "./authorization";

jest.mock("./authorization", () => ({
  ensureResourcePrivilege: jest.fn(),
  ensureUserPrivilege: jest.fn(),
  isAuthenticated: jest.fn()
}));

jest.mock("../../../db/user", () => ({
  createUserInGroup: jest.fn(),
  getUser: jest.fn()
}));

const mockEnsureResourcePrivilege = ensureResourcePrivilege as jest.Mock<
  ReturnType<typeof ensureResourcePrivilege>
>;
const mockEnsureUserPrivilege = ensureUserPrivilege as jest.Mock<
  ReturnType<typeof ensureUserPrivilege>
>;
const mockIsAuthenticated = isAuthenticated as jest.Mock<
  ReturnType<typeof isAuthenticated>
>;

const mockCreateUserInGroup = createUserInGroup as jest.Mock<
  ReturnType<typeof createUserInGroup>
>;

const mockFindUser = getUser as jest.Mock<ReturnType<typeof getUser>>;

describe("Graphql", () => {
  describe("resolvers", () => {
    describe("user", () => {
      const authUser = User.fromJson({
        id: "93a85c15-5c08-4fcd-8c60-be413eb15e43"
      });
      const server = new ApolloServer({
        debug: true,
        schema,
        context: () => ({
          user: authUser
        })
      });
      const groupId = "51cbd90b-98d6-40f1-99d4-135914e73c98";
      const newUser = {
        id: "94982c1d-609c-4a77-ace7-88659650bfe6",
        groups: [{ id: groupId }]
      };

      test("user", async () => {
        mockFindUser.mockResolvedValue(User.fromJson(newUser));

        const { query } = createTestClient(server);

        const FIND_USER = gql`
          query user($userId: String) {
            user(userId: $userId) {
              id
            }
          }
        `;

        const res = await query({
          query: FIND_USER,
          variables: { userId: newUser.id }
        });

        expect(res.errors).toBeUndefined();
        expect(mockIsAuthenticated).toHaveBeenCalled();
        expect(mockFindUser).toHaveBeenCalledWith(newUser.id);
        expect(mockEnsureUserPrivilege).toHaveBeenCalledWith(
          authUser,
          [groupId],
          "viewUser"
        );
        expect(res.data.user.id).toEqual(newUser.id);
      });

      test("currentUser", async () => {
        mockFindUser.mockResolvedValue(User.fromJson(authUser));

        const { query } = createTestClient(server);

        const CURRENT_USER = gql`
          query currentUser {
            currentUser {
              id
            }
          }
        `;

        const res = await query({ query: CURRENT_USER });

        expect(res.errors).toBeUndefined();
        expect(mockIsAuthenticated).toHaveBeenCalled();
        expect(mockFindUser).toHaveBeenCalledWith(authUser.id);
        expect(res.data.currentUser.id).toEqual(authUser.id);
      });

      test("createUser", async () => {
        mockCreateUserInGroup.mockResolvedValue(User.fromJson(newUser));

        const CREATE_USER = gql`
          mutation createUser(
            $firstname: String
            $surname: String
            $email: String!
            $groupId: String!
          ) {
            createUser(
              firstname: $firstname
              surname: $surname
              email: $email
              groupId: $groupId
            ) {
              id
            }
          }
        `;
        const { mutate } = createTestClient(server);
        const email = `jason+${cuid()}@lecstor.com`;
        const res = await mutate({
          mutation: CREATE_USER,
          variables: {
            firstname: "Fred",
            surname: "Flintstone",
            email,
            groupId: groupId
          }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data.createUser.id).toEqual(newUser.id);
        expect(mockCreateUserInGroup).toHaveBeenCalledWith({
          groupId,
          user: {
            firstname: "Fred",
            surname: "Flintstone",
            email
          }
        });
        expect(mockIsAuthenticated).toHaveBeenCalled();
        expect(mockEnsureResourcePrivilege).toHaveBeenCalledWith(
          authUser,
          groupId,
          "createUser"
        );
      });
    });
  });
});
