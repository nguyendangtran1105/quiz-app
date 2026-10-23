# Quiz App – Assignment 4 (Full-stack)

- **backend/**: Node.js + Express + MongoDB (Mongoose), JWT auth, CRUD cho quiz và question, có validation
  - Cấu trúc kiểu express-generator: `app.js` cấu hình Express (middleware, routes, lỗi), `bin/www` kết nối MongoDB và bật HTTP server
- **frontend/**: React + Redux Toolkit + React Router + Bootstrap 5 (Vite, port 3001)

Tài khoản mẫu (sau khi chạy `npm run seed`):
- `Mary / 123` là admin
- `John / 123` là user thường

## Chạy local

```bash
# Terminal 1
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run seed
npm run dev                 # http://localhost:5000

# Terminal 2
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev                 # http://localhost:3001
```

## API

Mọi route (trừ login/signup) cần header `Authorization: Bearer <token>`. Các route thêm/sửa/xóa chỉ admin gọi được.

| Method | URL | Quyền |
|---|---|---|
| POST | /api/auth/signup | public |
| POST | /api/auth/login | public |
| GET | /api/auth/me | user |
| GET | /api/quizzes, /api/quizzes/:id | user |
| POST/PUT/DELETE | /api/quizzes(/:id) | admin |
| GET | /api/questions, /api/questions/:id | user |
| POST/PUT/DELETE | /api/questions(/:id) | admin |

Ví dụ body khi tạo câu hỏi:
```json
{ "text": "...", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 0, "quizId": "(tùy chọn)" }
```

## Deploy

1. **MongoDB Atlas**: tạo cluster M0, tạo DB user, Network Access thêm `0.0.0.0/0`, rồi copy chuỗi `mongodb+srv://...`.
2. **Render** (backend): New Web Service với các cấu hình sau:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Biến môi trường: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
3. **Vercel** (frontend): Root Directory `frontend`, biến môi trường `VITE_API_URL=https://<render-url>/api`. File `vercel.json` đã có sẵn để refresh trang không bị lỗi 404.
4. Sửa lại `CLIENT_URL` trên Render thành link Vercel.
5. Seed dữ liệu lên Atlas: ở máy, đổi `MONGO_URI` trong `backend/.env` thành chuỗi Atlas rồi chạy `npm run seed`.
