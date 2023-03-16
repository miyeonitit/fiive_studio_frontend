# 1. Description

<p>
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white">
<img src="https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=Sass&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white">
</p>

> Next.js framework 기반의 fiive studio frontend repository입니다. <br />

## 동작 순서

### 1-1. \_app.tsx

fiive studio에 들어오는 유저는 fiive로부터 `auth-token` cookie value와 함께
redirection 됩니다.<br /> fiive studio는 `auth-token` 기반으로(1) 유저 데이터
(classroom(2), sendbirdToken(3))를 request 합니다.

```jsx
// _app.tsx

const authTokenValue = getCookie('auth-token')

useLayoutEffect(() => {
      // 1. save user's auth-token
      setAuthToken(authTokenValue)

      // 2. get user's classroom infomation API
      getClassRoomInfomation(authTokenValue)

      // 3. create user's Sendbird access token
      getSendbirdAccessToken(authTokenValue)
    }
  }, [])
```

authTokenValue과 classroom, sendbirdToken의 data는 \_app.tsx 내 `<Component />`
의 props로 각각 전달됩니다.

```jsx
// _app.tsx

<Component
  {...pageProps}
  classroom={classroom}
  authTokenValue={authTokenValue}
  sendbirdAccessToken={sendbirdAccessToken}
/>
```

### 1-2. learner.tsx

fiive의 `learner` user가 접근할 수 있습니다. <br /> \_app.tsx 에서 props로 전달
받은 `auth-token`인 `props?.authTokenValue` 기반으로 user의 데이터와
(`getUserInfomation()`), emoji container(`getChatEmojiContainer()`) 데이터를
request 합니다.

그 이후, learner 페이지에서 필요한 컴포넌트들이 렌더됩니다.

```jsx
// learner.tsx

useLayoutEffect(() => {
      // 1. get user infomation with user auth-token
      getUserInfomation(props?.authTokenValue)

      // 2. get chat's emoji list container
      getChatEmojiContainer(props?.authTokenValue)
    }
  }, [props?.authTokenValue])
```

### 1-3. teacher.tsx

fiive의 `teacher`, `admin` user가 접근할 수 있습니다. <br /> \_app.tsx 에서
props로 전달받은 `auth-token`인 `props?.authTokenValue` 기반으로 user의 데이터와
(`getUserInfomation()`), emoji container(`getChatEmojiContainer()`) 데이터를
request 합니다.

그 이후, teacher 페이지에서 필요한 컴포넌트들이 렌더됩니다.

```jsx
// teacher.tsx

useLayoutEffect(() => {
      // 1. get user infomation with user auth-token
      getUserInfomation(props?.authTokenValue)

      // 2. get chat's emoji list container
      getChatEmojiContainer(props?.authTokenValue)
    }
  }, [props?.authTokenValue])
```

# 2. Running Application

## development mode

```
$ npm run dev
```

## production mode

```
$ npm run build        # default production mode
$ npm run build:dev    # test server production mode
$ npm run build:prod   # official server production mode
```

build 시 export가 동시에 진행되며, respository folder root에 out 폴더가 생성됩니
다. <br /> 또한 out 폴더 내에 static html file이 page 별로 생성됩니다. <br />
out 폴더에 구성된 파일들은 Amazon S3에 배포시 사용됩니다.

```
// package.json

  "scripts": {
    "build": "next build && next export",
    "build:dev": "dotenv -e .env.development next build && next export",
    "build:prod": "dotenv -e .env.production next build && next export",
  },
```

## test production mode

Amazon S3 배포 환경을 local 환경에서 development mode를 구성할 수 있습니다.

### 1. build

```
$ npm run build:dev    # test server production mode
$ npm run build:prod   # official server production mode
```

### 2. local 환경에서 development mode 실행

```
$ npx serve out -p 포트번호
```

# 3. env

repository folder root에 .env 파일을 생성합니다.

```
.env
.env.development
.env.production
```

## .env

```bash
NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY      # channeltalk plugin key

NEXT_PUBLIC_SENDBIRD_APP_ID             # sendbird resgistered app ID
NEXT_PUBLIC_SENDBIRD_API_TOKEN          # sendbird resgistered api token
NEXT_PUBLIC_SENDBIRD_EMOJI_CATEGORY_ID  # 53 - sendbird message emoji category number

NEXT_PUBLIC_FIIVE_URL                   # fiive url
```

## .env.development, .env.production

```bash
NEXT_PUBLIC_API_BASE_URL   # fiive studio base API
NEXT_PUBLIC_STUDIO_URL     # fiive studio official domain
```

# 4. Frontend Environment

## nvm

node version manager로, node 버전을 맞추기 위해 사용합니다. <br /> <b>node
16.13.1</b> 버전을 사용하고 있습니다.

```
$ nvm install 16.13.1
$ nvm use
```

## zustand

전역상태관리 라이브러리로 `zustand`를 사용합니다. 기능 단위별로 store 폴더를 구
성합니다.

```bash
/store
  ├── ClassRoom.ts         # user's classroom data (class + ivs + chat)
  ├── Sendbird.ts          # sendbird functional data
  ├── FiiveStudio.ts       # fiive studio functional data (new version)
  └── video.ts             # initial fiive studio functional data (old version)
```

## 파일 구성

### 1. /pages

```bash
/pages
  ├── _app.tsx               # initial working component
  ├── _document.tsx          # head tag for metatag component
  ├── index.tsx              # index page component
  ├── learner.tsx            # learner page component
  ├── teacher.tsx            # teacher page component
  ├── chat-monitor.tsx       # export chat room functional page component
  ├── _error.tsx             # undefined error page component
  ├── 404.tsx                # invalid page path component
  ├── not-access.tsx         # unauthorized user page component
  └── question-monitor.tsx   # initial fiive studio question component
```

### 2. /components

```bash
/components
  ├ /Metadata               # post ivs reaction emoji functional component folder
  ├ /Sendbird               # sendbird custom UI component folder
    ├ /components             # sendbird custom UI component folder
    ├ /ResponsiveComponents   # responsive sendbird custom UI component folder
  └─ /VideoComponents       # user's classroom data (class + ivs + chat)
```

### 3. /styles

scss 파일들이 구성되어 있습니다.

# 5. Branch

### main

- 제품으로 출시될 수 있는 브랜치입니다.

### feature-\*

- 기능을 개발하는 브랜치입니다.

### dev

- 다음 출시 버전을 개발하는 브랜치이자 `feature-*` 브랜치가 모이는 브랜치입니다.
  - pull request는 해당 브랜치로 날려주시면 됩니다.

### hotfix

- 출시 버전에서 발생한 버그를 수정하는 브랜치입니다.

### release

- 이번 출시 버전을 준비하는 브랜치입니다.

# 6. Commit Rule

```
$ npm run commit
```

| gitmoji | 의미        | 예시                            |
| ------- | ----------- | ------------------------------- |
| ✨      | 기능 추가   | ✨ ADD : Auth Guard             |
| 🐛      | 버그 수정   | 🐛 BUG : Role Guard             |
| 📝      | 문서 작업   | 📝 DOCS : README on root        |
| 🚑️     | 긴급 수정   | 🚑️ HOTFIX : Login access token |
| ♻️      | 리팩토링    | ♻️ REFACTOR : jwt.strategy      |
| ✅      | 테스트 코드 | ✅ TEST : Auth Guard            |
| 🚚      | 기타        | 🚚 ETC : package.json           |
