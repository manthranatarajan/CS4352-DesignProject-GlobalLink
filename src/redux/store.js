import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import imageReducer from './imageSlice';
import userReducer from './userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['images', 'users'], // Persist both images and users
};

const rootReducer = persistCombineReducers(persistConfig, {
  images: imageReducer,
  users: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'images/setProfilePicture',
          'images/addProjectImage'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.base64Image', 'register', 'rehydrate'],
        // Ignore these paths in the state
        ignoredPaths: ['images.profilePictures', 'images.projectImages'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
