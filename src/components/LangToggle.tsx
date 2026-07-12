import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function LangToggle() {
  const { i18n } = useTranslation()
  const isZh = i18n.language !== 'en'
  return (
    <Button
      variant="neutral"
      size="sm"
      aria-label="toggle language"
      onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh-TW')}
    >
      {isZh ? 'EN' : '中'}
    </Button>
  )
}
