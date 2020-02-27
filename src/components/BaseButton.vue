<template>
    <button @click="onClick">
      <slot />
    </button>
</template>

<script>
export default {
  name: "BaseButton",
  methods: {
    onClick (event) {
      this.$emit("click", event)
    }
  }
}
</script>

<style>
button {
  height: 54px;
  width: 128px;
  color: #ff6860;
  background-color: #fff;
  /* border-radius: 10px; */
  border: solid 5px #ff6860;
  font-weight: 700;
  font-size: 15px;
  outline: none;
  cursor: pointer;
}
</style>
