<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-foreground">
          {{ $t('app.title') }}
        </h1>
        <p class="mt-2 text-muted-foreground">
          {{ $t('app.subtitle') }}
        </p>
      </div>
      <slot />
    </div>
  </div>
</template>
