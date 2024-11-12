/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";

interface CommonServiceState {
  currentUserDetails: any;
  assignToUserDetails: any;
}

const mainData: CommonServiceState = {
  currentUserDetails: {},
  assignToUserDetails: {},
};

const CommonServiceData = createSlice({
  name: "CommonServiceData",
  initialState: mainData,
  reducers: {
    setCurrentUserDetails: (state, action: PayloadAction<any>) => {
      state.currentUserDetails = action.payload;
    },
    setAssignToUserDetails: (state, action: PayloadAction<any>) => {
      state.assignToUserDetails = action.payload;
    },
  },
});

export const { setCurrentUserDetails, setAssignToUserDetails } =
  CommonServiceData.actions;
export default CommonServiceData.reducer as Reducer<CommonServiceState>;
