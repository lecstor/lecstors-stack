import BitSet from "bitset";

import {
  bitSetToPrivilegesMap,
  privilegesMapToBitSet,
  setPrivilege,
} from "./index";

describe("models", () => {
  describe("group", () => {
    describe("privileges", () => {
      test("bitSetToPrivilegesMap", () => {
        let bitSet = new BitSet();
        bitSet = setPrivilege(bitSet, "addGroupMember");
        bitSet = setPrivilege(bitSet, "createGroup");
        const map = bitSetToPrivilegesMap(bitSet);
        expect(map.addGroupMember).toBeTruthy();
        expect(map.createGroup).toBeTruthy();
      });

      test("privilegesMapToBitSet", () => {
        const bitSet = privilegesMapToBitSet({
          addGroupMember: true,
          viewResources: true,
        });
        expect(bitSet.get(4)).toEqual(1);
        expect(bitSet.get(7)).toEqual(1);
      });

      test("setPrivilege", () => {
        let bitSet = new BitSet();
        bitSet = setPrivilege(bitSet, "addGroupMember");
        expect(bitSet.toString()).toEqual("10000000");
      });
    });
  });
});
