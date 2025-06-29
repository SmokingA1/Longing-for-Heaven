import { configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import uiReducer from "./features/sideBar/sideBarSlice";
import cartReducer from "./features/cart/cartSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'cart'], // какие редьюсеры сохранять
};

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  cart: cartReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Типы для useSelector и useDispatch (если TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
