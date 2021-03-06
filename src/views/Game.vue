<template>
  <div class="game">
    <div class="header">
      <BaseSlider
        class="sizeSlider"
        min="50"
        max="300"
        step="1"
        :value="sizeOfImg"
        padding="0 10px"
        @input="setSizeOfImg"
        >Change size of cards:</BaseSlider
      >
      <div class="timePassedTimer">
        <div>{{ changeTimeFormat }}</div>
      </div>
      <div class="lives">
        <p>Tries left</p>
        {{ gameLives }}
      </div>
    </div>
    <div class="gameContent">
      <div class="imgToRememberContainer">
        <ul class="imageList" v-if="dataFetched">
          <li v-for="(image, index) in toRememberImgArray" :key="index">
            <div
              class="imgListItem"
              :style="{ height: sizeOfImg + 'px' }"
              :class="{
                imgListItemFlip: flipCards && !image.guessed,
                pointerEvent: !flipCards || image.guessed
              }"
              @click="selectAnswer(image, index)"
            >
              <div
                class="backCard"
                :style="{
                  height: sizeOfImg + 'px',
                  width: sizeOfImg + 'px',
                  transform: ' translateZ(' + sizeOfImg / 2 + 'px)'
                }"
              >
                <img
                  :src="
                    image.urls.raw +
                      '&fit=crop&w=' +
                      sizeOfImg +
                      '&h=' +
                      sizeOfImg
                  "
                />
              </div>
              <div
                class="frontCard"
                :style="{
                  height: sizeOfImg + 'px',
                  width: sizeOfImg + 'px',
                  transform:
                    'rotateX(-90deg) translateZ(-' + sizeOfImg / 2 + 'px)',
                  backgroundPosition: `${(100 / numberOfImg) * index}% ${(100 /
                    numberOfImg) *
                    index}%`
                }"
                :class="{
                  selected: image.selected
                }"
              ></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="selectImg">
        <div v-if="dataFetched" class="taskImgContainer">
          <div style="height: 200px">
            <Timer
              class="timerGame"
              :class="{ hideImg: flipCards, showImg: !flipCards }"
              @timerEnd="
                flipCards = true;
                startTimerAfterFlip();
              "
            ></Timer>
          </div>
          <img
            :class="{ showImg: flipCards, hideImg: !flipCards }"
            :src="imageToGuessDisplayed.urls.raw + '&fit=crop&w=200&h=200'"
            alt=""
          />
        </div>
        <div
          class="buttonContainer"
          :class="{ showBtn: flipCards, hideBtn: !flipCards }"
        >
          <div class="nextContainer">
            <BaseButton
              class="bottomBtn"
              v-if="selectionCounter !== 2"
              @click="nextImage"
            >
              NEXT IMAGE
            </BaseButton>

            <BaseButton
              v-if="selectionCounter === 2"
              class="bottomBtn"
              :disabled="selectionCounter !== 2"
              @click="checkSelection"
            >
              CHECK
            </BaseButton>
          </div>
          <div class="otherBtnContainer">
            <BaseButton class="bottomBtn" @click="resetGame">
              RESET GAME
            </BaseButton>
            <router-link to="/" class="homeLink">
              <BaseButton class="bottomBtn">
                HOME
              </BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseButton from "@/components/BaseButton"
import Timer from "@/components/Timer"
import BaseSlider from "@/components/BaseSlider"

import { mapGetters, mapMutations, mapActions } from "vuex"

export default {
  name: "Game",
  components: {
    BaseButton,
    Timer,
    BaseSlider
  },
  data () {
    return {
      imageIndex: 0,
      selectionCounter: 0,
      tempResult: 0,
      totalResult: 0,
      flipCards: false,
      gameLives: 3,
      itemsForMutating: {
        condition: [],
        change: []
      },
      timestamp: null
    }
  },
  computed: {
    imageToGuessDisplayed () {
      return this.toGuessImgArray[this.imageIndex]
    },
    changeTimeFormat () {
      const minutes = Math.floor(this.timePassedAfterFlip / 60)
      const seconds = this.timePassedAfterFlip % 60
      return `${this.makeTwoDigitTimer(minutes)}:${this.makeTwoDigitTimer(seconds)}`
    },
    ...mapGetters({
      numberOfImg: "numberOfImg",
      sizeOfImg: "sizeOfImg",
      timePassedAfterFlip: "timePassedAfterFlip",
      timerInterval: "timerInterval",
      gameMode: "gameMode",
      toRememberImgArray: "toRememberImgArray",
      toGuessImgArray: "toGuessImgArray",
      dataFetched: "dataFetched"
    })
  },
  watch: {
    totalResult: function () {
      if (this.toRememberImgArray.length === this.totalResult) {
        this.stopTimer()
        this.$router.push("/results")
      }
    }
  },
  methods: {
    ...mapMutations({
      setSizeOfImg: "setSizeOfImg",
      setToRememberImgArray: "setToRememberImgArray",
      setToGuessImgArray: "setToGuessImgArray",
      setDataFetched: "setDataFetched"
    }),
    ...mapActions({
      startTimerAfterFlip: "startTimerAfterFlip",
      startTimerAfterStart: "startTimerAfterStart",
      stopTimer: "stopTimer",
      fetchImages: "fetchImages"
    }),
    makeTwoDigitTimer (n) {
      return (n < 10 ? "0" : "") + n
    },
    nextImage () {
      if (this.tempResult === 2) {
        this.clearValues()
      } else {
        this.selectionCounter = 0
        const tempArray = this.toRememberImgArray.map(storedImage => {
          return {
            ...storedImage,
            selected: false
          }
        })
        this.setToRememberImgArray(tempArray)
      }
      if (
        this.imageIndex < this.toGuessImgArray.length - 1 &&
        !this.toGuessImgArray[this.imageIndex + 1].hidden
      ) {
        this.imageIndex += 1
      } else if (
        this.imageIndex < this.toGuessImgArray.length - 1 &&
        this.toGuessImgArray[this.imageIndex + 1].hidden
      ) {
        const result = this.toGuessImgArray.map(e => e.hidden)
        this.imageIndex = result.indexOf(false, this.imageIndex + 1)
      } else if (!this.toGuessImgArray[0].hidden) {
        this.imageIndex = 0
      } else {
        const result = this.toGuessImgArray.map(e => e.hidden)
        this.imageIndex = result.indexOf(false)
      }
      if (this.imageIndex === -1) {
        const result = this.toGuessImgArray.map(e => e.hidden)
        this.imageIndex = result.indexOf(false)
      }
    },
    selectAnswer (image, index) {
      const updatedArray = this.toRememberImgArray.map(
        (storedImage, indexMap) => {
          if (
            index === indexMap &&
            this.selectionCounter <= 1 &&
            !storedImage.selected
          ) {
            this.selectionCounter += 1
            return {
              ...storedImage,
              selected: true
            }
          }
          if (storedImage.selected && index !== indexMap) {
            return storedImage
          }
          if (storedImage.selected && index === indexMap) {
            this.selectionCounter -= 1
            return {
              ...storedImage,
              selected: false
            }
          }
          return { ...storedImage, selected: false }
        }
      )
      this.setToRememberImgArray(updatedArray)
    },
    clearValues () {
      if (this.tempResult === 2) {
        const updatedGuessArray = this.toGuessImgArray.map(storedImage => {
          if (storedImage.id === this.imageToGuessDisplayed.id) {
            return {
              ...storedImage,
              hidden: true
            }
          }
          return storedImage
        })
        this.setToGuessImgArray(updatedGuessArray)
        const updatedRemArray = this.toRememberImgArray.map(storedImage => {
          if (storedImage.selected === true) {
            return {
              ...storedImage,
              guessed: true,
              selected: false
            }
          }
          return storedImage
        })
        this.setToRememberImgArray(updatedRemArray)
        console.log(this.toRememberImgArray)
        this.totalResult += 2
        this.tempResult = 0
        this.selectionCounter = 0
        const tempArray = this.toRememberImgArray.map(storedImage => {
          return {
            ...storedImage,
            selected: false
          }
        })
        this.setToRememberImgArray(tempArray)
      } else {
        // this.flipIncorrectCardsTemp();
        this.itemsForMutating.condition = ["selected", true]
        this.itemsForMutating.change = ["guessed"]
        this.mutateImgArray(
          true,
          this.toRememberImgArray,
          this.itemsForMutating
        )
        setTimeout(() => {
          // this.flipIncorrectCardsTemp();
          this.mutateImgArray(
            true,
            this.toRememberImgArray,
            this.itemsForMutating
          )

          this.tempResult = 0
          this.selectionCounter = 0
          const tempArray = this.toRememberImgArray.map(storedImage => {
            return {
              ...storedImage,
              selected: false
            }
          })
          this.setToRememberImgArray(tempArray)
        }, 600)
      }
    },
    // flipIncorrectCardsTemp () {
    //   console.log("timeout")

    //   const tempArray = this.toRememberImgArray.map(storedImage => {
    //     if (storedImage.selected === true && this.selectionCounter === 2) {
    //       return {
    //         ...storedImage,
    //         guessed: !storedImage.guessed
    //       }
    //     }
    //     return storedImage
    //   })
    //   this.setToRememberImgArray(tempArray)
    //   // const items = { condition: ["selected", true], change: ["guessed", false] }
    //   // this.mutateImgArray(this.toRememberImgArray, this.items)
    // },
    mutateImgArray (needIf, array, { condition, change }) {
      const tempArray = array.map(storedImage => {
        if (needIf ? storedImage[condition[0]] === condition[1] : true) {
          return {
            ...storedImage,
            [change[0]]: !storedImage[change[0]]
          }
        }
        return storedImage
      })
      if (array === this.toRememberImgArray) {
        this.setToRememberImgArray(tempArray)
      } else {
        this.setToGuessImgArray(tempArray)
      }
    },
    failedAttempt () {
      this.clearValues()
      this.gameLives = this.gameLives >= 0 && this.gameLives - 1
      if (this.gameLives < 0) {
        this.stopTimer()
        this.$router.push("/gameover")
      }
    },
    checkSelection () {
      this.toRememberImgArray.forEach(storedImage => {
        if (
          storedImage.selected &&
          storedImage.id === this.imageToGuessDisplayed.id
        ) {
          this.tempResult += 1
        }
      })
      this.tempResult === 2 ? this.nextImage() : this.failedAttempt()
    },
    resetGame () {
      this.clearValues()
      this.imageIndex = 0
      const tempArray = this.toRememberImgArray.map(storedImage => {
        return {
          ...storedImage,
          guessed: false
        }
      })
      this.setToRememberImgArray(tempArray)
      const updatedGuessArray = this.toGuessImgArray.map(storedImage => {
        return {
          ...storedImage,
          hidden: false
        }
      })
      this.setToGuessImgArray(updatedGuessArray)
      this.gameLives = 3
      this.flipCards = false
      this.totalResult = 0
      this.startTimerAfterStart()
    }
  },
  mounted () {
    // if (localStorage.getItem("toRememberImg")) {
    //   this.setToRememberImgArray(
    //     JSON.parse(localStorage.getItem("toRememberImg"))
    //   )
    //   const result = JSON.parse(localStorage.getItem("toGuessImg"))
    //   this.setDataFetched(true)
    //   this.setToGuessImgArray(
    //     result.map(storedImage => {
    //       return {
    //         ...storedImage,
    //         hidden: false
    //       }
    //     })
    //   )
    // }
    this.tempResult = 0
    this.selectionCounter = 0
    this.totalResult = 0
    this.imageIndex = 0
    this.resetGame()
    this.startTimerAfterStart()
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  background-color: #fff;
  padding: 0 160px;
  height: 100px;
  color: #ff6860;
  .lives {
    text-align: center;
    border: solid 5px #ff6860;
    height: 54px;
    margin: 18px 0;
    width: 100px;
    p {
      margin: 0;
    }
  }
  .sizeSlider {
    display: inline-block;
    padding: 0;
    border: solid 5px #ff6860;
    margin: 18px 0;
    width: 265px;
    p {
      margin: 0;
      color: #ff6860;
    }
  }
  .timePassedTimer {
    margin-right: 20px;
    border: solid 5px #ff6860;
    width: 100px;
    text-align: center;
    margin: 18px 0;
    height: 54px;
    margin-right: 188px;
    div {
      margin: 14px 0;
    }
  }
}
.gameContent {
  margin: 20px 140px;
  .imgToRememberContainer {
    display: flex;
    justify-content: center;
    .imageList {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      li {
        margin: 5px;
        .imgListItem {
          transition: transform 0.33s;
          transform-style: preserve-3d;
          .backCard {
            border-radius: 5px;
            img {
              border-radius: 5px;
            }
          }
          .frontCard {
            border-radius: 5px;
            background: url(../assets/cardBcg.jpg);
            &.selected {
              background: url(../assets/selector.jpg);
              background-size: cover;
            }
          }
        }
      }
    }
  }
  .pointerEvent {
    pointer-events: none;
  }
  .imgListItemFlip {
    transform: rotateX(90deg);
  }
  .showImg {
    display: block;
    border-radius: 5px;
  }
  .hideImg {
    display: none;
  }
  .showBtn {
    visibility: visible;
  }
  .hideBtn {
    visibility: hidden;
  }
  .selectImg {
    text-align: center;

    .buttonContainer {
      margin-top: 20px;
      display: flex;
      .nextContainer {
        width: 65%;
        text-align: right;
      }
      .otherBtnContainer {
        width: 50%;
        text-align: right;
        .homeLink {
          text-decoration: none;
        }
      }
      .bottomBtn {
        display: inline;
        margin: 10px;
      }
    }

    .taskImgContainer {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
