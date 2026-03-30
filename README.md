# 메랜디코 — Mapleland Info Hub

## 폴더 구조
```
mapleland-web/
├── index.html        ← 메인 웹 페이지
├── vercel.json       ← Vercel 라우팅 설정
├── api/
│   └── proxy.js      ← CORS 우회 서버리스 함수
└── README.md
```

## Vercel 배포 방법 (무료, 5분)

### 1단계: GitHub 업로드
1. [github.com](https://github.com) 접속 → New repository
2. 폴더 전체 파일을 업로드 (또는 git push)

### 2단계: Vercel 연결
1. [vercel.com](https://vercel.com) 가입 (GitHub 계정으로 로그인)
2. **Add New Project** → GitHub 저장소 선택
3. **Deploy** 버튼 클릭
4. 완료! `https://your-project.vercel.app` URL 생성됨

### 로컬 테스트 (선택)
```bash
npm install -g vercel
vercel dev
# → http://localhost:3000
```

## 기능
- 🚢 배/엘리베이터 실시간 카운트다운 (1초 단위 갱신)
- 📖 사냥터 시세 (mashop.kr API)
- 💰 아이템 시세 검색 (mapleland.gg 거래소)
- 🌤️ 실시간 날씨 (OpenWeatherMap API)

## API 키 교체
`index.html` 내 `WEATHER_API_KEY` 변수 수정
