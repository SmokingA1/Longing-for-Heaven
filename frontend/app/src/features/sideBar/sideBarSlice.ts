import { createSlice } from "@reduxjs/toolkit";
import { _NEVER } from "@reduxjs/toolkit/query";

interface UIState {
    sideBarOpen: boolean;
    sideCartOpen: boolean;
}


const initialState: UIState = {
    sideBarOpen: false,
    sideCartOpen: false,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSideBar: (state) => {
            state.sideBarOpen = !state.sideBarOpen;
        },
        openSideBar: (state) => {
            state.sideBarOpen = true;
        },
        closeSideBar: (state) => {
            state.sideBarOpen = false;
        },
        openSideCart: (state) => {
            state.sideCartOpen = true;
        },
        closeSideCart: (state) => {
            state.sideCartOpen = false;
        }
    }
})

export const {toggleSideBar, openSideBar, closeSideBar, openSideCart, closeSideCart} = uiSlice.actions;
export default uiSlice.reducer;