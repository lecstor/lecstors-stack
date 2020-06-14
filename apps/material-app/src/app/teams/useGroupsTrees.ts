import gql from "graphql-tag";
import { useQuery } from "urql";

import { GroupTreeNode } from "../../types";

export const groupsTreesGql = gql`
  query groupsTrees($groupIds: [String]) {
    groupsTrees(groupIds: $groupIds) {
      id
      name
      groupId
      privileges
    }
  }
`;

type Response = { groupsTrees: GroupTreeNode[][] };

export function useGroupsTrees(userGroupIds: string[]) {
  const [res] = useQuery<Response>({
    query: groupsTreesGql,
    variables: { groupIds: userGroupIds }
  });
  let groupsTrees;
  console.log(res.data);
  if (res.data?.groupsTrees) {
    // convert to nested tree
    groupsTrees = res.data.groupsTrees.map(groups => {
      if (groups === null) return null;
      const groupMap: { [key: string]: GroupTreeNode } = {};
      groups.forEach(group => {
        if (group !== null) {
          groupMap[group.id] = { ...group, children: [] };
        }
      });
      groups.forEach(group => {
        if (group !== null && group.groupId) {
          if (groupMap[group.groupId]) {
            groupMap[group.groupId].children.push(groupMap[group.id]);
          }
        }
      });
      return groupMap[groups[0].id];
    });
  }
  return { fetching: res.fetching, groupsTrees };
}
