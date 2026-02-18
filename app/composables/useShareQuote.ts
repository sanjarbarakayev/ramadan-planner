import { toPng, toBlob } from 'html-to-image'

const APP_URL = 'https://ramazon-rejam.vercel.app'

interface ShareOptions {
  readonly cardElement: HTMLElement
  readonly fileName: string
  readonly shareText: string
}

export function useShareQuote() {
  const { t } = useI18n()
  const { showSuccess, showError } = useAppToast()

  const isGenerating = ref(false)

  async function generateImage(element: HTMLElement): Promise<Blob | null> {
    try {
      // warm-up pass for reliable font capture
      await toPng(element, { pixelRatio: 2 })
      const blob = await toBlob(element, { pixelRatio: 2 })
      return blob
    } catch {
      return null
    }
  }

  async function shareCard({ cardElement, fileName, shareText }: ShareOptions): Promise<void> {
    if (isGenerating.value) return
    isGenerating.value = true

    try {
      const blob = await generateImage(cardElement)
      if (!blob) {
        showError('toast.shareError')
        return
      }

      const file = new File([blob], fileName, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: t('quotes.shareTitle'),
          text: shareText,
          files: [file],
        })
        showSuccess('toast.quoteShared')
      } else {
        downloadBlob(blob, fileName)
      }
    } catch (err: unknown) {
      const isAborted = err instanceof DOMException && err.name === 'AbortError'
      if (!isAborted) {
        showError('toast.shareError')
      }
    } finally {
      isGenerating.value = false
    }
  }

  async function downloadCard(cardElement: HTMLElement, fileName: string): Promise<void> {
    if (isGenerating.value) return
    isGenerating.value = true

    try {
      const blob = await generateImage(cardElement)
      if (!blob) {
        showError('toast.shareError')
        return
      }
      downloadBlob(blob, fileName)
    } catch {
      showError('toast.shareError')
    } finally {
      isGenerating.value = false
    }
  }

  function downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob)
    try {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      showSuccess('toast.quoteDownloaded')
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  async function shareTelegram(
    cardElement: HTMLElement,
    fileName: string,
    shareText: string,
  ): Promise<void> {
    if (isGenerating.value) return
    isGenerating.value = true

    try {
      const blob = await generateImage(cardElement)
      if (!blob) {
        // Fallback to text-only share
        openTelegramTextShare(shareText)
        return
      }

      const file = new File([blob], fileName, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: t('quotes.shareTitle'),
          files: [file],
          text: shareText,
        })
        showSuccess('toast.quoteShared')
      } else {
        // Desktop fallback: download image + open Telegram text share
        downloadBlob(blob, fileName)
        openTelegramTextShare(shareText)
      }
    } catch (err: unknown) {
      const isAborted = err instanceof DOMException && err.name === 'AbortError'
      if (!isAborted) {
        openTelegramTextShare(shareText)
      }
    } finally {
      isGenerating.value = false
    }
  }

  function openTelegramTextShare(shareText: string): void {
    const url = `https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'noopener')
  }

  function shareWhatsApp(shareText: string): void {
    const text = `${shareText}\n\n${APP_URL}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener')
  }

  return {
    isGenerating: readonly(isGenerating),
    shareCard,
    downloadCard,
    shareTelegram,
    shareWhatsApp,
  }
}
