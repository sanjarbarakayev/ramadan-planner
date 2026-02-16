export function useDevDate() {
  const override = useState<string | null>('dev-date-override', () => null)

  const isActive = computed(() => override.value !== null)

  const currentDate = computed(() => {
    if (override.value) {
      return new Date(override.value + 'T12:00:00')
    }
    return new Date()
  })

  function setDate(date: string | null) {
    override.value = date
  }

  function reset() {
    override.value = null
  }

  return { override, isActive, currentDate, setDate, reset }
}
