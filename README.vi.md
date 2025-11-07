<div align="center">
  <img alt="Earthworm" width="120" height="120" src="./assets/logo/logo-1000.png">
  <h1>Earthworm</h1>
  <span>Tiếng Việt | <a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文</a></span>
</div>

<div align="center">
  <br/>
  <a href="https://hellogithub.com/repository/9433615761f548cf9648434c670cd85b" target="_blank"><img src="https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=9433615761f548cf9648434c670cd85b&claim_uid=249cPWvjfNmU7dp" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</div>

## ⚡ Giới thiệu

Học tiếng Anh tốt hơn thông qua việc xây dựng câu với các liên từ~ 😊

## 🚀 Làm thế nào để bắt đầu?

**Tất cả các thao tác được đề cập dưới đây đều dựa trên thư mục gốc của dự án hiện tại, vui lòng chú ý để đảm bảo không có lỗi!**

### Yêu cầu

- **pnpm version >= 8**

  ```bash
  corepack enable
  ```

- **Node.js version >= v20**
  > Sử dụng phiên bản từ .node-version. [Các công cụ được hỗ trợ](https://github.com/shadowspawn/node-version-usage#compatibility-testing)
- **Postgres version >= 14.0.0**
- **Redis version >= 5.0.0**
- **Docker**. Vui lòng đảm bảo nó đã được cài đặt và chạy thành công trên máy local của bạn.

```bash
docker --version # Docker version 24.0.7, build afdd53b

node --version # v20+

pnpm -v # 8+
```

### Trình soạn thảo

#### VSCode

- Cài đặt các extension được khuyến nghị [extensions.json](./.vscode/extensions.json)

### 1. Cài đặt Dependencies

```bash
pnpm install
```

### 2. Cấu hình file `.env`

Bạn có thể chọn sao chép nội dung của `./apps/api/.env.example` vào `./apps/api/.env`. Lưu ý rằng file 'example' chứa cấu hình mẫu. Đây là thông tin biến môi trường của hệ thống lưu trữ chính, chẳng hạn như địa chỉ kết nối database, tên người dùng, mật khẩu, cổng, key, v.v. Dịch vụ backend sẽ đọc cấu hình từ file này, **tất nhiên bạn cũng có thể thay đổi thành thông tin cấu hình của riêng bạn**.

Người dùng Windows nên sử dụng phím tắt để sao chép và dán, người dùng Linux có thể thao tác thông qua lệnh sau.

#### Server

```bash
cp ./apps/api/.env.example ./apps/api/.env
```

#### Client

```bash
cp ./apps/client/.env.example ./apps/client/.env
```

### 3. Khôi phục dữ liệu của Logto

Giải nén `logto_db_init_data.zip` vào `.volumes/`

```bash
unzip logto_db_init_data.zip -d .volumes/
```

- URL Admin: http://localhost:3011
- Tên đăng nhập: admin
- Mật khẩu: WkN7g5-i8ZrJckX

> Nếu bạn muốn [Cấu hình Logto thủ công](https://github.com/cuixueshe/earthworm/wiki/%E8%BF%81%E7%A7%BB-Logto-%E7%94%A8%E6%88%B7%E7%B3%BB%E7%BB%9F%E5%90%8E%E6%9C%AC%E5%9C%B0%E5%90%AF%E5%8A%A8%E9%85%8D%E7%BD%AE%E6%96%B9%E6%A1%88%EF%BC%88%E8%B4%A1%E7%8C%AE%E8%80%85%EF%BC%89)

### 4. Khởi động dịch vụ Docker Compose

Backend phụ thuộc vào các dịch vụ Postgres và Redis. Khởi động và dừng các dịch vụ này bằng cách sử dụng các lệnh được cấu hình trong `package.json` dưới đây.

```bash
# Khởi động
pnpm docker:start

# Khi cần thiết, thực hiện lệnh sau
# Dừng
pnpm docker:stop
# Xóa
pnpm docker:delete
# Xóa hoàn toàn (bao gồm cả dữ liệu Volume)
pnpm docker:down
```

Nếu bạn thích thủ công, bạn có thể sử dụng các lệnh dưới đây.

```bash
docker compose up -d
docker compose stop
docker compose down

# Lệnh tương thích với các phiên bản cũ hơn của Docker
docker-compose up -d
```

### 5. Khởi tạo Database Schema

Khi thực hiện lệnh này, hãy cố gắng giữ một khoảng thời gian ngắn từ lệnh trước, vì tham số `-d` vừa sử dụng sẽ đình chỉ việc thực thi dịch vụ của nó ở chế độ nền. Vào lúc này, dịch vụ docker có thể vẫn đang chạy. Nếu phát hiện lỗi, hãy thực hiện lại.

```bash
pnpm db:init
```

### 6. Tạo và tải lên dữ liệu khóa học

**Chỉ thực hiện trong quá trình khởi tạo Database lần đầu tiên**.

```bash
pnpm db:upload
```

### 7. Khởi động dịch vụ Backend

```bash
pnpm dev:serve
```

### 8. Khởi động dịch vụ Frontend

```bash
pnpm dev:client
```

## 🛠️ Về Testing

**Chạy test trước khi submit commit, và submit code sau khi test pass, để tránh nhiều commit để giải quyết vấn đề test**.

### Frontend Testing

Chủ yếu là unit test của Vitest và automated test của cypress, thực hiện lệnh sau:

```bash
# Vào thư mục dự án frontend
cd apps/client

# vitest
pnpm test:unit:run
# cypress
pnpm test:e2e:run

# Theo dõi vitest, tiện lợi hot update để xem kết quả test
pnpm test:unit:watch
```

### Backend Testing

Chủ yếu là Jest unit test và end-to-end test, nhưng cần truy cập test database, vì vậy bạn cần đảm bảo rằng:

1. Các dịch vụ testdb và testRedis trong Docker Compose đã khởi động bình thường.
2. Thông tin cấu hình trong file `.env.test` là chính xác. Nếu không có file này, bạn có thể sao chép nội dung của file `apps/api/.env.test.example` vào file `apps/api/.env.test`. Lệnh sau được cung cấp để sử dụng trực tiếp.

Thực hiện lệnh sau:

```bash
# Vào thư mục dự án Backend
cd apps/api

# Nếu bạn đã có file .env.test, bạn không cần chạy bước này
cp .env.test.example .env.test

# Unit test
pnpm test:unit
# End-to-end testing
pnpm test:e2e
# Unit test và end-to-end test chạy cùng nhau
pnpm test
```

## Dự án Docs

Dự án dựa trên tài liệu Vitepress, thực hiện lệnh sau:

```bash
# Local Development
pnpm docs:dev
```

## ❓ FAQ

### Kết nối Database thất bại

Docker và database của tôi đang chạy bình thường, nhưng khi tôi chạy lệnh `db:init`, vẫn báo lỗi, cho biết kết nối database thất bại.

Bạn có thể kiểm tra xem cấu hình database trong file `.env` có chính xác không, hoặc thậm chí file này có tồn tại không! 😠

### Làm thế nào để cập nhật dữ liệu khóa học một cách chính xác?

Khi bạn xác định dữ liệu khóa học không chính xác và thực hiện sửa đổi, bạn nên sử dụng lệnh sau để cập nhật dữ liệu khóa học trong database.

```bash
pnpm db:update
```

### Lỗi pnpm Install?

Một số dependencies yêu cầu biên dịch trong quá trình cài đặt, đòi hỏi phải có các môi trường build liên quan.
Nếu các môi trường này không có sẵn, quá trình biên dịch có thể thất bại. Ngoài ra, các module khác nhau có thể yêu cầu các môi trường build khác nhau, vì vậy các vấn đề cụ thể cần được phân tích riêng.
Dưới đây là các vấn đề cụ thể gặp phải cùng với giải pháp của chúng.

Đầu tiên hãy thử lệnh sau để cập nhật `pnpm`.

```shell
pnpm i -g
# hoặc
pnpm i -g pnpm
# hoặc
npx pnpm i -g pnpm@latest
```

**Lỗi cài đặt module argon2 trên Windows**

- Cài đặt Visual Studio 2015 hoặc mới hơn, cụ thể là component "Desktop development with C++". (Trong thực tế, bất kỳ component nào chứa công cụ và thư viện phát triển C++ đều đủ.)
- Nếu bạn gặp vấn đề hiển thị ký tự tiếng Trung trong quá trình biên dịch, hãy thực hiện `chcp 437` trong command prompt, sau đó chạy lại lệnh install.

### Permission Denied trong Docker?

Khi sử dụng WSL2 làm môi trường phát triển trong Windows, lỗi sau xảy ra khi khởi động Docker bằng `docker compose up -d`:

```bash
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied
```

> Giải pháp

Thêm user hiện tại vào nhóm docker

```bash
# Thêm nhóm user docker
sudo groupadd docker
# Thêm user đã đăng nhập vào nhóm user docker
sudo gpasswd -a $USER docker
# Cập nhật nhóm user
newgrp docker
# Kiểm tra xem lệnh docker có hoạt động bình thường không
docker images
```

## 🤝 Hướng dẫn phát triển Frontend

1. Không Destructure Pinia store.
   - Tính dễ đọc sẽ tốt hơn khi sử dụng `store`
   - Destructuring có thể dẫn đến mất reactivity và sử dụng `storeToRefs` cũng khá rườm rà

2. Tránh bao gồm UI logic trong composables.
   - Chẳng hạn như `useMessage`
   - Chúng tôi phân loại router là UI logic, và để dễ dàng test, tránh bao gồm logic liên quan đến router ở đó

## 🚀 Star History

[![Stargazers over time](https://starchart.cc/cuixueshe/earthworm.svg?variant=adaptive)](https://starchart.cc/cuixueshe/earthworm)

## 🌟 Contributing

Cảm ơn mọi người đã đóng góp cho Earthworm! 🎉

<a href="https://github.com//cuixueshe/earthworm/graphs/contributors"><img src="https://contributors.nn.ci/api?repo=cuixueshe/earthworm" /></a>
