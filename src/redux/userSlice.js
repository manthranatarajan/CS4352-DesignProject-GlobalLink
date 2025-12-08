import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    currentUser: null, // Currently logged-in user's full name
    credentials: {}, // { username: password }
    profiles: {}, // { fullName: profileObject }
    fullNameMap: {}, // { username: fullName } for login lookup
  },
  reducers: {
    // Set the currently logged-in user
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    
    // Clear current user (logout)
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    
    // Save user credentials (username/password)
    setCredentials: (state, action) => {
      const { username, password } = action.payload;
      state.credentials[username] = password;
    },
    
    // Save user profile
    setProfile: (state, action) => {
      const { fullName, profile } = action.payload;
      state.profiles[fullName] = profile;
    },
    
    // Update specific profile fields
    updateProfile: (state, action) => {
      const { fullName, updates } = action.payload;
      if (state.profiles[fullName]) {
        state.profiles[fullName] = { ...state.profiles[fullName], ...updates };
      }
    },
    
    // Map username to full name
    setFullNameMapping: (state, action) => {
      const { username, fullName } = action.payload;
      state.fullNameMap[username] = fullName;
    },
    
    // Add a friend request
    addFriendRequest: (state, action) => {
      const { targetUser, fromUser } = action.payload;
      if (state.profiles[targetUser]) {
        if (!state.profiles[targetUser].pendingRequests) {
          state.profiles[targetUser].pendingRequests = [];
        }
        if (!state.profiles[targetUser].pendingRequests.includes(fromUser)) {
          state.profiles[targetUser].pendingRequests.push(fromUser);
        }
      }
    },
    
    // Follow an employer
    followEmployer: (state, action) => {
      const { fullName, employer } = action.payload;
      if (state.profiles[fullName]) {
        if (!state.profiles[fullName].followedEmployers) {
          state.profiles[fullName].followedEmployers = [];
        }
        if (!state.profiles[fullName].followedEmployers.includes(employer)) {
          state.profiles[fullName].followedEmployers.push(employer);
        }
      }
    },
    
    // Unfollow an employer
    unfollowEmployer: (state, action) => {
      const { fullName, employer } = action.payload;
      if (state.profiles[fullName] && state.profiles[fullName].followedEmployers) {
        state.profiles[fullName].followedEmployers = 
          state.profiles[fullName].followedEmployers.filter(e => e !== employer);
      }
    },
    
    // Delete user completely
    deleteUser: (state, action) => {
      const { fullName, username } = action.payload;
      delete state.profiles[fullName];
      if (username) {
        delete state.credentials[username];
        delete state.fullNameMap[username];
      }
      if (state.currentUser === fullName) {
        state.currentUser = null;
      }
    },
  },
});

export const {
  setCurrentUser,
  clearCurrentUser,
  setCredentials,
  setProfile,
  updateProfile,
  setFullNameMapping,
  addFriendRequest,
  followEmployer,
  unfollowEmployer,
  deleteUser,
} = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectCurrentUserProfile = (state) => 
  state.users.currentUser ? state.users.profiles[state.users.currentUser] : null;
export const selectProfile = (fullName) => (state) => state.users.profiles[fullName];
export const selectAllProfiles = (state) => state.users.profiles;
export const selectCredentials = (state) => state.users.credentials;
export const selectFullNameMap = (state) => state.users.fullNameMap;

export default userSlice.reducer;
