import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageSize: import.meta.env.VITE_DEFAULT_PAGE_SIZE || 2,
};

const pageSizeSlice = createSlice({
  name: "pageSize",
  initialState,
  reducers: {
    changePageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
});

export const { changePageSize } = pageSizeSlice.actions;

export default pageSizeSlice.reducer;
