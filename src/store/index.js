import axios from "@/axios"
import shuffle from "lodash.shuffle"

let time = null

export default {
  strict: process.env.NODE_ENV === "development",
  state: () => ({
    numberOfImg: "10",
    timePassedAfterStart: 0,
    timePassedAfterFlip: 0,
    timerInterval: null,
    sizeOfImg: "100",
    gameMode: null,
    searchValue: null,
    toRememberImgArray: [],
    toGuessImgArray: [],
    dataFetched: false

  }),
  getters: {
    numberOfImg: state => {
      return state.numberOfImg
    },
    timePassedAfterStart: state => {
      return state.timePassedAfterStart
    },
    timePassedAfterFlip: state => {
      return state.timePassedAfterFlip
    },
    timerInterval: state => {
      return state.timerInterval
    },
    sizeOfImg: state => {
      return state.sizeOfImg
    },
    gameMode: state => {
      return state.gameMode
    },
    searchValue: state => {
      return state.searchValue
    },
    toRememberImgArray: state => {
      return state.toRememberImgArray
    },
    toGuessImgArray: state => {
      return state.toGuessImgArray
    },
    dataFetched: state => {
      return state.dataFetched
    }
  },
  mutations: {
    setNumberOfImg (state, number) {
      state.numberOfImg = number
    },
    setStartTimer (state, payload) {
      state.timerInterval = payload
    },
    setTimePassedAfterStart (state, payload) {
      payload === 1 ? (state.timePassedAfterStart += 1) : (state.timePassedAfterStart = 0)
    },
    setTimePassedAfterFlip (state, payload) {
      payload === 1 ? (state.timePassedAfterFlip += 1) : (state.timePassedAfterFlip = 0)
    },
    setSizeOfImg (state, number) {
      state.sizeOfImg = number
    },
    setSearchValue (state, payload) {
      state.searchValue = payload
    },
    setGameMode (state, mode) {
      console.log("setGameMode")

      if (mode === "random") {
        state.gameMode = `/photos/random?client_id=KdhCvP8tXfN1Byw49YkwKeDjHe5oa8fpZS2YGgmTYIM&count=${state.numberOfImg}`
      } else if (mode === "search") {
        state.gameMode = `/photos/random?client_id=KdhCvP8tXfN1Byw49YkwKeDjHe5oa8fpZS2YGgmTYIM&count=${state.numberOfImg}&query=${state.searchValue}`
      }
    },
    setToRememberImgArray (state, data) {
      state.toRememberImgArray = data
    },
    updateRememImgArray (state, { property, value }) {
      state.toRememberImgArray.forEach(storedImage => {
        storedImage[property] = value
      })
    },
    setToGuessImgArray (state, data) {
      state.toGuessImgArray = data
    },
    setDataFetched (state, payload) {
      state.dataFetched = payload
    }
  },
  actions: {
    startTimerAfterStart ({ dispatch, commit }) {
      console.log("run")

      dispatch("stopTimer")
      commit("setTimePassedAfterStart", 0)
      commit("setTimePassedAfterFlip", 0)
      time = setInterval(() => commit("setTimePassedAfterStart", 1), 1000)
      commit("setStartTimer", time)
    },
    startTimerAfterFlip ({ dispatch, commit }) {
      console.log("run")

      dispatch("stopTimer")
      commit("setTimePassedAfterFlip", 0)
      time = setInterval(() => commit("setTimePassedAfterFlip", 1), 1000)
      commit("setStartTimer", time)
    },
    stopTimer () {
      clearInterval(time)
    },
    passGameMode ({ commit }, mode) {
      commit("setGameMode", mode)
    },
    passSearchValue ({ commit }, value) {
      commit("setSearchValue", value)
    },
    async fetchImages ({ state, commit, dispatch }) {
      try {
        const { data } = await axios.get(state.gameMode)
        console.log(data)
        const splitArray = data.splice(state.numberOfImg / 2)
        commit("setToRememberImgArray", shuffle([...data, ...data]))
        commit("setToGuessImgArray", shuffle([...data, ...splitArray]))
        commit("setDataFetched", "true")
        commit("setToGuessImgArray", state.toGuessImgArray.map(storedImage => {
          return {
            ...storedImage,
            hidden: false
          }
        }))
        // dispatch("saveInfo") // localstorage turned off
        return true
      } catch (error) {
        return false
        // console.log("error", error)

        // throw error
      }
    },
    saveInfo ({ state }) {
      const parsed = JSON.stringify(state.toGuessImgArray)
      localStorage.setItem("toGuessImg", parsed)
      const parsed2 = JSON.stringify(state.toRememberImgArray)
      localStorage.setItem("toRememberImg", parsed2)
    }
  }
}
