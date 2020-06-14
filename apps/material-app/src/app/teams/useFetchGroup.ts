import gql from "graphql-tag";
import { useQuery } from "urql";

import { stringToPrivilegesMap } from "@lecstor/privileges";

import { Group as GroupBase } from "../../types";

type Group = Pick<GroupBase, "id" | "name" | "members">;

type Response = { group: Group & { privileges: string } };

export const fetchGroupGql = gql`
  query group($groupId: String) {
    group(groupId: $groupId) {
      id
      name
      privileges
      members {
        id
        firstname
        surname
        email
      }
    }
  }
`;

export function useFetchGroup({ groupId }: { groupId: string }) {
  const [res] = useQuery<Response>({
    query: fetchGroupGql,
    variables: { groupId }
  });
  const group = res.data?.group;
  return {
    group: group
      ? {
          ...group,
          privileges: group.privileges
            ? stringToPrivilegesMap(group.privileges)
            : {}
        }
      : undefined,
    ...res
  };
}
