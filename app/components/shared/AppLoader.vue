<script setup lang="ts">
const visible = ref(true)
const fadeOut = ref(false)
let dismissed = false
let fadeTimeout: ReturnType<typeof setTimeout> | undefined

function dismiss() {
  if (dismissed) return
  dismissed = true
  fadeOut.value = true
  fadeTimeout = setTimeout(() => {
    visible.value = false
  }, 600)
}

onMounted(() => {
  const router = useRouter()

  let readyTimeout: ReturnType<typeof setTimeout> | undefined
  router.isReady().then(() => {
    readyTimeout = setTimeout(dismiss, 800)
  })

  const safetyTimeout = setTimeout(dismiss, 4000)

  onUnmounted(() => {
    clearTimeout(safetyTimeout)
    if (readyTimeout) clearTimeout(readyTimeout)
    if (fadeTimeout) clearTimeout(fadeTimeout)
  })
})
</script>

<template>
  <div
    v-if="visible"
    class="app-loader"
    :class="{ 'app-loader--fade-out': fadeOut }"
    role="status"
    aria-label="Loading"
    aria-live="polite"
  >
    <svg
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
      class="app-loader__svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="loader-sky" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#0a201e" />
          <stop offset="50%" stop-color="#0e2f2b" />
          <stop offset="100%" stop-color="#071a18" />
        </linearGradient>

        <linearGradient id="loader-moon" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stop-color="#f2e4a8" />
          <stop offset="45%" stop-color="#dbb84a" />
          <stop offset="100%" stop-color="#b08518" />
        </linearGradient>

        <radialGradient id="loader-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#dbb84a" stop-opacity="0.18" />
          <stop offset="35%" stop-color="#dbb84a" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#dbb84a" stop-opacity="0" />
        </radialGradient>

        <radialGradient id="loader-horizon-glow" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stop-color="#dbb84a" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#dbb84a" stop-opacity="0" />
        </radialGradient>

        <clipPath id="loader-crescent">
          <path
            d="M 0,0 L 1400,0 L 1400,900 L 0,900 Z M 728,388 a 30,30 0 1,1 0,-0.01 Z"
            clip-rule="evenodd"
          />
        </clipPath>
      </defs>

      <!-- Sky -->
      <rect width="1400" height="900" fill="url(#loader-sky)" />

      <!-- Stars layer 1: bright -->
      <g class="loader-stars">
        <circle cx="120" cy="80" r="2.5" fill="#dbb84a" class="loader-star loader-star--1" />
        <circle cx="380" cy="150" r="2" fill="#dbb84a" class="loader-star loader-star--2" />
        <circle cx="560" cy="60" r="2.8" fill="#dbb84a" class="loader-star loader-star--3" />
        <circle cx="850" cy="120" r="2.2" fill="#dbb84a" class="loader-star loader-star--4" />
        <circle cx="1050" cy="70" r="2.5" fill="#dbb84a" class="loader-star loader-star--5" />
        <circle cx="1280" cy="160" r="2" fill="#dbb84a" class="loader-star loader-star--6" />
        <circle cx="200" cy="300" r="2.2" fill="#dbb84a" class="loader-star loader-star--7" />
        <circle cx="1200" cy="320" r="2.4" fill="#dbb84a" class="loader-star loader-star--8" />
      </g>

      <!-- Stars layer 2: medium -->
      <g class="loader-stars">
        <circle cx="70" cy="200" r="1.6" fill="#c9a63e" class="loader-star loader-star--9" />
        <circle cx="300" cy="50" r="1.4" fill="#c9a63e" class="loader-star loader-star--10" />
        <circle cx="480" cy="240" r="1.5" fill="#c9a63e" class="loader-star loader-star--11" />
        <circle cx="650" cy="160" r="1.3" fill="#c9a63e" class="loader-star loader-star--12" />
        <circle cx="780" cy="60" r="1.6" fill="#c9a63e" class="loader-star loader-star--1" />
        <circle cx="950" cy="240" r="1.4" fill="#c9a63e" class="loader-star loader-star--2" />
        <circle cx="1100" cy="180" r="1.5" fill="#c9a63e" class="loader-star loader-star--3" />
        <circle cx="1350" cy="80" r="1.3" fill="#c9a63e" class="loader-star loader-star--4" />
        <circle cx="160" cy="450" r="1.4" fill="#c9a63e" class="loader-star loader-star--5" />
        <circle cx="1300" cy="430" r="1.5" fill="#c9a63e" class="loader-star loader-star--6" />
      </g>

      <!-- Stars layer 3: dim/small -->
      <g class="loader-stars">
        <circle cx="50" cy="350" r="1" fill="#b8962e" class="loader-star loader-star--7" />
        <circle cx="240" cy="180" r="0.9" fill="#b8962e" class="loader-star loader-star--8" />
        <circle cx="420" cy="100" r="1.1" fill="#b8962e" class="loader-star loader-star--9" />
        <circle cx="590" cy="300" r="0.8" fill="#b8962e" class="loader-star loader-star--10" />
        <circle cx="730" cy="220" r="1" fill="#b8962e" class="loader-star loader-star--11" />
        <circle cx="900" cy="50" r="0.9" fill="#b8962e" class="loader-star loader-star--12" />
        <circle cx="1000" cy="300" r="1.1" fill="#b8962e" class="loader-star loader-star--1" />
        <circle cx="1150" cy="100" r="0.8" fill="#b8962e" class="loader-star loader-star--2" />
        <circle cx="1320" cy="270" r="1" fill="#b8962e" class="loader-star loader-star--3" />
        <circle cx="340" cy="370" r="0.9" fill="#b8962e" class="loader-star loader-star--4" />
        <circle cx="1100" cy="400" r="0.8" fill="#b8962e" class="loader-star loader-star--5" />
        <circle cx="500" cy="380" r="0.7" fill="#a68525" class="loader-star loader-star--6" />
      </g>

      <!-- Twinkle rings on brightest stars -->
      <g class="loader-twinkle">
        <circle cx="560" cy="60" r="5" fill="#dbb84a" opacity="0" class="loader-twinkle-ring loader-twinkle-ring--1" />
        <circle cx="1050" cy="70" r="5" fill="#dbb84a" opacity="0" class="loader-twinkle-ring loader-twinkle-ring--2" />
        <circle cx="120" cy="80" r="4" fill="#dbb84a" opacity="0" class="loader-twinkle-ring loader-twinkle-ring--3" />
      </g>

      <!-- Moon group -->
      <g class="loader-moon-group">
        <circle cx="700" cy="410" r="120" fill="url(#loader-glow)" class="loader-moon-glow" />

        <circle
          cx="700"
          cy="410"
          r="42"
          fill="url(#loader-moon)"
          clip-path="url(#loader-crescent)"
        />
      </g>

      <!-- Horizon glow -->
      <ellipse
        cx="700"
        cy="900"
        rx="600"
        ry="350"
        fill="url(#loader-horizon-glow)"
        class="loader-horizon-glow"
      />
    </svg>
  </div>
</template>

<style scoped>
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a201e;
  transition: opacity 0.6s ease-out;
}

.app-loader--fade-out {
  opacity: 0;
  pointer-events: none;
}

.app-loader__svg {
  width: 100%;
  height: 100%;
}

/* Moon rise */
.loader-moon-group {
  will-change: transform, opacity;
  animation: moon-rise 2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@keyframes moon-rise {
  0% {
    transform: translateY(80px);
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
  will-change: transform, opacity;
  animation: glow-expand 2.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@keyframes glow-expand {
  0% {
    transform-origin: 700px 410px;
    transform: scale(0.3);
    opacity: 0;
  }
  30% {
    opacity: 0.5;
  }
  100% {
    transform-origin: 700px 410px;
    transform: scale(1);
    opacity: 1;
  }
}

/* Stars fade in */
.loader-star {
  opacity: 0;
  animation: star-appear 0.8s ease-out forwards;
}

.loader-star--1 { animation-delay: 0.4s; }
.loader-star--2 { animation-delay: 0.6s; }
.loader-star--3 { animation-delay: 0.8s; }
.loader-star--4 { animation-delay: 0.5s; }
.loader-star--5 { animation-delay: 0.9s; }
.loader-star--6 { animation-delay: 0.7s; }
.loader-star--7 { animation-delay: 1.1s; }
.loader-star--8 { animation-delay: 1.0s; }
.loader-star--9 { animation-delay: 1.2s; }
.loader-star--10 { animation-delay: 1.3s; }
.loader-star--11 { animation-delay: 1.0s; }
.loader-star--12 { animation-delay: 1.4s; }

@keyframes star-appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}

/* Star twinkle */
.loader-twinkle-ring {
  animation: twinkle 2.5s ease-in-out infinite;
}

.loader-twinkle-ring--1 { animation-delay: 1.0s; }
.loader-twinkle-ring--2 { animation-delay: 1.6s; }
.loader-twinkle-ring--3 { animation-delay: 2.2s; }

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(2);
  }
}

.app-loader--fade-out .loader-twinkle-ring {
  animation-play-state: paused;
}

/* Horizon glow */
.loader-horizon-glow {
  opacity: 0;
  animation: horizon-appear 2s ease-out 0.5s forwards;
}

@keyframes horizon-appear {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .loader-moon-group,
  .loader-moon-glow,
  .loader-star,
  .loader-twinkle-ring,
  .loader-horizon-glow {
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
