# 하루잇(HaruEat) - 습관 관리 서비스

## 프로젝트 소개
하루잇은 사용자들이 일상 속 좋은 습관을 만들고 서로 공유할 수 있는 웹 서비스입니다. 사용자들은 자신만의 루틴을 등록하고, 다른 사용자들과 공유하며 서로 응원할 수 있습니다.

## 기술 스택
- **프론트엔드**: Next.js, React
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **API 통신**: TanStack Query, Axios
- **백엔드**: Next.js API Routes
- **데이터베이스**: MongoDB (Prisma ORM)
- **개발 환경**: Turborepo (모노레포)

## 폴더 구조
```
/
├── apps/
│   └── web/ (메인 애플리케이션)
│       ├── src/
│       │   ├── app/ (Next.js 라우팅)
│       │   ├── components/ (컴포넌트)
│       │   ├── hooks/ (커스텀 훅)
│       │   ├── stores/ (Zustand 스토어)
│       │   ├── types/ (타입 정의)
│       │   └── apis/ (API 통신)
│       └── prisma/ (DB 스키마 및 시드 데이터)
└── packages/
    ├── ui/ (공통 UI 컴포넌트)
    ├── eslint-config/ (ESLint 설정)
    └── typescript-config/ (TypeScript 설정)
```

## 주요 기능
- 사용자 인증 및 프로필 관리
- 루틴 생성 및 관리
- 태그별 루틴 조회
- 루틴 공유 및 소셜 기능 (좋아요, 댓글)
- 반응형 UI

## 시작하기

### 설치하기
```bash
# 의존성 설치
pnpm i
```

### 환경 변수 설정
`apps/web` 디렉토리에 `.env` 파일을 생성하고 다음 변수를 설정하세요:
```
DATABASE_URL="mongodb://..."
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 개발 서버 실행
```bash
# 개발 서버 실행
pnpm run web:dev
```

### 데이터베이스 시드 데이터 생성
```bash
# apps/web 디렉토리로 이동
cd apps/web

# 데이터베이스 시드 데이터 생성
pnpm run seed
```

## 프로젝트 구조 설명

### 페이지 구조
- `/initial` - 초기 사용자 설정 페이지
- `/home` - 메인 페이지 (루틴 목록)
- `/add` - 루틴 추가 페이지
- `/bookmark` - 북마크 페이지
- `/badge` - 배지 페이지
- `/mypage` - 내 정보 페이지

### 데이터 모델
- User (사용자)
- Routine (루틴)
- RoutineLog (루틴 수행 기록)
- Comment (댓글)
- Like (좋아요)

## 참고사항
- 환경변수 설정에 어려움이 있으시면 개발팀에 문의해주세요.
- 모노레포 구조로 설계되어 있어 패키지 간 의존성 관리가 용이합니다.
- Turborepo를 활용한 빌드 최적화가 적용되어 있습니다.

## 향후 계획
- 사용자 인증 기능 강화
- 루틴 추천 알고리즘 개선
- 모바일 앱 지원
