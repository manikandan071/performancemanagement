/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";

interface CommonServiceState {
  currentUserDetails: any;
}

const mainData: CommonServiceState = {
  currentUserDetails: {},
};

const CommonServiceData = createSlice({
  name: "CommonServiceData",
  initialState: mainData,
  reducers: {
    setCurrentUserDetails: (state, action: PayloadAction<any>) => {
      state.currentUserDetails = action.payload;
    },
  },
});

export const { setCurrentUserDetails } = CommonServiceData.actions;
export default CommonServiceData.reducer as Reducer<CommonServiceState>;
