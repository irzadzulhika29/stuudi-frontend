import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    sidebarCollapsed: boolean;
    theme: "light" | "dark";
    modalOpen: string | null;
}

const initialState: UiState = {
    sidebarCollapsed: false,
    theme: "light",
    modalOpen: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebarCollapsed = action.payload;
        },
        setTheme: (state, action: PayloadAction<"light" | "dark">) => {
            state.theme = action.payload;
        },
        openModal: (state, action: PayloadAction<string>) => {
            state.modalOpen = action.payload;
        },
        closeModal: (state) => {
            state.modalOpen = null;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    openModal,
    closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;
