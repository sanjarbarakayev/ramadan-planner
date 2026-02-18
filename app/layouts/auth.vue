<template>
  <div class="flex min-h-screen bg-background">
    <!-- Decorative panel (hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-[#092420]">
      <!-- Geometric pattern overlay -->
      <svg aria-hidden="true" class="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="auth-geom" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20,0 L40,20 L20,40 L0,20 Z" fill="none" stroke="#b08518" stroke-width="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-geom)" />
      </svg>

      <!-- Crescent moon + stars illustration -->
      <!-- Branding illustration (intentionally in Uzbek as brand name) -->
      <svg aria-hidden="true" class="relative w-64 h-64" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="auth-moon" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stop-color="#f2e4a8" />
            <stop offset="45%" stop-color="#dbb84a" />
            <stop offset="100%" stop-color="#b08518" />
          </linearGradient>
          <radialGradient id="auth-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#dbb84a" stop-opacity="0.12" />
            <stop offset="60%" stop-color="#dbb84a" stop-opacity="0.03" />
            <stop offset="100%" stop-color="#dbb84a" stop-opacity="0" />
          </radialGradient>
          <clipPath id="auth-clip">
            <path d="M 0,0 L 256,0 L 256,256 L 0,256 Z M 150,88 a 40,40 0 1,1 0,-0.01 Z" clip-rule="evenodd" />
          </clipPath>
        </defs>

        <!-- Glow -->
        <circle cx="124" cy="118" r="100" fill="url(#auth-glow)" />

        <!-- Crescent -->
        <circle cx="128" cy="118" r="52" fill="url(#auth-moon)" clip-path="url(#auth-clip)" />

        <!-- Scattered stars -->
        <circle cx="195" cy="75" r="2.2" fill="#dbb84a" opacity="0.50" />
        <circle cx="185" cy="60" r="1.5" fill="#c9a63e" opacity="0.35" />
        <circle cx="210" cy="100" r="1.3" fill="#c9a63e" opacity="0.28" />
        <circle cx="65" cy="70" r="1.8" fill="#dbb84a" opacity="0.40" />
        <circle cx="220" cy="68" r="1" fill="#b8962e" opacity="0.20" />
        <circle cx="75" cy="155" r="1.4" fill="#c9a63e" opacity="0.25" />
        <circle cx="200" cy="148" r="1.2" fill="#b8962e" opacity="0.20" />
        <circle cx="50" cy="110" r="1.6" fill="#dbb84a" opacity="0.35" />
        <circle cx="230" cy="55" r="0.9" fill="#a68525" opacity="0.14" />
        <circle cx="90" cy="55" r="1" fill="#b8962e" opacity="0.18" />
        <circle cx="40" cy="80" r="0.8" fill="#a68525" opacity="0.12" />
        <circle cx="235" cy="120" r="0.7" fill="#a68525" opacity="0.10" />
        <circle cx="55" cy="140" r="1.3" fill="#c9a63e" opacity="0.22" />
        <circle cx="240" cy="145" r="1" fill="#b8962e" opacity="0.18" />
        <circle cx="35" cy="55" r="1.5" fill="#dbb84a" opacity="0.38" />
        <circle cx="245" cy="45" r="1.2" fill="#c9a63e" opacity="0.28" />

        <!-- App title below moon -->
        <text x="128" y="210" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#dbb84a" opacity="0.9">
          Ramazon Rejam
        </text>
        <text x="128" y="232" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#8fa89a" letter-spacing="2">
          NAMOZ · QUR'ON · ZIKR · KUNDALIK
        </text>
      </svg>
    </div>

    <!-- Form side -->
    <div class="flex flex-1 items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Mobile banner -->
        <div class="mb-6 flex items-center justify-center gap-3 lg:hidden">
          <img src="/logo.svg" alt="" class="h-10 w-10 rounded-xl" />
          <div>
            <h1 class="text-xl font-bold text-foreground">
              {{ $t('app.title') }}
            </h1>
            <p class="text-xs text-muted-foreground">
              {{ $t('app.subtitle') }}
            </p>
          </div>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
