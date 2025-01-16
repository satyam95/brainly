import { Content } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContentsStateTypes {
  userContents: Content[] | null;
}

const initialState: ContentsStateTypes = {
  userContents: null,
};

const contentsSlice = createSlice({
  name: "Contents",
  initialState,
  reducers: {
    setUserContents: (state, action: PayloadAction<Content[] | null>) => {
      state.userContents = action.payload;
    },
    addUserContent: (state, action: PayloadAction<Content>) => {
      if (state.userContents) {
        state.userContents = [...state.userContents, action.payload];
      } else {
        state.userContents = [action.payload];
      }
    },
  },
});

export const { setUserContents, addUserContent } = contentsSlice.actions;
export default contentsSlice.reducer;
