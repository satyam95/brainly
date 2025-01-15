import { AuthUser } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserStateTypes {
  authUser: AuthUser | null;
}

const initialState: UserStateTypes = {
  authUser: null,
};
const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.authUser = action.payload;
    },
  },
});

export const { setAuthUser } = userSlice.actions;
export default userSlice.reducer;
