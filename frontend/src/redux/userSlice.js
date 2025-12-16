import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    cityData: null,
    myCityShop: null,
    itemData: null,
    cartItems: []
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
        },
        setMyCityShop: (state, action) => {
            state.myCityShop = action.payload
        },
        setItemData: (state, action) => {
            state.itemData = action.payload
        },
        addToCart: (state, action) => {
            const cartItem = action.payload;
            const extingItem = state.cartItems.find((item) => item.id == cartItem.id);
            if (extingItem) {
                extingItem.qnty +=cartItem.qnty
            } else {
                state.cartItems.push(cartItem)
            }
        }
    }
})
export const { setUserData, setCityData, setMyCityShop, setItemData, addToCart } = userSlice.actions;
export default userSlice.reducer;