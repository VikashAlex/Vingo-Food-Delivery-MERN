import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    position: {
        longtude: null,
        latitude: null,
    },
    address: null

}
export const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {
        setPosition: (state, action) => {
            const { long, lati } = action.payload
            state.position.longtude = long
            state.position.latitude = lati
        },
        setAddress: (state, action) => {
            state.address = action.payload
        }

    }
})
export const { setPosition, setAddress } = mapSlice.actions;
export default mapSlice.reducer;