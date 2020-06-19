import { Model } from "objection";
import cuid from "cuid";

import { createUser, createUserInGroup } from "./user";
import { createTodo } from "./todo";
import Todo from "./models/todo/todo.model";
import User from "./models/user/user.model";
import {
  addGroupMember,
  addGroupParent,
  createGroup,
  getWithChildren,
  getWithParents,
  userHasGroupPrivilege,
  userHasGroupChildrenPrivilege,
  userHasResourcePrivilege,
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
    describe("get recursive", () => {
      const gps: { [key: string]: Group } = {};
      let props: { [key: string]: unknown } = {};

      beforeAll(async () => {
        gps.primary = await createGroup("parent", { isPrimary: true });
        gps.child = await createGroup("c1", {
          parentId: gps.primary.id,
          privileges: { createGroup: true, addGroupMember: true },
        });
        gps.child2 = await createGroup("c2", {
          parentId: gps.child.id,
          privileges: { addGroupMember: true },
        });
        gps.child3 = await createGroup("c3", {
          parentId: gps.child2.id,
          privileges: { addGroupMember: true },
        });
        gps.child3b = await createGroup("c3b", {
          parentId: gps.child2.id,
          privileges: { addGroupMember: true },
        });
        gps.child4 = await createGroup("c4", {
          parentId: gps.child3.id,
          privileges: { addGroupMember: true },
        });
        gps.child4b = await createGroup("c4b", {
          parentId: gps.child3b.id,
          privileges: { addGroupMember: true },
        });
        gps.primaryGC = await createGroup("FooBar", {
          isPrimary: true,
          parentId: gps.child.id,
          privileges: { addGroupMember: true },
        });
        gps.child5 = await createGroup("c5", {
          parentId: gps.primaryGC.id,
          privileges: { addGroupMember: true },
        });

        props = {
          description: null,
          isPrimary: false,
          type: "team",
          primaryGroupId: gps.primary.id,
        };
      });

      describe("getWithChildren", () => {
        test("top primary", async () => {
          expect(await getWithChildren(gps.primary.id)).toEqual([
            {
              ...props,
              id: gps.primary.id,
              isPrimary: true,
              name: "parent",
              primaryGroupId: null,
              privileges: "0",
              type: "organisation",
            },
            { ...props, id: gps.child.id, name: "c1", privileges: "10100000" },
            {
              ...props,
              id: gps.child2.id,
              name: "c2",
              privileges: "10000000",
            },
            {
              ...props,
              id: gps.primaryGC.id,
              isPrimary: true,
              name: "FooBar",
              primaryGroupId: gps.primary.id,
              privileges: "0",
            },
            { ...props, id: gps.child3.id, name: "c3", privileges: "10000000" },
            {
              ...props,
              id: gps.child3b.id,
              name: "c3b",
              privileges: "10000000",
            },
            {
              ...props,
              id: gps.child5.id,
              name: "c5",
              primaryGroupId: gps.primaryGC.id,
              privileges: "10000000",
            },
            { ...props, id: gps.child4.id, name: "c4", privileges: "10000000" },
            {
              ...props,
              id: gps.child4b.id,
              name: "c4b",
              privileges: "10000000",
            },
          ]);
        });

        test("dual children", async () => {
          expect(
            await getWithChildren([gps.child3.id, gps.child3b.id])
          ).toEqual([
            { ...props, id: gps.child3.id, name: "c3", privileges: "10000000" },
            {
              ...props,
              id: gps.child3b.id,
              name: "c3b",
              privileges: "10000000",
            },
            { ...props, id: gps.child4.id, name: "c4", privileges: "10000000" },
            {
              ...props,
              id: gps.child4b.id,
              name: "c4b",
              privileges: "10000000",
            },
          ]);
        });

        test("last child", async () => {
          expect(await getWithChildren(gps.child4.id)).toEqual([
            { ...props, id: gps.child4.id, name: "c4", privileges: "10000000" },
          ]);
        });
      });

      describe("getWithParents", () => {
        test("top primary", async () => {
          expect(await getWithParents(gps.primary.id)).toEqual([
            {
              ...props,
              id: gps.primary.id,
              isPrimary: true,
              name: "parent",
              primaryGroupId: null,
              privileges: "0",
              type: "organisation",
            },
          ]);
        });
        test("first child", async () => {
          expect(await getWithParents(gps.child.id)).toEqual([
            { ...props, id: gps.child.id, name: "c1", privileges: "10100000" },
            {
              ...props,
              id: gps.primary.id,
              isPrimary: true,
              name: "parent",
              primaryGroupId: null,
              privileges: "0",
              type: "organisation",
            },
          ]);
        });
        test("fourth child", async () => {
          expect(await getWithParents(gps.child4.id)).toEqual([
            { ...props, id: gps.child4.id, name: "c4", privileges: "10000000" },
            {
              ...props,
              id: gps.child3.id,
              name: "c3",
              privileges: "10000000",
            },
            {
              ...props,
              id: gps.child2.id,
              name: "c2",
              privileges: "10000000",
            },
            {
              ...props,
              id: gps.child.id,
              name: "c1",
              privileges: "10100000",
            },
            {
              ...props,
              id: gps.primary.id,
              isPrimary: true,
              name: "parent",
              primaryGroupId: null,
              privileges: "0",
              type: "organisation",
            },
          ]);
        });
        test("dual fourth children", async () => {
          expect(await getWithParents([gps.child4.id, gps.child4b.id])).toEqual(
            [
              {
                ...props,
                id: gps.child4.id,
                name: "c4",
                privileges: "10000000",
              },
              {
                ...props,
                id: gps.child4b.id,
                name: "c4b",
                privileges: "10000000",
              },
              {
                ...props,
                id: gps.child3.id,
                name: "c3",
                privileges: "10000000",
              },
              {
                ...props,
                id: gps.child3b.id,
                name: "c3b",
                privileges: "10000000",
              },
              {
                ...props,
                id: gps.child2.id,
                name: "c2",
                privileges: "10000000",
              },
              {
                ...props,
                id: gps.child.id,
                name: "c1",
                privileges: "10100000",
              },
              {
                ...props,
                id: gps.primary.id,
                isPrimary: true,
                name: "parent",
                primaryGroupId: null,
                privileges: "0",
                type: "organisation",
              },
            ]
          );
        });
        test("child primary", async () => {
          expect(await getWithParents(gps.primaryGC.id)).toEqual([
            {
              ...props,
              id: gps.primaryGC.id,
              isPrimary: true,
              name: "FooBar",
              primaryGroupId: gps.primary.id,
              privileges: "0",
            },
            {
              ...props,
              id: gps.child.id,
              name: "c1",
              primaryGroupId: gps.primary.id,
              privileges: "10100000",
            },
            {
              ...props,
              id: gps.primary.id,
              isPrimary: true,
              name: "parent",
              primaryGroupId: null,
              privileges: "0",
              type: "organisation",
            },
          ]);
        });
        test("child of child primary", async () => {
          expect(await getWithParents(gps.child5.id)).toEqual([
            {
              ...props,
              id: gps.child5.id,
              name: "c5",
              primaryGroupId: gps.primaryGC.id,
              privileges: "10000000",
            },
            {
              ...props,
              id: gps.primaryGC.id,
              isPrimary: true,
              name: "FooBar",
              primaryGroupId: gps.primary.id,
              privileges: "0",
            },
            {
              ...props,
              id: gps.child.id,
              name: "c1",
              primaryGroupId: gps.primary.id,
              privileges: "10100000",
            },
            {
              ...props,
              id: gps.primary.id,
              isPrimary: true,
              name: "parent",
              primaryGroupId: null,
              privileges: "0",
              type: "organisation",
            },
          ]);
        });
      });
    });

    test("createGroup", async () => {
      const primary = await createGroup("Foo", { isPrimary: true });
      const child = await createGroup("Bar", {
        parentId: primary.id,
        privileges: { createGroup: true, addGroupMember: true },
      });
      const grandChild = await createGroup("Baz", {
        parentId: child.id,
        privileges: { addGroupMember: true },
      });
      const primaryGC = await createGroup("Bar", {
        isPrimary: true,
        parentId: child.id,
        privileges: { addGroupMember: true },
      });

      expect(primary).toEqual({
        id: primary.id,
        name: "Foo",
        type: "organisation",
        isPrimary: true,
        privileges: "0",
        // primaryGroupId: undefined,
        parents: [],
      });
      expect(child).toEqual({
        id: child.id,
        name: "Bar",
        type: "team",
        parents: [{ id: primary.id }],
        primaryGroupId: primary.id,
        isPrimary: false,
        privileges: "10100000",
      });
      expect(grandChild).toEqual({
        id: grandChild.id,
        name: "Baz",
        type: "team",
        parents: [{ id: child.id }],
        primaryGroupId: primary.id,
        isPrimary: false,
        privileges: "10000000",
      });
      expect(primaryGC).toEqual({
        id: primaryGC.id,
        name: "Bar",
        type: "team",
        parents: [{ id: child.id }],
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
      describe("hasGroup*Privilege", () => {
        const memberEmail = `jason+member-${cuid()}@lecstor.com`;
        const ownerEmail = `jason+owner-${cuid()}@lecstor.com`;
        let primaryGroup: Group;
        let membersGroup: Group;
        let owner: User;
        let manager: User;
        let childMembersGroup: Group;
        let grandchildMembersGroup: Group;
        let groups: Group[];

        beforeAll(async () => {
          primaryGroup = await createGroup("Organisation", { isPrimary: true });

          owner = await createUserInGroup({
            groupId: primaryGroup.id,
            user: { email: ownerEmail },
          });

          membersGroup = await createGroup("Managers", {
            parentId: primaryGroup.id,
            privileges: { addGroupMember: true },
          });

          manager = await createUserInGroup({
            groupId: membersGroup.id,
            user: { email: memberEmail },
          });

          childMembersGroup = await createGroup("1 b", {
            parentId: membersGroup.id,
          });

          grandchildMembersGroup = await createGroup("1 c", {
            parentId: childMembersGroup.id,
          });

          groups = [
            primaryGroup,
            membersGroup,
            childMembersGroup,
            grandchildMembersGroup,
          ];
        });

        test("owner has privilege on all groups", async () => {
          for (const group of groups) {
            expect(
              await userHasGroupPrivilege({
                authUser: owner,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
            expect(
              await userHasGroupChildrenPrivilege({
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
              await userHasGroupPrivilege({
                authUser: manager,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeFalsy();
          }
        });

        test("member does not have privilege on children of primary group", async () => {
          expect(
            await userHasGroupChildrenPrivilege({
              authUser: manager,
              privilege: "addGroupMember",
              groupId: primaryGroup.id,
            })
          ).toBeFalsy();
        });

        test("member has privilege on child and grandchild of member's group", async () => {
          for (const group of [childMembersGroup, grandchildMembersGroup]) {
            expect(
              await userHasGroupPrivilege({
                authUser: manager,
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
              await userHasGroupChildrenPrivilege({
                authUser: manager,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
          }
        });
      });

      describe("teams and resources", () => {
        const manager1Email = `jason+manager1-${cuid()}@lecstor.com`;
        const manager2Email = `jason+manager2-${cuid()}@lecstor.com`;
        const ownerEmail = `jason+owner-${cuid()}@lecstor.com`;
        let primaryGroup: Group;
        let managers1Group: Group;
        let managers2Group: Group;
        let owner: User;
        let manager1: User;
        let manager2: User;
        let resourcesGroup: Group;
        let groups: Group[];
        let todo: Todo;

        beforeAll(async () => {
          primaryGroup = await createGroup("Organisation", { isPrimary: true });

          owner = await createUserInGroup({
            groupId: primaryGroup.id,
            user: { email: ownerEmail },
          });

          managers1Group = await createGroup("Managers1", {
            parentId: primaryGroup.id,
            privileges: { addGroupMember: true },
          });

          managers2Group = await createGroup("Managers2", {
            parentId: primaryGroup.id,
            privileges: { removeGroupMember: true },
          });

          manager1 = await createUserInGroup({
            groupId: managers1Group.id,
            user: { email: manager1Email },
          });

          manager2 = await createUserInGroup({
            groupId: managers2Group.id,
            user: { email: manager2Email },
          });

          resourcesGroup = await createGroup("Todos", {
            parentId: managers1Group.id,
          });
          await addGroupParent(resourcesGroup.id, managers2Group.id);

          todo = await createTodo({
            name: "Feed the dog",
            groupId: resourcesGroup.id,
          });

          groups = [
            primaryGroup,
            managers1Group,
            managers2Group,
            resourcesGroup,
          ];
        });

        test("owner has privilege on all groups", async () => {
          for (const group of groups) {
            expect(
              await userHasGroupPrivilege({
                authUser: owner,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
            expect(
              await userHasGroupChildrenPrivilege({
                authUser: owner,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeTruthy();
          }
        });

        test("owner has privilege on all resources", async () => {
          expect(
            await userHasResourcePrivilege({
              authUser: owner,
              privilege: "addGroupMember",
              resource: todo,
            })
          ).toBeTruthy();
        });

        test("manager1 does not have privilege on primary group or manager groups", async () => {
          for (const group of [primaryGroup, managers1Group, managers2Group]) {
            expect(
              await userHasGroupPrivilege({
                authUser: manager1,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeFalsy();
            expect(
              await userHasGroupPrivilege({
                authUser: manager1,
                privilege: "removeGroupMember",
                groupId: group.id,
              })
            ).toBeFalsy();
          }
        });

        test("manager1 has addGroupMember privilege on resources group", async () => {
          expect(
            await userHasGroupPrivilege({
              authUser: manager1,
              privilege: "addGroupMember",
              groupId: resourcesGroup.id,
            })
          ).toBeTruthy();
          expect(
            await userHasResourcePrivilege({
              authUser: manager1,
              privilege: "addGroupMember",
              resource: todo,
            })
          ).toBeTruthy();
        });

        test("manager1 does not have removeGroupMember privilege on resources group", async () => {
          expect(
            await userHasGroupPrivilege({
              authUser: manager1,
              privilege: "removeGroupMember",
              groupId: resourcesGroup.id,
            })
          ).toBeFalsy();
          expect(
            await userHasResourcePrivilege({
              authUser: manager1,
              privilege: "removeGroupMember",
              resource: todo,
            })
          ).toBeFalsy();
        });

        test("manager2 does not have privilege on primary group or manager groups", async () => {
          for (const group of [primaryGroup, managers1Group, managers2Group]) {
            expect(
              await userHasGroupPrivilege({
                authUser: manager2,
                privilege: "addGroupMember",
                groupId: group.id,
              })
            ).toBeFalsy();
            expect(
              await userHasGroupPrivilege({
                authUser: manager2,
                privilege: "removeGroupMember",
                groupId: group.id,
              })
            ).toBeFalsy();
          }
        });

        test("manager2 has removeGroupMember privilege on resources group", async () => {
          expect(
            await userHasGroupPrivilege({
              authUser: manager2,
              privilege: "removeGroupMember",
              groupId: resourcesGroup.id,
            })
          ).toBeTruthy();
          expect(
            await userHasResourcePrivilege({
              authUser: manager2,
              privilege: "removeGroupMember",
              resource: todo,
            })
          ).toBeTruthy();
        });

        test("manager2 does not have addGroupMember privilege on resources group", async () => {
          expect(
            await userHasGroupPrivilege({
              authUser: manager2,
              privilege: "addGroupMember",
              groupId: resourcesGroup.id,
            })
          ).toBeFalsy();
          expect(
            await userHasResourcePrivilege({
              authUser: manager2,
              privilege: "addGroupMember",
              resource: todo,
            })
          ).toBeFalsy();
        });
      });

      describe("search", () => {
        describe("whereAllPrivileges", () => {
          test("finds only group with all privileges", async () => {
            const primary = await createGroup("primary", { isPrimary: true });
            const group1 = await createGroup("g1", {
              parentId: primary.id,
              privileges: { addGroupMember: true, removeGroupMember: true },
            });
            const group2 = await createGroup("g2", {
              parentId: primary.id,
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
              parentId: primary.id,
              privileges: { addGroupMember: true },
            });
            const group2 = await createGroup("g2", {
              parentId: primary.id,
              privileges: { addGroupMember: true, removeGroupMember: true },
            });
            const group3 = await createGroup("g3", {
              parentId: primary.id,
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
              parentId: primary.id,
              privileges: { readGroup: true },
            });
            const group2 = await createGroup("g2", {
              parentId: primary.id,
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
