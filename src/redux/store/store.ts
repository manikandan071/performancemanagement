import { configureStore, Store } from "@reduxjs/toolkit";
import HRGoalsSlice from "../slices/HRGoalsSlice";
import CommonSlice from "../slices/CommonSlice";

const store: Store = configureStore({
  reducer: {
    HRServiceData: HRGoalsSlice,
    CommonServiceData: CommonSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export { store };
