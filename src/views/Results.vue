<template>
  <div class="results">
    <h1>Congrats!</h1>
    <div class="timeResult">
      <h1>Your time is {{timestamp}}</h1></div>
    <router-link to="/game">
      <BaseButton class="resultBtn" @click="startTimerAfterStart">
        TRY AGAIN
      </BaseButton>
    </router-link>
    <router-link to="/">
      <BaseButton class="resultBtn">
        HOME
      </BaseButton>
    </router-link>
  </div>
</template>

<script>
import BaseButton from "../components/BaseButton.vue"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "Results",
  components: {
    BaseButton
  },
  data () {
    return {
      timestamp: null
    }
  },
  computed: {
    ...mapGetters({
      timePassedAfterFlip: "timePassedAfterFlip"
    })
  },
  methods: {
    ...mapActions({
      startTimerAfterStart: "startTimerAfterStart"
    })

  },
  mounted () {
    const minutes = Math.floor(this.timePassedAfterFlip / 60)
    const seconds = this.timePassedAfterFlip % 60
    this.timestamp = `${minutes}:${seconds}`
  }
}
</script>

<style>
.results{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.resultBtn{
    margin: 30px 0;
  }
</style>
