<template>
  <div class="slideContainer" :style="{padding:padding}">
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="slider"
      :value="value"
      @input="onInput"
    />
    <p><slot /> {{ value }}</p>
  </div>
</template>

<script>
export default {
  name: "BaseSlider",
  props: {
    value: String,
    min: String,
    max: String,
    step: String,
    padding: String
  },
  methods: {
    onInput (event) {
      this.$emit("input", event.target.value)
    }
  }
}
</script>

<style scoped>
.slider {
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #ffffff;
  outline: none;
  opacity: 0.7;

  transition: opacity 0.2s;
}

.slideContainer {
  padding: 0 15% 0;
}
.slider:hover {
  opacity: 1;
}
p {
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}
</style>
