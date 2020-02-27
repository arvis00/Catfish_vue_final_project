<template>
  <div class="imgListItem" :style="{ height: size + 'px' }">
    <div
      class="backCard"
      :style="{
        height: size + 'px',
        width: size + 'px',
        transform: ' translateZ(' + size / 2 + 'px)',
        backgroundColor: BgColorFront,
        fontSize: fontSizeFront
      }"
    >
      <p class="textFront" :style="{ padding: paddingCenterFront }">
        {{ textFront }}
      </p>
    </div>
    <div
      class="frontCard"
      :style="{
        height: size + 'px',
        width: size + 'px',
        transform: 'rotateX(-90deg) translateZ(-' + size / 2 + 'px)',
        backgroundColor: BgColorBack,
        fontSize: fontSizeBack
      }"
      @click="onClick"
    >
      <p class="textBack" :style="{ padding: paddingCenterBack }">
        {{ textBack }}
      </p>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseBox",
  props: {
    size: {
      type: String,
      required: true
    },
    textFront: String,
    textBack: String,
    BgColorBack: String,
    fontSizeBack: String,
    paddingCenterBack: String,
    BgColorFront: String,
    fontSizeFront: String,
    paddingCenterFront: String
  },
  methods: {
    onClick (event) {
      this.$emit("click", event)
    }
  }
}
</script>

<style lang="scss">
.imgListItem {
  transition: transform 0.33s;
  transform-style: preserve-3d;
  .backCard,
  .frontCard {
    // box-shadow: 0 5px 20px rgba(105, 108, 109, .3), 0 0 8px 5px rgba(104, 127, 131, 0.4) inset;
    border: 1px solid rgba(147, 184, 189, 0.8);
  }
  .textFront,
  .textBack {
    color: #fff;
    text-align: center;
    margin: 0;
  }
  .backCard {
    background-color: #2d656e;
  }
  .textBack {
    font-size: 27.2px;
    font-weight: 700;
    line-height: 1.2;
    padding: 44% 0;
  }
  .frontCard {
    background-color: rgb(23, 68, 116);
  }
  .textFront {
    font-size: 27.2px;
    font-weight: 700;
    line-height: 1.2;
    padding: 44% 0;
  }
}
.imgListItem:hover {
  transform: rotateX(90deg);
  cursor: pointer;
}
</style>
