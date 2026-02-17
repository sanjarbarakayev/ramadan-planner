<script setup lang="ts">
import { Toaster as Sonner } from 'vue-sonner'
</script>

<template>
  <Sonner
    :theme="'light'"
    position="top-right"
    :duration="4000"
    :close-button="true"
  />
</template>
