module.exports = {
  types: [
    { value: "✨ 기능 추가", name: "✨ 기능추가 :\t제품 기능 추가 사항" },
    { value: "🐛 버그", name: "🐛 버그 :\t버그 수정" },
    { value: "📝 문서", name: "📝 문서 :\t문서 업데이트" },
    {
      value: "🚑️ 긴급 수정",
      name: "🚑️ 긴급 수정:\t 핫픽스",
    },
    {
      value: "♻️  리팩토링",
      name: "♻️  리팩토링 :\t코드 리팩토링",
    },
    {
      value: "✅ 테스트",
      name: "✅ 테스트 :\t 테스트 코드 업데이트",
    },
    {
      value: "🚚 기타",
      name: "🚚 기타 : \t기타 업데이트",
    },
  ],
  allowCustomScopes: false,
  allowBreakingChanges: ["feat", "fix"],
  skipQuestions: ["body"],
  subjectLimit: 100,
};
