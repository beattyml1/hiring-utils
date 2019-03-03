export const loggedIn = (state) => !!state.user;
export const userId = (state) => state.user && state.user.uid;