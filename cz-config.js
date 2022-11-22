module.exports = {
  types: [
    { value: '✨ ADD', name: '✨ 기능추가 :\t제품 기능 추가 사항' },
    { value: '🐛 FIX', name: '🐛 버그 :\t버그 수정' },
    { value: '📝 DOC', name: '📝 문서 :\t문서 업데이트' },
    {
      value: '🚑️ HOT-FIX',
      name: '🚑️ 긴급 수정:\t 핫픽스',
    },
    {
      value: '♻️  REFACTOR',
      name: '♻️  리팩토링 :\t코드 리팩토링',
    },
    {
      value: '✅ TEST',
      name: '✅ 테스트 :\t 테스트 코드 업데이트',
    },
    {
      value: '🚚 ETC',
      name: '🚚 기타 : \t기타 업데이트',
    },
  ],
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body'],
  subjectLimit: 100,
}
