import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import { _NEVER } from "@reduxjs/toolkit/query";

interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    size_id: string;
    thumbnail: string;
    quantity: number;   
    product: {
        id: string,
        name: string,
        description: string,
        price: number,
        stock: number,
    }
    size: {
        id: string,
        name: string,
    }
}

interface CartState {
    cart_items: CartItem[];
}

const initialState: CartState = {
    cart_items: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        fillCart: (state, action: PayloadAction<CartItem[]>) => {
            state.cart_items = action.payload;
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.cart_items.push(action.payload);
        },
        incrementQTY: (state, action: PayloadAction<string>) => {
            // state.items = state.items.map((item) => item.id === action.payload ? { ...item, quantity: item.quantity + 1} : item ) //my
            const item = state.cart_items.find(item => item.id === action.payload);
            if (item && item.quantity < item.product.stock) {
                item.quantity += 1;
            }
        },
        decrementQTY: (state, action: PayloadAction<string>) => {
            const item = state.cart_items.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -=1;
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cart_items = state.cart_items.filter((cartItem) => cartItem.id != action.payload);
        },
        clearCart: (state) => {
            state.cart_items = [];
        }
    },
})

export const { fillCart, addToCart, incrementQTY, decrementQTY, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
