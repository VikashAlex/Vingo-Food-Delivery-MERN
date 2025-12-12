import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    cityData:null
}
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setCityData: (state, action) => {
            state.cityData = action.payload
        }
    }
})
export const { setUserData,setCityData } = userSlice.actions;
export default  userSlice.reducer;