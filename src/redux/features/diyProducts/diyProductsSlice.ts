import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DIYProduct } from "@/redux/types/diy.types";

interface DIYState {
    selectedProduct : DIYProduct | null;
}

const initialState: DIYState = {
    selectedProduct: null
}

const diyProductSlice = createSlice({
    name: "diy",
    initialState,
    reducers: {
        setSelectedProduct: (state, action: PayloadAction<DIYProduct | null>) => {
            state.selectedProduct = action.payload
        }
    }
})

export const { setSelectedProduct } = diyProductSlice.actions;
export default diyProductSlice.reducer;