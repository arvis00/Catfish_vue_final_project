<template>
    <div class="start">
      <BaseBox
        class="startBox boxTitle"
        size="300"
        textFront="catfish"
      ></BaseBox>
      <BaseBox
        class="startBox boxRandom"
        size="300"
        textFront="RANDOM"
        textBack="START"
        BgColorFront="#434364"
        BgColorBack="#742854"
        @click="onClickRandom"
      >
      </BaseBox>
      <BaseBox
        class="startBox boxSearch"
        size="300"
        textFront="SEARCH"
        BgColorFront="#ff6860"
        BgColorBack="#D8AD4E"
        paddingCenterBack="0"
      >
        <form class="searchForm">
          <div class="inputContainer">
            <input
              class="startInput"
              type="text"
              v-model="value"
              :placeholder="
                errorMsg
                  ? 'Oops, nothing found. Try again'
                  : 'Search for photos'
              "
              @input="onInput"
            />
          </div>
          <BaseButton class="startBtn" type="submit" @click="onClickSearch"
            >SEARCH
          </BaseButton>
        </form>
      </BaseBox>
      <BaseBox
        class="startBox boxSize"
        size="300"
        textFront="SETTINGS"
        BgColorFront="rgb(23, 68, 116)"
        BgColorBack="#414141"
        paddingCenterBack="0"
        ><BaseSlider
        class="numberOfImgSelect"
          min="4"
          max="30"
          step="2"
          :value="numberOfImg"
          @input="setNumberOfImg"
          >Number of cards:
        </BaseSlider>
        <BaseSlider
        class="secondsToRemember"
          min="1"
          max="60"
          step="1"
          :value="secondsToRemember"
          @input="setSecondsToRemember"
          >Time to memorize:
        </BaseSlider>
      </BaseBox>
    <!-- <div id="three-container"></div> -->
  </div>
</template>

<script>
import BaseButton from "@/components/BaseButton"
import BaseSlider from "@/components/BaseSlider"
import BaseBox from "@/components/BaseBox"

// import createTweenScrubber from "../animation"
import { mapGetters, mapMutations, mapActions } from "vuex"

export default {
  name: "Start",
  components: {
    BaseButton,
    BaseSlider,
    BaseBox
  },
  data () {
    return {
      gameModeStr: "random",
      value: null,
      errorMsg: false
    }
  },
  computed: {
    ...mapGetters({
      numberOfImg: "numberOfImg",
      searchValue: "searchValue",
      secondsToRemember: "secondsToRemember"
    })
  },
  methods: {
    onInput (event) {
      this.errorMsg = false
      this.passSearchValue(this.value)
    },
    onClickRandom () {
      this.passGameMode("random")
      this.fetchImages()
      this.$router.push("/game")
    },
    async onClickSearch (event) {
      event.preventDefault()
      if (this.value) {
        this.passGameMode("search")
        const result = await this.fetchImages()
        if (result) {
          this.errorMsg = false
          this.$router.push("/game")
        } else {
          this.value = null
          this.errorMsg = true
        }
      }
    },
    ...mapMutations({
      setNumberOfImg: "setNumberOfImg",
      setSearchValue: "setSearchValue",
      setSecondsToRemember: "setSecondsToRemember"
    }),
    ...mapActions({
      startTimerAfterStart: "startTimerAfterStart",
      passGameMode: "passGameMode",
      passSearchValue: "passSearchValue",
      fetchImages: "fetchImages"
    })
  },
  mounted () {
    this.setSearchValue = null
    this.gameModeStr = "random"
    this.setGameMode = null
    // createTweenScrubber()
  }
}
</script>

<style lang="scss" scoped>
.start {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 300px;

  .startBox {
    margin: 10px;
    &.boxTitle {
      text-decoration: underline #fff double;
    }
    &.boxSearch {
      cursor: default;
    }
    .searchForm {
      padding: 39% 0;
    }
  }
  .boxTitle {
    pointer-events: none;
  }
  .boxSize{
    .numberOfImgSelect{
      padding-top: 73px;
    }
  }
}
.startBtn {
  margin: 10px;
  width: 200px;
}
.startInput {
  width: 231px;
  height: 36px;
  display: block;
  font-size: 25px;
  color: #ff6860;
  outline: none;
  border: none;
}
.startInput::placeholder {
  font-size: 15px;
  color: rgb(205, 203, 203);
  padding-left: 10px;
}
.inputContainer {
  display: flex;
  justify-content: center;
}
form {
  text-align: center;
}
p {
  margin: 0 0 10px;
}
</style>
