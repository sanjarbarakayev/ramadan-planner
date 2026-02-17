import { toast } from 'vue-sonner'

export function useAppToast() {
  const { t } = useI18n()

  function showSuccess(i18nKey: string): void {
    toast.success(t(i18nKey))
  }

  function showError(i18nKeyOrError: string | unknown): void {
    if (typeof i18nKeyOrError === 'string') {
      toast.error(t(i18nKeyOrError))
    } else {
      toast.error(t('toast.errorGeneric'))
    }
  }

  function showInfo(i18nKey: string): void {
    toast.info(t(i18nKey))
  }

  return {
    showSuccess,
    showError,
    showInfo,
  }
}
