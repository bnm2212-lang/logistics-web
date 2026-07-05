# 물류대쉬보드 웹사이트

React + Vite로 만든 정적 웹사이트입니다.

## 로컬 실행

```powershell
npm install
npm run dev
```

## 배포 방법: Vercel

1. `logistics-web` 폴더를 GitHub 저장소로 올립니다.
2. Vercel에서 `New Project`를 누릅니다.
3. GitHub 저장소를 선택합니다.
4. Root Directory가 `logistics-web`인지 확인합니다.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Deploy를 누릅니다.

배포가 끝나면 `https://...vercel.app` 주소가 생기고, 이 주소를 지인에게 공유하면 됩니다.

## 배포 방법: Netlify

1. Netlify에서 `Add new site`를 누릅니다.
2. GitHub 저장소를 연결합니다.
3. Base directory: `logistics-web`
4. Build command: `npm run build`
5. Publish directory: `logistics-web/dist`

## 데이터 수정

현재 재고 데이터는 `src/inventoryData.json`에 들어 있습니다.
새 엑셀/CSV 데이터를 반영하려면 기존 Python 대시보드에서 데이터를 정리한 뒤 이 JSON을 다시 생성해야 합니다.
