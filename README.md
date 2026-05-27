# Nội thất Đại Đồng (Dai Dong Furniture)

Dự án website thương mại điện tử chuyên cung cấp các sản phẩm nội thất cao cấp.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### 💻 Client (Frontend)
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Giao tiếp API**: Axios
- **Đa ngôn ngữ**: i18next & react-i18next
- **Biểu đồ (Admin/Analytics)**: Recharts
- **Icon**: react-icons

### ⚙️ Server (Backend)
- **Framework**: Express.js 5 (Node.js)
- **Database**: MongoDB (thông qua Mongoose)
- **Xác thực**: JWT (JSON Web Token) & bcryptjs
- **Upload file**: Multer
- **Middleware**: CORS, Cookie-parser, Dotenv

## 📂 Cấu Trúc Thư Mục (Directory Structure)

```text
individual-project/
├── client/          # Chứa mã nguồn Frontend (React + Vite)
│   ├── public/      # Static assets (favicon, images,...)
│   └── src/         # Source code (components, pages, locales,...)
├── server/          # Chứa mã nguồn Backend (Express.js)
│   ├── src/         # Source code (controllers, models, routes,...)
│   └── server.js    # Entry point cho hệ thống backend
└── README.md        # Tài liệu tổng quan dự án (file này)
```

## 🛠 Hướng Dẫn Cài Đặt và Chạy Dự Án (Setup Instructions)

### 1. Yêu cầu hệ thống
- **Node.js** (Khuyến nghị phiên bản 20.x trở lên)
- **MongoDB** (Đang chạy local hoặc có URI kết nối từ MongoDB Atlas)

### 2. Cài đặt và Chạy Backend (Server)

Mở terminal và di chuyển vào thư mục `server`:

```bash
cd server
npm install
```

**Lưu ý**: Hãy tạo file `.env` trong thư mục `server/` và cấu hình các biến môi trường cần thiết (ví dụ: `PORT`, `MONGODB_URI`, `JWT_SECRET`,...).

Chạy server trong môi trường phát triển (development):

```bash
npm run dev
```

*Nếu bạn cần tạo tài khoản Admin mặc định ban đầu, bạn có thể chạy:*
```bash
npm run seed:admin
```

### 3. Cài đặt và Chạy Frontend (Client)

Mở một tab terminal mới và di chuyển vào thư mục `client`:

```bash
cd client
npm install
```

Chạy client trong môi trường phát triển (development):

```bash
npm run dev
```

Sau khi chạy thành công, ứng dụng Frontend sẽ hiển thị tại đường dẫn Localhost (mặc định của Vite thường là `http://localhost:5173`).
