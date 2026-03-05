# HƯỚNG DẪN NHANH - Smart OCR & AI Fixer

## 📦 Cấu trúc thư mục
```
docs/
├── index.html          👈 Tệp chính - Mở file này trong trình duyệt
├── css/
│   └── styles.css      CSS tùy chỉnh
├── js/
│   └── app.js          Logic ứng dụng
├── README.md           Tài liệu chi tiết
├── DEPLOYMENT.md       Hướng dẫn GitHub Pages
└── package.json        Thông tin dự án
```

## 🚀 Bước 1: Chạy cục bộ

### Cách 1: Mở file HTML trực tiếp
```bash
# Windows
start docs/index.html

# macOS
open docs/index.html

# Linux
xdg-open docs/index.html
```

### Cách 2: Sử dụng local server (Khuyến nghị)
```bash
# Nếu có Python 3
cd docs
python -m http.server 8000

# Nếu có Node.js
npx http-server docs -p 8000

# Nếu có PHP
php -S localhost:8000 -t docs
```

Sau đó truy cập: **http://localhost:8000**

## 🔧 Bước 2: Cấu hình Git (lần đầu)

```bash
# 1. Cài đặt Git (nếu chưa có)
# https://git-scm.com/download

# 2. Thiết lập thông tin
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## 📤 Bước 3: Đẩy lên GitHub

### 3.1 Tạo GitHub Account
- Vào https://github.com
- Nhấn "Sign up"
- Hoàn thành thông tin

### 3.2 Tạo Repository mới
- Nhấn "+" icon → "New repository"
- Tên: `smart-ocr`
- Chọn "Public"
- Bỏ chọn "Add a README file"
- Nhấn "Create repository"

### 3.3 Upload code
```bash
# Vào thư mục docs
cd d:\pdf\docs

# Khởi tạo Git
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit"

# Set branch name
git branch -M main

# Thêm remote URL (thay username)
git remote add origin https://github.com/YOUR_USERNAME/smart-ocr.git

# Đẩy code
git push -u origin main
```

### 3.4 Bật GitHub Pages
1. Vào **Repository Settings**
2. Kéo xuống **Pages**
3. Chọn **Branch**: `main`, **Folder**: `/` (root)
4. Nhấn **Save**
5. Chờ 1-2 phút

## ✅ Bước 4: Truy cập ứng dụng online

```
https://YOUR_USERNAME.github.io/smart-ocr
```

**Ví dụ**: `https://john123.github.io/smart-ocr`

---

## 🎯 Chức năng hiện tại

✅ Giao diện đẹp, responsive  
✅ Upload file PDF  
✅ Hiệu ứng tiến trình  
✅ Tải xuống kết quả  
⏳ OCR thực (cần API hoặc library)  

## 📝 Cập nhật thêm OCR thực

Để thêm OCR thực, sửa file `js/app.js`:

### Sử dụng Tesseract.js (Miễn phí, Client-side)
```javascript
// Thêm script vào index.html
<script src="https://cdn.jsdelivr.net/npm/tesseract.js"></script>

// Trong js/app.js, thêm:
async processPDF(file) {
    const { createWorker } = Tesseract;
    const worker = await createWorker('vie'); // Tiếng Việt
    const pdf = await pdfjsLib.getDocument(/* file */);
    // ... xử lý
}
```

### Sử dụng Google Cloud Vision (Trả phí, nhưng chính xác)
```javascript
const vision = require('@google-cloud/vision');
// ...
```

## 🐛 Xử lý sự cố

### ❌ "fatal: not a git repository"
```bash
git init
```

### ❌ Lỗi 404 trên GitHub Pages
- Đảm bảo file `index.html` ở thư mục gốc
- Kiểm tra settings → Pages → branch/folder đúng?

### ❌ File CSS/JS không tải
- Kiểm tra đường dẫn file có đúng?
- Xóa cache: Ctrl+Shift+Delete

---

## 💡 Tips

- **Phát triển cục bộ trước**: Kiểm tra mọi thứ trên localhost
- **Commit thường xuyên**: `git commit -m "Description"` sau mỗi thay đổi
- **Sửa lỗi**: Push lại: `git push`
- **Làm sạch repo**: `git rm --cached filename` để xóa file không cần thiết

---

## 📞 Hỗ trợ

- **GitHub Issues**: https://github.com/YOUR_USERNAME/smart-ocr/issues
- **GitHub Discussions**: https://github.com/YOUR_USERNAME/smart-ocr/discussions
- **Email**: Tương ứng GitHub account

---

**Khoảng 5-10 phút là ứng dụng bạn sẽ online! 🎉**
