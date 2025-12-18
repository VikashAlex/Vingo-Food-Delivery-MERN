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
                extingItem.qnty += cartItem.qnty
            } else {
                state.cartItems.push(cartItem)
            }
        },
        qntyHandel: (state, action) => {
            const { type, id } = action.payload;
            const item = state.cartItems.find((i) => i.id == id)
            if (type == "+") {
                item.qnty += 1
            } else {
                if (item.qnty > 1) {
                    item.qnty -= 1
                }
            }
        },
        removeToCart: (state, action) => {
            const id = action.payload;
            if (id) {
                state.cartItems = state.cartItems.filter((item) => item.id != id);
            }
        },
    }
})
export const { setUserData, setCityData, removeToCart, setMyCityShop, setItemData, addToCart, qntyHandel } = userSlice.actions;
export default userSlice.reducer;