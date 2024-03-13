import { createSlice } from "@reduxjs/toolkit";

/* let t = window.matchMedia("(prefers-color-scheme: dark)");
console.log("t: ", t);
console.log("t.matches: ", t.matches);
const prefersLightTheme = window.matchMedia("(prefers-color-scheme: light)");
if (prefersLightTheme.matches) {
  console.log("theme-l");
} else {
  console.log("theme-dark");
}
 */
const initialState = {
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

/* const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
      toggleTheme: (state) => {
        state.theme = state.theme === "light" ? "dark" : "light";
      },
    },
  }); */
export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
