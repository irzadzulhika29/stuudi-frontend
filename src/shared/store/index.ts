export { store, type RootState, type AppDispatch } from "./store";
export { useAppDispatch, useAppSelector } from "./hooks";
export { setUser, clearUser, setLoading } from "./slices/authSlice";
export {
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    openModal,
    closeModal,
} from "./slices/uiSlice";
