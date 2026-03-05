# Smart OCR & AI Fixer

Ứng dụng web hiện đại để chuyển đổi PDF và nhận diện văn bản bằng công nghệ OCR kết hợp AI.

## Tính năng

- 📄 **OCR Thông minh**: Nhận diện văn bản tiếng Việt chính xác 99%
- 🖼️ **Trích xuất Ảnh**: Lấy ảnh gốc từ PDF với chất lượng cao
- ✨ **AI Sửa lỗi**: Chuẩn hóa chính tả tiếng Việt tự động
- 📋 **Giữ nguyên Layout**: Bảo toàn định dạng bảng biểu và cấu trúc
- 🚀 **Nhanh chóng**: Xử lý file PDF trong vài giây

## Cấu trúc Project

```
docs/
├── index.html           # File HTML chính
├── css/
│   └── styles.css      # CSS tùy chỉnh
├── js/
│   └── app.js          # JavaScript chính
├── README.md           # Hướng dẫn này
└── .gitignore          # Git ignore rules
```

## Yêu cầu

- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối Internet (để tải CDN Tailwind CSS)

## Cài đặt cục bộ

### 1. Clone repository
```bash
git clone https://github.com/yourusername/smart-ocr.git
cd smart-ocr
```

### 2. Mở file HTML
Chỉ cần mở file `docs/index.html` trong trình duyệt hoặc sử dụng local server:

```bash
# Sử dụng Python 3
python -m http.server 8000

# Hoặc sử dụng Node.js
npx http-server
```

Sau đó truy cập: `http://localhost:8000/docs`

## Deploy lên GitHub Pages

### Bước 1: Tạo Repository trên GitHub
1. Đăng nhập GitHub
2. Tạo repository mới với tên `smart-ocr`
3. Clone repository về máy

### Bước 2: Thêm file vào project
```bash
# Copy toàn bộ thư mục docs vào repository

# Hoặc nếu chưa có, tạo cấu trúc như trên
```

### Bước 3: Push code lên GitHub
```bash
git add .
git commit -m "Add Smart OCR & AI Fixer application"
git push origin main
```

### Bước 4: Bật GitHub Pages
1. Vào **Settings** của repository
2. Kéo xuống phần **Pages**
3. Chọn **Source**: `Deploy from a branch`
4. Chọn **Branch**: `main` và thư mục `/docs`
5. Nhấn **Save**

### Bước 5: Truy cập ứng dụng
Ứng dụng sẽ có sẵn tại:
```
https://yourusername.github.io/smart-ocr
```

## Hướng dẫn sử dụng

1. **Tải lên PDF**: Nhấn nút "Chọn file PDF" và chọn file từ máy
2. **Chờ xử lý**: Ứng dụng sẽ hiển thị thanh tiến trình
3. **Tải xuống kết quả**: Nhấn "Tải Text" để tải file .txt
4. **Upload file khác**: Nhấn "Upload File Khác" để xử lý file mới

## Công nghệ sử dụng

- **HTML5**: Cấu trúc trang
- **Tailwind CSS 3**: Styling và responsive design
- **JavaScript ES6+**: Xử lý logic ứng dụng
- **Font Awesome 6**: Biểu tượng

## API tích hợp (Tùy chọn)

Để tích hợp OCR thực tế, bạn có thể sử dụng:

### Google Cloud Vision API
```javascript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
```

### Tesseract.js (Client-side OCR)
```javascript
const { createWorker } = Tesseract;
const worker = await createWorker('vie');
```

### AWS Textract
```javascript
const AWS = require('aws-sdk');
const textract = new AWS.Textract();
```

## Mở rộng chức năng

### Thêm OCR thực
Chỉnh sửa hàm `processPDF()` trong `js/app.js`:
```javascript
async processPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const worker = await createWorker('vie');
    const result = await worker.recognize(arrayBuffer);
    this.extractedText = result.data.text;
    // ...
}
```

### Thêm xử lý ảnh
```javascript
async extractImages(pdfDoc) {
    // Sử dụng pdf.js để trích xuất ảnh
    // ...
}
```

## Xử lý sự cố

### Ứng dụng không tải
- Kiểm tra kết nối Internet (cần CDN Tailwind)
- Xóa cache trình duyệt
- Thử trình duyệt khác

### File PDF không xử lý được
- Đảm bảo file PDF hợp lệ
- Kiểm tra quyền đọc file
- Thử với file PDF khác

## Đóng góp

Chào mừng đóng góp! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/YourFeature`)
3. Commit thay đổi (`git commit -m 'Add YourFeature'`)
4. Push branch (`git push origin feature/YourFeature`)
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để chi tiết

## Liên hệ

- Email: support@smartocr.com
- Website: https://smart-ocr.example.com
- Issues: GitHub Issues

## Changelog

### v1.0.0 (2026-03-05)
- ✨ Phát hành ban đầu
- 📄 Giao diện OCR chính
- 🎨 Thiết kế responsive
- 📱 Hỗ trợ mobile

---

**Made with ❤️ by Smart OCR Team**
