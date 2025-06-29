import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import { _NEVER } from "@reduxjs/toolkit/query";


interface ProductImage {
    id: string;
    product_id: string;
    photo_url: string;
}

interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    price: number;
    quantity: number;   
    product: {
        id: string,
        name: string,
        stock: number,
        images: ProductImage[]
    }
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        fillCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.items.push(action.payload);
        },
        incrementQTY: (state, action: PayloadAction<string>) => {
            // state.items = state.items.map((item) => item.id === action.payload ? { ...item, quantity: item.quantity + 1} : item ) //my
            const item = state.items.find(item => item.id === action.payload);
            if (item && item.quantity < item.product.stock) {
                item.quantity += 1;
            }
        },
        decrementQTY: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -=1;
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((cartItem) => cartItem.id != action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
})

export const { fillCart, addToCart, incrementQTY, decrementQTY, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
