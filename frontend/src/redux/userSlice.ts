import { AuthUser } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserStateTypes {
  authUser: AuthUser | null;
  shareLink: string | null;
}

const initialState: UserStateTypes = {
  authUser: null,
  shareLink: null,
};
const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.authUser = action.payload;
    },
    setShareLink: (state, action: PayloadAction<string | null>) => {
      state.shareLink = action.payload;
    },
    removeShareLink: (state) => {
      state.shareLink = null;
    },
  },
});

export const { setAuthUser, setShareLink, removeShareLink } = userSlice.actions;
export default userSlice.reducer;
