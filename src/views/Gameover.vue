<template>
  <div class="gameover">
    <h1>GAME OVER!</h1>
    <router-link to="/game">
      <BaseButton class="gamoverBtn" @click="startTimerAfterStart">
        TRY AGAIN
      </BaseButton>
    </router-link>
    <router-link to="/">
      <BaseButton class="gamoverBtn">
        HOME
      </BaseButton>
    </router-link>
  </div>
</template>

<script>
import BaseButton from "../components/BaseButton.vue"
import { mapActions } from "vuex"
export default {
  name: "Gameover",
  components: {
    BaseButton
  },
  methods: {
    ...mapActions({
      startTimerAfterStart: "startTimerAfterStart"
    })
  }
}

</script>

<style>
.gameover{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.gamoverBtn{
    margin: 30px 0;
  }

</style>
