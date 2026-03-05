# HƯỚNG DẪN DEPLOY LÊN GITHUB PAGES

## Bước 1: Chuẩn bị Git (nếu chưa có)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Bước 2: Khởi tạo Repository tại thư mục docs
```bash
cd d:\pdf\docs
git init
```

## Bước 3: Thêm tất cả files
```bash
git add .
```

## Bước 4: Commit
```bash
git commit -m "Initial commit: Smart OCR & AI Fixer"
```

## Bước 5: Tạo Repository trên GitHub

**Đặc biệt quan trọng:**
- Vào https://github.com/new
- Tên repository: `smart-ocr` (hoặc tên khác)
- Không khởi tạo README, .gitignore, hoặc license
- Nhấn "Create repository"

## Bước 6: Thêm Remote Repository
```bash
git branch -M main
git remote add origin https://github.com/yourusername/smart-ocr.git
git push -u origin main
```

*Thay `yourusername` bằng tên GitHub của bạn*

## Bước 7: Cấu hình GitHub Pages

1. Vào https://github.com/yourusername/smart-ocr/settings
2. Kéo xuống "Pages" section
3. Chọn:
   - **Source**: "Deploy from a branch"
   - **Branch**: "main"
   - **Folder**: "/ (root)"
4. Nhấn "Save"

## Bước 8: Truy cập ứng dụng

Chỉ cần chờ 1-2 phút, sau đó truy cập:
```
https://yourusername.github.io/smart-ocr
```

## Lệnh hữu ích

### Kiểm tra status
```bash
git status
```

### Xem commit history
```bash
git log
```

### Push commit mới
```bash
git add .
git commit -m "Your message"
git push
```

### Pull code từ GitHub
```bash
git pull
```

## Một số lỗi thường gặp

### Lỗi: "fatal: not a git repository"
**Giải pháp**: Chạy `git init` trong thư mục project

### Lỗi: "Permission denied"
**Giải pháp**: Tạo SSH key hoặc sử dụng Personal Access Token

### GitHub Pages không hoạt động
**Kiểm tra**:
- Repository có public không?
- Branch được set đúng không?
- File index.html có trong folder chỉ định không?

---

Chúc mừng! Ứng dụng của bạn sẽ sớm online! 🎉
