// Smart OCR & AI Fixer - Main Application
class SmartOCR {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.progressSection = document.getElementById('progressSection');
        this.resultSection = document.getElementById('resultSection');
        this.selectedFileSection = document.getElementById('selectedFileSection');
        this.progressBar = document.getElementById('progressBar');
        this.progressPercent = document.getElementById('progressPercent');
        this.resultText = document.getElementById('resultText');
        this.downloadBtn = document.getElementById('downloadTxt');
        this.downloadDocxBtn = document.getElementById('downloadDocx');
        this.resetBtn = document.getElementById('resetBtn');
        this.startOcrBtn = document.getElementById('startOcrBtn');
        this.changeFileBtn = document.getElementById('changeFileBtn');
        this.selectedFileName = document.getElementById('selectedFileName');
        this.selectedFileSize = document.getElementById('selectedFileSize');
        
        this.currentFile = null;
        this.extractedText = '';
        
        this.init();
    }

    downloadDocx() {
        if (!this.extractedText) {
            alert('Không có teks để download');
            return;
        }

        try {
            if (typeof window.docx === 'undefined' || typeof window.docx.Document === 'undefined') {
                console.error('docx library not available');
                alert('Lỗi: Thư viện tạo Word chưa sẵn sàng. Vui lòng tải lại trang và thử lại.');
                return;
            }

            const { Document, Packer, Paragraph } = window.docx;
            const lines = this.extractedText.split('\n').filter(l => l.trim());
            const paragraphs = lines.map(line => new Paragraph({ text: line }));
            const doc = new Document({ sections: [{ children: paragraphs }] });

            Packer.toBlob(doc).then(blob => {
                if (typeof saveAs === 'function') {
                    saveAs(blob, `${this.currentFile.name.replace('.pdf', '')}_extracted.docx`);
                } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${this.currentFile.name.replace('.pdf', '')}_extracted.docx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                console.log('DOCX downloaded');
            }).catch(err => {
                console.error('Error creating DOCX:', err);
                alert('Lỗi khi tạo file Word: ' + err.message);
            });

        } catch (err) {
            console.error('downloadDocx error:', err);
            alert('Lỗi: ' + err.message);
        }
    }

    init() {
        console.log('Initializing SmartOCR...');
        
        // File input change event - this fires when user selects a file
        this.fileInput.addEventListener('change', (e) => {
            console.log('File change event triggered', e.target.files);
            if (e.target.files && e.target.files.length > 0) {
                this.handleFileSelect(e);
            }
        });
        
        // Start OCR button
        this.startOcrBtn.addEventListener('click', () => {
            console.log('Start OCR clicked');
            this.startProcessing();
        });
        
        // Change file button - reset input and trigger click
        this.changeFileBtn.addEventListener('click', (e) => {
            console.log('Change file clicked');
            e.preventDefault();
            this.fileInput.value = '';
            this.fileInput.click();
        });
        
        // Download buttons
        this.downloadBtn.addEventListener('click', () => {
            console.log('Download TXT clicked');
            this.downloadText();
        });

        this.downloadDocxBtn.addEventListener('click', () => {
            console.log('Download DOCX clicked');
            this.downloadDocx();
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            console.log('Reset clicked');
            this.reset();
        });
        

        
        console.log('%cSmartOCR initialized successfully', 'color: green; font-weight: bold;');
    }


    handleFileSelect(event) {
        console.log('handleFileSelect called');
        const file = event.target.files[0];
        
        if (!file) {
            console.log('No file selected');
            return;
        }
        
        console.log('File selected:', file.name, file.size, file.type);
        
        if (file.type !== 'application/pdf') {
            alert('Vui lòng chọn file PDF');
            this.fileInput.value = '';
            return;
        }
        
        this.currentFile = file;
        this.showSelectedFileInfo();
    }

    showSelectedFileInfo() {
        console.log('Show selected file info');
        // Hide progress and result sections
        this.progressSection.classList.add('hidden');
        this.resultSection.classList.add('hidden');
        
        // Show selected file info
        this.selectedFileSection.classList.remove('hidden');
        
        // Update file info
        this.selectedFileName.textContent = this.currentFile.name;
        const sizeInKB = (this.currentFile.size / 1024).toFixed(2);
        const sizeInMB = this.currentFile.size > 1024 * 1024 
            ? (this.currentFile.size / (1024 * 1024)).toFixed(2) + ' MB'
            : sizeInKB + ' KB';
        this.selectedFileSize.textContent = `Kích thước: ${sizeInMB}`;
    }

    startProcessing() {
        console.log('Starting processing');
        if (this.currentFile) {
            this.processPDF(this.currentFile);
        } else {
            alert('Vui lòng chọn file PDF trước');
        }
    }

    changeFile() {
        console.log('Changing file');
        this.fileInput.value = '';
        this.currentFile = null;
        this.extractedText = '';
        this.selectedFileSection.classList.add('hidden');
        this.progressSection.classList.add('hidden');
        this.resultSection.classList.add('hidden');
    }

    async processPDF(file) {
        console.log('Processing PDF:', file.name);
        // Hide selected file section
        this.selectedFileSection.classList.add('hidden');
        
        // Show progress section
        this.progressSection.classList.remove('hidden');
        this.resultSection.classList.add('hidden');
        
        try {
            // Simulate OCR processing with progress
            await this.simulateOCRProcessing(file);
            
            // Show result section
            this.progressSection.classList.add('hidden');
            this.resultSection.classList.remove('hidden');
            
            // Update result text
            const fileName = file.name.replace('.pdf', '');
            this.resultText.textContent = `File "${fileName}" đã được xử lý thành công! Kích thước: ${(file.size / 1024).toFixed(2)} KB`;
            
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert('Lỗi khi xử lý file: ' + error.message);
            this.progressSection.classList.add('hidden');
        }
    }

    async simulateOCRProcessing(file) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress > 100) progress = 100;
                
                this.progressBar.style.width = progress + '%';
                this.progressPercent.textContent = Math.floor(progress) + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Simulate OCR extraction
                    this.extractedText = this.generateSampleOCRText(file.name);
                    
                    resolve();
                }
            }, 300);
        });
    }

    generateSampleOCRText(fileName) {
        return `=== SMART OCR & AI FIXER ===
Tệp xử lý: ${fileName}
Ngày xử lý: ${new Date().toLocaleString('vi-VN')}

--- NỘI DUNG TÀI LIỆU ---

Xin chào! Đây là kết quả OCR từ tài liệu PDF của bạn.

TÍNH NĂNG CHÍNH:
1. Nhận diện văn bản tiếng Việt chính xác
2. Giữ nguyên định dạng bảng biểu
3. Trích xuất ảnh gốc có chất lượng cao
4. Sửa lỗi chính tả bằng AI

HƯỚNG DẪN SỬ DỤNG:
- Tải lên file PDF của bạn
- Chờ hệ thống xử lý
- Tải xuống kết quả dưới dạng text hoặc Word

GHI CHÚ:
Ứng dụng này sử dụng công nghệ OCR hiện đại kết hợp AI 
để cung cấp kết quả tốt nhất cho các tài liệu tiếng Việt.

--- HẾT NỘI DUNG ---`;
    }

    downloadText() {
        if (!this.extractedText) {
            alert('Tidak ada teks untuk download');
            return;
        }
        
        const element = document.createElement('a');
        const file = new Blob([this.extractedText], { type: 'text/plain; charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `${this.currentFile.name.replace('.pdf', '')}_extracted.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        console.log('Text file downloaded');
    }

    reset() {
        console.log('Resetting application');
        this.fileInput.value = '';
        this.currentFile = null;
        this.extractedText = '';
        this.selectedFileSection.classList.add('hidden');
        this.progressSection.classList.add('hidden');
        this.resultSection.classList.add('hidden');
        this.progressBar.style.width = '0%';
        this.progressPercent.textContent = '0%';
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('%cInitializing SmartOCR', 'color: blue; font-weight: bold;');
    new SmartOCR();
});
