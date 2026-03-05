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

    init() {
        // File input change event - wrapper div click
        const fileInputWrapper = this.fileInput.parentElement;
        fileInputWrapper.addEventListener('click', () => this.fileInput.click());
        
        // File input file select
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Start OCR button
        this.startOcrBtn.addEventListener('click', () => this.startProcessing());
        
        // Change file button
        this.changeFileBtn.addEventListener('click', () => this.changeFile());
        
        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadText());
        
        // Download Docx button
        this.downloadDocxBtn.addEventListener('click', () => this.downloadDocx());
        
        // Reset button
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            alert('Vui lòng chọn file PDF');
            this.fileInput.value = '';
            return;
        }
        
        this.currentFile = file;
        this.showSelectedFileInfo();
    }

    showSelectedFileInfo() {
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
        this.processPDF(this.currentFile);
    }

    changeFile() {
        this.fileInput.value = '';
        this.currentFile = null;
        this.extractedText = '';
        this.selectedFileSection.classList.add('hidden');
        this.progressSection.classList.add('hidden');
        this.resultSection.classList.add('hidden');
    }

    async processPDF(file) {
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
        if (!this.extractedText) return;
        
        const element = document.createElement('a');
        const file = new Blob([this.extractedText], { type: 'text/plain; charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `${this.currentFile.name.replace('.pdf', '')}_extracted.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    downloadDocx() {
        if (!this.extractedText) return;

        try {
            // Tách các dòng từ text
            const lines = this.extractedText.split('\n').filter(line => line.trim());
            
            // Tạo các paragraph từ docx library
            const paragraphs = lines.map(line => {
                return new docx.Paragraph({
                    text: line,
                    style: "Normal"
                });
            });

            // Tạo document
            const doc = new docx.Document({
                sections: [{
                    properties: {},
                    children: paragraphs
                }]
            });

            // Tải xuống file
            docx.Packer.toBlob(doc).then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.currentFile.name.replace('.pdf', '')}_extracted.docx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }).catch(err => {
                console.error('Error creating DOCX:', err);
                alert('Lỗi khi tạo file Word');
            });
        } catch (error) {
            console.error('Error downloading DOCX:', error);
            alert('Lỗi khi tải xuống: ' + error.message);
        }
    }

    reset() {
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
    new SmartOCR();
});
