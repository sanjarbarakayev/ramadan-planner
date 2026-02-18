<script setup lang="ts">
const visible = ref(true)
const fadeOut = ref(false)

function dismiss() {
  fadeOut.value = true
  setTimeout(() => {
    visible.value = false
  }, 600)
}

onMounted(() => {
  const router = useRouter()

  const unwatch = router.isReady().then(() => {
    setTimeout(dismiss, 800)
  })

  // Safety timeout - dismiss after 4s regardless
  const timeout = setTimeout(dismiss, 4000)

  onUnmounted(() => {
    clearTimeout(timeout)
  })
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="app-loader"
      :class="{ 'app-loader--fade-out': fadeOut }"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 400 400"
        class="app-loader__svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Sky gradient -->
          <linearGradient id="loader-sky" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stop-color="#0e2f2b" />
            <stop offset="60%" stop-color="#092420" />
            <stop offset="100%" stop-color="#051614" />
          </linearGradient>

          <!-- Moon gold gradient -->
          <linearGradient id="loader-moon" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stop-color="#f2e4a8" />
            <stop offset="45%" stop-color="#dbb84a" />
            <stop offset="100%" stop-color="#b08518" />
          </linearGradient>

          <!-- Moon glow -->
          <radialGradient id="loader-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#dbb84a" stop-opacity="0.25" />
            <stop offset="40%" stop-color="#dbb84a" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#dbb84a" stop-opacity="0" />
          </radialGradient>

          <!-- Horizon glow -->
          <linearGradient id="loader-horizon" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stop-color="#dbb84a" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#dbb84a" stop-opacity="0" />
          </linearGradient>

          <!-- Crescent clip -->
          <clipPath id="loader-crescent-clip">
            <path
              d="M 0,0 L 400,0 L 400,400 L 0,400 Z M 228,155 a 48,48 0 1,1 0,-0.01 Z"
              clip-rule="evenodd"
            />
          </clipPath>
        </defs>

        <!-- Sky background -->
        <rect width="400" height="400" fill="url(#loader-sky)" />

        <!-- Stars - fade in with staggered delays -->
        <g class="loader-stars">
          <circle cx="80" cy="60" r="1.8" fill="#dbb84a" class="loader-star loader-star--1" />
          <circle cx="320" cy="45" r="2" fill="#dbb84a" class="loader-star loader-star--2" />
          <circle cx="150" cy="90" r="1.4" fill="#c9a63e" class="loader-star loader-star--3" />
          <circle cx="260" cy="75" r="1.2" fill="#c9a63e" class="loader-star loader-star--4" />
          <circle cx="50" cy="130" r="1" fill="#b8962e" class="loader-star loader-star--5" />
          <circle cx="350" cy="110" r="1.5" fill="#dbb84a" class="loader-star loader-star--6" />
          <circle cx="110" cy="40" r="0.8" fill="#b8962e" class="loader-star loader-star--7" />
          <circle cx="290" cy="30" r="1" fill="#c9a63e" class="loader-star loader-star--8" />
          <circle cx="200" cy="55" r="1.6" fill="#dbb84a" class="loader-star loader-star--9" />
          <circle cx="40" cy="90" r="0.9" fill="#b8962e" class="loader-star loader-star--10" />
          <circle cx="370" cy="75" r="0.7" fill="#a68525" class="loader-star loader-star--11" />
          <circle cx="180" cy="35" r="1.1" fill="#c9a63e" class="loader-star loader-star--12" />
        </g>

        <!-- Twinkling stars - subtle pulse -->
        <g class="loader-twinkle">
          <circle cx="80" cy="60" r="3" fill="#dbb84a" opacity="0" class="loader-twinkle-ring loader-twinkle-ring--1" />
          <circle cx="320" cy="45" r="3.5" fill="#dbb84a" opacity="0" class="loader-twinkle-ring loader-twinkle-ring--2" />
          <circle cx="200" cy="55" r="3" fill="#dbb84a" opacity="0" class="loader-twinkle-ring loader-twinkle-ring--3" />
        </g>

        <!-- Moon group - rises from below -->
        <g class="loader-moon-group">
          <!-- Glow behind moon -->
          <circle cx="195" cy="200" r="100" fill="url(#loader-glow)" class="loader-moon-glow" />

          <!-- Crescent moon -->
          <circle
            cx="195"
            cy="200"
            r="62"
            fill="url(#loader-moon)"
            clip-path="url(#loader-crescent-clip)"
          />
        </g>

        <!-- Horizon glow line -->
        <rect
          x="0"
          y="270"
          width="400"
          height="130"
          fill="url(#loader-horizon)"
          class="loader-horizon-glow"
        />

        <!-- Subtle horizon line -->
        <line
          x1="40"
          y1="290"
          x2="360"
          y2="290"
          stroke="#dbb84a"
          stroke-opacity="0.12"
          stroke-width="0.5"
          class="loader-horizon-line"
        />
      </svg>
    </div>
  </Teleport>
</template>

<style scoped>
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #051614;
  transition: opacity 0.6s ease-out;
}

.app-loader--fade-out {
  opacity: 0;
  pointer-events: none;
}

.app-loader__svg {
  width: min(100vw, 100vh);
  height: min(100vw, 100vh);
  max-width: 400px;
  max-height: 400px;
}

/* Moon rise animation */
.loader-moon-group {
  animation: moon-rise 2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@keyframes moon-rise {
  0% {
    transform: translateY(120px);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Moon glow expansion */
.loader-moon-glow {
  animation: glow-expand 2.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@keyframes glow-expand {
  0% {
    transform-origin: 195px 200px;
    transform: scale(0.3);
    opacity: 0;
  }
  30% {
    opacity: 0.5;
  }
  100% {
    transform-origin: 195px 200px;
    transform: scale(1);
    opacity: 1;
  }
}

/* Stars fade in - staggered */
.loader-star {
  opacity: 0;
  animation: star-appear 0.8s ease-out forwards;
}

.loader-star--1 { animation-delay: 0.6s; }
.loader-star--2 { animation-delay: 0.8s; }
.loader-star--3 { animation-delay: 1.0s; }
.loader-star--4 { animation-delay: 1.1s; }
.loader-star--5 { animation-delay: 1.3s; }
.loader-star--6 { animation-delay: 0.9s; }
.loader-star--7 { animation-delay: 1.4s; }
.loader-star--8 { animation-delay: 1.2s; }
.loader-star--9 { animation-delay: 0.7s; }
.loader-star--10 { animation-delay: 1.5s; }
.loader-star--11 { animation-delay: 1.6s; }
.loader-star--12 { animation-delay: 1.1s; }

@keyframes star-appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  60% {
    opacity: 0.6;
    transform: scale(1.3);
  }
  100% {
    opacity: 0.45;
    transform: scale(1);
  }
}

/* Star twinkle effect */
.loader-twinkle-ring {
  animation: twinkle 2s ease-in-out infinite;
}

.loader-twinkle-ring--1 { animation-delay: 1.2s; }
.loader-twinkle-ring--2 { animation-delay: 1.8s; }
.loader-twinkle-ring--3 { animation-delay: 2.4s; }

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.15;
    transform: scale(1.8);
  }
}

/* Horizon glow */
.loader-horizon-glow {
  opacity: 0;
  animation: horizon-appear 1.5s ease-out 0.5s forwards;
}

.loader-horizon-line {
  opacity: 0;
  animation: horizon-appear 1s ease-out 1s forwards;
}

@keyframes horizon-appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .loader-moon-group,
  .loader-moon-glow,
  .loader-star,
  .loader-twinkle-ring,
  .loader-horizon-glow,
  .loader-horizon-line {
    animation-duration: 0.01s !important;
    animation-delay: 0s !important;
  }
}
</style>
