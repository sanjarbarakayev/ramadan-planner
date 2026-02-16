<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  category: string
  colSpan: number
}>()

const categoryLabel = computed(() => {
  const key = `habits.categories.${props.category}`
  return t(key)
})
</script>

<template>
  <tr class="bg-muted/50">
    <td :colspan="colSpan" class="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {{ categoryLabel }}
    </td>
  </tr>
</template>
