/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";

interface HRGoalsServiceState {
  masterCycles: any[];
  userDetails: any[];
  rolesList: any[];
}

const mainData: HRGoalsServiceState = {
  masterCycles: [],
  userDetails: [],
  rolesList: [],
};

const HRGoalsServiceData = createSlice({
  name: "HRGoalsServiceData",
  initialState: mainData,
  reducers: {
    setMasterCycles: (state, action: PayloadAction<any[]>) => {
      state.masterCycles = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<any[]>) => {
      state.userDetails = action.payload;
    },
    setRolesList: (state, action: PayloadAction<any[]>) => {
      state.rolesList = action.payload;
    },
  },
});

export const { setMasterCycles, setUserDetails, setRolesList } =
  HRGoalsServiceData.actions;
export default HRGoalsServiceData.reducer as Reducer<HRGoalsServiceState>;
