import { Model } from "objection";
import cuid from "cuid";

import { createUser, createUserInGroup } from "./user";
import User from "./models/user/user.model";
import {
  addGroupMember,
  createGroup,
  hasGroupPrivilege,
  hasGroupChildrenPrivilege,
  whereAllPrivileges,
  whereSomePrivileges,
  Group,
} from "./group";

describe("DB", () => {
  beforeAll(async () => {
    await Model.knex().migrate.rollback();
    await Model.knex().migrate.latest();
  });
  afterAll(() => Model.knex().destroy());

  describe("group", () => {
    test("createGroup", async () => {
      const primary = await createGroup("Foo", { isPrimary: true });
      const child = await createGroup("Bar", {
        groupId: primary.id,
        privileges: { createGroup: true, addGroupMember: true },
      });
      const grandChild = await createGroup("Baz", {
        groupId: child.id,
        privileges: { addGroupMember: true },
      });
      const primaryGrandChild = await createGroup("Bar", {
        isPrimary: true,
        groupId: child.id,
        privileges: { addGroupMember: true },
      });

      expect(primary).toEqual({
        id: primary.id,
        name: "Foo",
        type: "organisation",
        isPrimary: true,
        privileges: "0",
        primaryGroupId: undefined,
      });
      expect(child).toEqual({
        id: child.id,
        name: "Bar",
        type: "team",
        groupId: primary.id,
        primaryGroupId: primary.id,
        isPrimary: false,
        privileges: "10100000",
      });
      expect(grandChild).toEqual({
        id: grandChild.id,
        name: "Baz",
        type: "team",
        groupId: child.id,
        primaryGroupId: primary.id,
        isPrimary: false,
        privileges: "10000000",
      });
      expect(primaryGrandChild).toEqual({
        id: primaryGrandChild.id,
        name: "Bar",
        type: "team",
        groupId: child.id,
        primaryGroupId: primary.id,
        isPrimary: true,
        privileges: "0",
      });
    });

    test("addGroupMember", async () => {
      const email = `jason+${cuid()}@lecstor.com`;
      const group = await createGroup("Foo", {
        type: "organisation",
        isPrimary: true,
      });
      const user = await createUser({ email });
      const memberCount = await addGroupMember({
        groupId: group.id,
        userId: user.id,
      });
      expect(memberCount).toEqual(1);
      const members = await group
        .$relatedQuery("members")
        .withGraphFetched("emails");
      const nUser = members[0] as User;
      expect(nUser.emails[0].email).toEqual(email);
    });

    describe("Privileges", () => {
      const memberEmail = `jason+member-${cuid()}@lecstor.com`;
      const ownerEmail = `jason+owner-${cuid()}@lecstor.com`;
      let primaryGroup: Group;
      let membersGroup: Group;
      let owner: User;
      let member: User;
      let childMembersGroup: Group;
      let grandchildMembersGroup: Group;
      let groups: Group[];

      beforeAll(async () => {
        primaryGroup = await createGroup("primary 1", { isPrimary: true });

        owner = await createUserInGroup({
          groupId: primaryGroup.id,
          user: { email: ownerEmail },
        });

        membersGroup = await createGroup("1 a", {
          groupId: primaryGroup.id,
          privileges: { addGroupMember: true },
        });

        member = await createUserInGroup({
          groupId: membersGroup.id,
          user: { email: memberEmail },
        });

        childMembersGroup = await createGroup("1 b", {
          groupId: membersGroup.id,
        });

        grandchildMembersGroup = await createGroup("1 c", {
          groupId: childMembersGroup.id,
        });

        groups = [
          primaryGroup,
          membersGroup,
          childMembersGroup,
          grandchildMembersGroup,
        ];
      });

      describe("hasGroupPrivilege", () => {
        test("owner has privilege on all groups", async () => {
          for (const group of groups) {
            expect(
              await hasGroupPrivilege({
                authUser: owner,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
            expect(
              await hasGroupChildrenPrivilege({
                authUser: owner,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
          }
        });

        test("member does not have privilege on primary or member's group", async () => {
          for (const group of [primaryGroup, membersGroup]) {
            expect(
              await hasGroupPrivilege({
                authUser: member,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeFalsy();
          }
        });

        test("member does not have privilege on children of primary group", async () => {
          expect(
            await hasGroupChildrenPrivilege({
              authUser: member,
              privilege: "addGroupMember",
              groupId: primaryGroup.id,
            })
          ).toBeFalsy();
        });

        test("member has privilege on child and grandchild of member's group", async () => {
          for (const group of [childMembersGroup, grandchildMembersGroup]) {
            expect(
              await hasGroupPrivilege({
                authUser: member,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
          }
        });

        test("member has privilege on children of member's group and their children", async () => {
          for (const group of [
            membersGroup,
            childMembersGroup,
            grandchildMembersGroup,
          ]) {
            expect(
              await hasGroupChildrenPrivilege({
                authUser: member,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
          }
        });
      });

      describe("search", () => {
        describe("whereAllPrivileges", () => {
          test("finds only group with all privileges", async () => {
            const primary = await createGroup("primary", { isPrimary: true });
            const group1 = await createGroup("g1", {
              groupId: primary.id,
              privileges: { addGroupMember: true, removeGroupMember: true },
            });
            const group2 = await createGroup("g2", {
              groupId: primary.id,
              privileges: { addGroupMember: true },
            });

            const groups = await whereAllPrivileges({
              addGroupMember: true,
              removeGroupMember: true,
            });

            expect(groups.find((g) => g.id === group1.id)).toBeDefined();
            expect(groups.find((g) => g.id === group2.id)).toBeUndefined();
          });
        });

        describe("whereSomePrivileges", () => {
          test("finds only groups with some and all privileges", async () => {
            const primary = await createGroup("primary", { isPrimary: true });
            const group1 = await createGroup("g1", {
              groupId: primary.id,
              privileges: { addGroupMember: true },
            });
            const group2 = await createGroup("g2", {
              groupId: primary.id,
              privileges: { addGroupMember: true, removeGroupMember: true },
            });
            const group3 = await createGroup("g3", {
              groupId: primary.id,
              privileges: { createGroup: true },
            });

            const groups = await whereSomePrivileges({
              addGroupMember: true,
              removeGroupMember: true,
            });

            expect(groups.find((g) => g.id === group1.id)).toBeDefined();
            expect(groups.find((g) => g.id === group2.id)).toBeDefined();
            expect(groups.find((g) => g.id === group3.id)).toBeUndefined();
          });

          test("finds groups with shorter bitstrings", async () => {
            const primary = await createGroup("primary", { isPrimary: true });
            const group1 = await createGroup("g1", {
              groupId: primary.id,
              privileges: { readGroup: true },
            });
            const group2 = await createGroup("g2", {
              groupId: primary.id,
              privileges: { deleteGroup: true },
            });

            const groups = await whereSomePrivileges({
              deleteGroup: true,
              removeGroupMember: true,
            });

            expect(groups.find((g) => g.id === group1.id)).toBeUndefined();
            expect(groups.find((g) => g.id === group2.id)).toBeDefined();
          });
        });
      });
    });
  });
});
