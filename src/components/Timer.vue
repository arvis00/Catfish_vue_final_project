<template>
  <div class="base-timer">
    <svg
      class="base-timer__svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="base-timer__circle">
        <circle
          class="base-timer__path-elapsed"
          cx="50"
          cy="50"
          r="45"
        ></circle>
        <path
          :stroke-dasharray="circleDasharray"
          class="base-timer__path-remaining"
          :class="remainingPathColor"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span class="base-timer__label">{{ timeLeft }}</span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

const FULL_DASH_ARRAY = 283
const WARNING_THRESHOLD = 5
const ALERT_THRESHOLD = 3

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
}

const TIME_LIMIT = 3
export default {
  name: "Timer",
  data () {
    return {
      // timePassedAfterStart: 0,
      // timerInterval: null,
      // noOfQuestion: 1
    }
  },
  computed: {
    ...mapGetters({
      timePassedAfterStart: "timePassedAfterStart",
      timerInterval: "timerInterval"
    }),
    timeLeft () {
      return TIME_LIMIT - this.timePassedAfterStart
    },

    circleDasharray () {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`
    },

    timeFraction () {
      const rawTimeFraction = this.timeLeft / TIME_LIMIT
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction)
    },

    remainingPathColor () {
      const { alert, warning, info } = COLOR_CODES

      if (this.timeLeft <= alert.threshold) {
        return alert.color
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color
      } else {
        return info.color
      }
    }
  },
  watch: {
    timeLeft (newValue) {
      if (newValue === 0) {
        this.onTimesUp()
      }
    }
  },
  methods: {
    ...mapActions({
      stopTimer: "stopTimer"
    }),
    onTimesUp () {
      this.stopTimer()
      this.$emit("timerEnd")
    }
  }
}
</script>

<style scoped lang="scss">
.timer {
  margin-top: 76px;
}

.base-timer {
  position: relative;
  width: 100px;
  height: 100px;

  &__svg {
    transform: scaleX(-1);
  }

  &__circle {
    fill: none;
    stroke: none;
  }

  &__path-elapsed {
    stroke-width: 10px;
    stroke: grey;
  }

  &__path-remaining {
    stroke-width: 10px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;

    &.green {
      color: rgb(65, 184, 131);
    }

    &.orange {
      color: orange;
    }

    &.red {
      color: red;
    }
  }

  &__label {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
  }
}
</style>