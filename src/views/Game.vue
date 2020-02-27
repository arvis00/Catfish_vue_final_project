<template>
  <div class="game">
    <div class="header">
      <BaseSlider
        class="sizeSlider"
        min="50"
        max="300"
        step="1"
        :value="sizeOfImg"
        padding="0"
        @input="setSizeOfImg"
        >Change size of cards:</BaseSlider
      >
      <div class="timePassedTimer">
        <div>{{ timePassedAfterFlip }}</div>
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
                    backgroundPosition: `${100/numberOfImg*index}% ${100/numberOfImg*index}%`
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
          <BaseButton class="bottomBtn" @click="nextImage">
            NEXT IMAGE
          </BaseButton>
          <BaseButton
            class="bottomBtn"
            :disabled="selectionCounter !== 2"
            @click="checkSelection"
          >
            CHECK
          </BaseButton>
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
      // toRememberImgArray: [],
      // toGuessImgArray: [],
      imageIndex: 0,
      // dataFetched: false,
      selectionCounter: 0,
      tempResult: 0,
      totalResult: 0,
      flipCards: false,
      gameLives: 3
    }
  },
  computed: {
    imageToGuessDisplayed () {
      return this.toGuessImgArray[this.imageIndex]
    },
    // timePassedConvToMin(){
    //   if(this.timePassedAfterFlip>60){
    //     this.timePassedAfterFlip
    //   }
    // },
    //     function str_pad_left(string,pad,length) {
    //     return (new Array(length+1).join(pad)+string).slice(-length);
    // }

    // this.finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
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
      setDataFetched: "setDataFetched",
      updateRememImgArray: "updateRememImgArray"
    }),
    ...mapActions({
      startTimerAfterFlip: "startTimerAfterFlip",
      startTimerAfterStart: "startTimerAfterStart",
      stopTimer: "stopTimer",
      fetchImages: "fetchImages"
    }),

    nextImage () {
      this.clearValues()
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
              guessed: true
            }
          }
          return storedImage
        })
        this.setToRememberImgArray(updatedRemArray)
        console.log(this.toRememberImgArray)
        this.totalResult += 2
      }
      this.tempResult = 0
      this.selectionCounter = 0
      const tempArray = this.toRememberImgArray.map(storedImage => {
        if (storedImage) {
          return {
            ...storedImage,
            selected: false
          }
        }
      })
      this.setToRememberImgArray(tempArray)
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
        if (storedImage) {
          return {
            ...storedImage,
            guessed: false
          }
        }
      })
      this.setToRememberImgArray(tempArray)
      this.gameLives = 3
      this.flipCards = false
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
    this.startTimerAfterStart()
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  // margin: 30px;
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
    margin-right: 167px;
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
          }
        }
        .selected {
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
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
  .imgListItem:hover {
    // transform: rotateX(-10deg);
  }
  .showImg {
    display: block;
    // visibility: visible;
    border-radius: 5px;
    // margin: 0;
  }
  .hideImg {
    display: none;
    // visibility: hidden;
    // position: absolute;
    // right: -1000px;
  }
  // .timerGame{
  //   z-index: -100;
  // }
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
      .bottomBtn {
        display: inline;
        margin: 10px;
        &.homeLink{
          text-decoration: none;
        }
      }
    }

    .taskImgContainer {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
