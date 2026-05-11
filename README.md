# SPA Web Frontend

Dự án frontend xây dựng trên React 17 + UmiJS + Ant Design v4 (TypeScript).

## Yêu cầu môi trường

- [Node.js](https://nodejs.org/) >= 14
- npm (đi kèm Node.js)
- [Yarn](https://classic.yarnpkg.com/) (sẽ cài ở bước dưới)

## Hướng dẫn chạy dự án sau khi clone

### 1. Clone source code

```bash
git clone <repository-url>
cd SPA_WEB_FRONTEND
```

### 2. Cài đặt Yarn (chỉ cần làm 1 lần trên máy)

```bash
npm install --global yarn
```

Kiểm tra cài đặt thành công:

```bash
yarn --version
```

### 3. Cài đặt các dependencies của dự án

```bash
yarn install
```

### 4. Chạy dự án ở môi trường dev

```bash
yarn start
```

Sau khi chạy xong, mở trình duyệt truy cập địa chỉ hiển thị trong terminal (mặc định là [http://localhost:8000](http://localhost:8000)).

## Các lệnh hữu ích khác

| Lệnh | Mô tả |
| --- | --- |
| `yarn start` | Chạy dev server |
| `yarn build` | Build bản production vào thư mục `dist/` |
| `yarn lint` | Kiểm tra code style |
| `yarn lint:fix` | Tự động sửa lỗi lint |

## Xử lý sự cố thường gặp

- **Lệnh `yarn` không nhận diện được sau khi cài**: đóng và mở lại terminal (hoặc PowerShell) để cập nhật biến môi trường `PATH`.
- **Lỗi khi `yarn install`**: xoá thư mục `node_modules` và file `yarn.lock`, sau đó chạy lại `yarn install`.
- **Cổng 8000 đã được sử dụng**: chạy với cổng khác, ví dụ trên PowerShell: `$env:PORT=3000; yarn start`.
