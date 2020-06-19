import React from "react";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useAuth } from "../../auth/hooks";
import usePageTitle from "../../hooks/usePageTitle";

import { GroupTreeNode as GroupTreeNodeT } from "../../types";

import { useGroupsTrees } from "./useGroupsTrees";
// import { useFetchGroup } from "./use-fetch-group";
import { GroupDetail } from "./detail";

type GroupTreeNodeProps = {
  groupTree: GroupTreeNodeT;
};

const GroupTreeNode = ({ groupTree }: GroupTreeNodeProps) => {
  // const { fetchGroup } = useFetchGroup();
  // const [members, setMembers] = useState([]);

  // const onChange = groupId => (event, expanded) => {
  //   console.log(groupId, event, expanded);
  //   fetchGroup(groupId).then(group => {
  //     console.log({ group });
  //     // setMembers(group.data.group.members);
  //   });
  // };

  return (
    <>
      <Box pl={3}>
        <Box p={1} maxWidth={400}>
          <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              {groupTree.name}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <GroupDetail groupId={groupTree.id} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>
        {groupTree.children.length ? (
          <Box>
            {groupTree.children.map((gt) => (
              <GroupTreeNode key={gt.id} groupTree={gt} />
            ))}
          </Box>
        ) : null}
      </Box>
    </>
  );
};

const Teams = () => {
  usePageTitle("Teams");

  const { auth } = useAuth();
  const [group, setGroup] = React.useState(auth.user.groups[0].id);

  const { groupsTrees, fetching } = useGroupsTrees([group]);

  if (fetching) return null;

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGroup(event.target.value as string);
  };

  return (
    <>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={group}
        onChange={handleChange}
      >
        {auth.user?.groups.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.isPrimary ? g.name : `${g.primaryGroup.name} - ${g.name}`}
          </MenuItem>
        ))}
      </Select>
      {groupsTrees
        ? groupsTrees.map((gt) =>
            gt ? (
              <Box key={gt.id} p={1}>
                <GroupTreeNode groupTree={gt} />
              </Box>
            ) : null
          )
        : null}
    </>
  );
};

export default Teams;
