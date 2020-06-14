import BitSet from "bitset";

import { PRIVILEGES, Privilege } from "./privileges";

const BIT_BASE = 2;

const privilegesIndexMap: { [priv: string]: number } = {};
export const privilegesKeys: { [priv: string]: string } = {};
PRIVILEGES.forEach((p, i) => {
  privilegesIndexMap[p.id] = i;
  privilegesKeys[p.id] = p.id;
});

export function setPrivilege(privileges: BitSet, privilege: string, on = true) {
  return privileges.set(privilegesIndexMap[privilege], on ? 1 : 0);
}

export function privilegesMapToBitSet(privs: PrivilegesMapInput) {
  const privileges = new BitSet();
  Object.keys(privs).forEach(p =>
    setPrivilege(privileges, p, Boolean(privs[p]))
  );
  return privileges;
}

// owner has full privileges
export const ownerPrivileges: { [priv: string]: Privilege } = {};
PRIVILEGES.forEach(p => (ownerPrivileges[p.id] = p));
export const ownerPrivilegesBitSet = privilegesMapToBitSet(ownerPrivileges);

export type PrivilegesMap = {
  [key in keyof typeof privilegesIndexMap]: Privilege;
};

export type PrivilegesMapInput = {
  [key in keyof typeof privilegesIndexMap]: Privilege | boolean;
};

export function bitSetToPrivilegesMap(bs: BitSet) {
  const privileges: PrivilegesMap = {};
  bs.toArray().forEach(idx => {
    privileges[PRIVILEGES[idx].id] = PRIVILEGES[idx];
  });
  return privileges;
}

export function bitSetToString(bs: BitSet) {
  return bs.toString(BIT_BASE);
}

export function stringToBitSet(bitString: string) {
  return new BitSet(bitString);
}

export function privilegesMapToString(privs: PrivilegesMapInput) {
  return bitSetToString(privilegesMapToBitSet(privs));
}

export function stringToPrivilegesMap(bitString: string) {
  return bitSetToPrivilegesMap(stringToBitSet(bitString));
}

export function combineBitSetsAnd(bitSets: BitSet[]) {
  return bitSets.reduce((final, bitSet) => final.and(bitSet), new BitSet());
}

export function combineBitSetsOr(bitSets: BitSet[]) {
  return bitSets.reduce((final, bitSet) => final.or(bitSet), new BitSet());
}

export function stringsToPrivileges(privileges: string[]) {
  const bitSets = privileges.map(p => stringToBitSet(p));
  return combineBitSetsOr(bitSets);
}

export function stringsToPrivilegesMap(privileges: string[]) {
  return bitSetToPrivilegesMap(stringsToPrivileges(privileges));
}
