module.exports = {
  types: [
    { value: '✨ ADD', name: '✨ ADD :\t제품 기능 추가 사항' },
    { value: '🐛 FIX', name: '🐛 FIX :\t버그 수정' },
    { value: '📝 DOC', name: '📝 DOC :\t문서 업데이트' },
    {
      value: '🚑️ HOT-FIX',
      name: '🚑️ HOT-FIX:\t 핫픽스',
    },
    {
      value: '♻️  REFACTOR',
      name: '♻️  REFACTOR :\t코드 리팩토링',
    },
    {
      value: '✅ TEST',
      name: '✅ TEST :\t 테스트 코드 업데이트',
    },
    {
      value: '🚚 ETC',
      name: '🚚 ETC : \t기타 업데이트',
    },
  ],
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body'],
  subjectLimit: 100,
}
