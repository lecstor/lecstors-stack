import React from "react";

import { useFetchGroup } from "./useFetchGroup";

export function GroupDetail({ groupId }: { groupId: string }) {
  const { fetching, group } = useFetchGroup({ groupId });

  if (fetching) return <div>Loading</div>;
  if (!group) return null;

  return (
    <div>
      Privileges:
      <ul>
        {Object.values(group.privileges).map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      {group.members ? (
        <div>
          Members:
          <ul>
            {group.members.map(m => (
              <li key={m.id}>
                {m.firstname} {m.surname} ({m.email})
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
