import { createSlice } from "@reduxjs/toolkit"
import { ui } from "./ui"
import { API_START_URL, API_ACTION_URL } from "../utils/urls"

export const game = createSlice({
  name: "game",
  initialState: {
    player: null,
    currentPosition: null,
    history: [],
    previousStep: [],
  },
  reducers: {
    setPlayer: (store, action) => {
      store.player = action.payload
    },

    setCurrentPosition: (store, action) => {
      store.currentPosition = action.payload
    },

    setHistory: (store, action) => {
      // Here you need to continue to work on implementing the "go back" logic
      // what should happen with the array when a user goes back a step?
      if (store.currentPosition) {
        store.previousStep = store.history[store.history.length - 1]
        store.history = [...store.history, action.payload]
      }
    },
  },
})

export const fetchStartPosition = () => {
  return (dispatch, getState) => {
    // const state = getState()
    dispatch(ui.actions.setLoading(true))
    fetch(API_START_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: getState().game.player }),
    })
      .then((res) => res.json())
      .then((data) => dispatch(game.actions.setCurrentPosition(data)))
      .finally(() => dispatch(ui.actions.setLoading(false)))
  }
}

export const nextStep = (type, direction) => {
  return (dispatch, getState) => {
    dispatch(ui.actions.setLoading(true))
    fetch(API_ACTION_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: getState().game.player,
        type,
        direction,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(game.actions.setCurrentPosition(data))
        dispatch(game.actions.setHistory(data))
      })
      .finally(() => dispatch(ui.actions.setLoading(false)))
  }
}
