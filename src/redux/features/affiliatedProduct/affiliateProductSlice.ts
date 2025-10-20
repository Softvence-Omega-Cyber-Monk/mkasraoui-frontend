import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";
import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";

interface AffiliateProductState {
  products: IAffiliatedProduct[];
}

const initialState: AffiliateProductState = {
  products: [],
};

const affiliateProductSlice = createSlice({
  name: "affiliateProduct",
  initialState,
  reducers: {
    setAffiliateProducts: (state, action: PayloadAction<IAffiliatedProduct[]>) => {
      state.products = action.payload;
    },
    addAffiliateProduct: (state, action: PayloadAction<IAffiliatedProduct>) => {
      state.products.push(action.payload);
    },
    updateAffiliateProduct: (state, action: PayloadAction<IAffiliatedProduct>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.products[index] = action.payload;
    },
    removeAffiliateProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setAffiliateProducts, addAffiliateProduct, updateAffiliateProduct, removeAffiliateProduct } = affiliateProductSlice.actions;

export default affiliateProductSlice.reducer;



// import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";
// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// interface AffiliateProductState {
//   products: IAffiliatedProduct[];
// }

// const initialState: AffiliateProductState = {
//   products: [],
// };

// const affiliateProductSlice = createSlice({
//   name: "affiliateProduct",
//   initialState,
//   reducers: {
//     setAffiliateProducts: (state, action: PayloadAction<IAffiliatedProduct[]>) => {
//       state.products = action.payload;
//     },
//     addAffiliateProduct: (state, action: PayloadAction<IAffiliatedProduct>) => {
//       state.products.push(action.payload);
//     },
//     updateAffiliateProduct: (state, action: PayloadAction<IAffiliatedProduct>) => {
//       const index = state.products.findIndex((p) => p.id === action.payload.id);
//       if (index !== -1) state.products[index] = action.payload;
//     },
//     removeAffiliateProduct: (state, action: PayloadAction<string>) => {
//       state.products = state.products.filter((p) => p.id !== action.payload);
//     },
//   },
// });

// export const {
//   setAffiliateProducts,
//   addAffiliateProduct,
//   updateAffiliateProduct,
//   removeAffiliateProduct,
// } = affiliateProductSlice.actions;

// export default affiliateProductSlice.reducer;
