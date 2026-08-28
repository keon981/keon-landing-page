import i18n from '@/lib/i18n'

it('defaults to zh-TW', () => {
  expect(i18n.t('hero.name')).toBe('我是柯均翰')
})

it('switches to English and syncs html lang', async () => {
  await i18n.changeLanguage('en')
  expect(i18n.t('hero.name')).toBe('I\'m Keon Ko')
  expect(document.documentElement.lang).toBe('en')
  await i18n.changeLanguage('zh-TW')
  expect(document.documentElement.lang).toBe('zh-Hant')
})

it('experience bullets has 6 items in both languages', () => {
  const zh = i18n.getResource('zh-TW', 'translation', 'experience.efai.bullets')
  const en = i18n.getResource('en', 'translation', 'experience.efai.bullets')
  expect(zh).toHaveLength(6)
  expect(en).toHaveLength(6)
})
