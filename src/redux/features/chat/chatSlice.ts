// import { createSlice } from "@reduxjs/toolkit"
// import { chatApi } from "./chatApi"

// const initialState = {
//   socket: null,
//   activeConversation: null,
//   userId: null,
//   connected: false,
//   searchQuery: "",
//   filteredContacts: [],
//   tempMessages: [], // For optimistic updates
// }

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     setSocket: (state, action) => {
//       state.socket = action.payload
//     },
//     setConnected: (state, action) => {
//       state.connected = action.payload
//     },
//     setUserId: (state, action) => {
//       state.userId = action.payload
//     },
//     setActiveConversation: (state, action) => {
//       state.activeConversation = action.payload
//     },
//     setSearchQuery: (state, action) => {
//       state.searchQuery = action.payload
//     },
//     setFilteredContacts: (state, action) => {
//       state.filteredContacts = action.payload
//     },
//     addTempMessage: (state, action) => {
//       state.tempMessages.push(action.payload)
//     },
//     removeTempMessage: (state, action) => {
//       state.tempMessages = state.tempMessages.filter((msg) => msg.id !== action.payload)
//     },
//     disconnectSocket: (state) => {
//       if (state.socket) {
//         state.socket.disconnect()
//       }
//       state.socket = null
//       state.connected = false
//     },
//   },
//   extraReducers: (builder) => {
//     // Handle RTK Query cache updates from socket events
//     builder.addMatcher(chatApi.endpoints.startConversation.matchFulfilled, (state, action) => {
//       state.activeConversation = action.payload
//     })
//   },
// })

// export const {
//   setSocket,
//   setConnected,
//   setUserId,
//   setActiveConversation,
//   setSearchQuery,
//   setFilteredContacts,
//   addTempMessage,
//   removeTempMessage,
//   disconnectSocket,
// } = chatSlice.actions

// export default chatSlice.reducer
