<template>
  <div class="gameover">
    <h1>GAME OVER!</h1>
    <router-link to="/game">
      <BaseButton class="gamoverBtn">
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
export default {
  name: "Gameover",
  components: {
    BaseButton
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
