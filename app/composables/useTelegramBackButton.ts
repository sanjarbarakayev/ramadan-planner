export function useTelegramBackButton() {
  const { isActive } = useTelegram()

  if (!isActive.value) return

  const route = useRoute()
  const router = useRouter()

  let cleanup: (() => void) | null = null

  onMounted(async () => {
    const { backButton } = await import('@telegram-apps/sdk')

    const off = backButton.onClick(() => {
      router.back()
    })

    if (route.path === '/dashboard') {
      backButton.hide()
    } else {
      backButton.show()
    }

    cleanup = () => {
      off()
      backButton.hide()
    }
  })

  watch(
    () => route.path,
    async (path) => {
      if (!isActive.value) return
      const { backButton } = await import('@telegram-apps/sdk')
      if (path === '/dashboard') {
        backButton.hide()
      } else {
        backButton.show()
      }
    },
  )

  onUnmounted(() => {
    cleanup?.()
  })
}
