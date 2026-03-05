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
            // Check if required libraries are loaded
            if (typeof JSZip === 'undefined') {
                alert('Lỗi: Thư viện không tải được. Vui lòng tải lại trang.');
                return;
            }

            // Tạo docx file bằng JSZip
            const zip = new JSZip();
            
            // Tạo folder structure
            zip.folder('_rels');
            zip.folder('word').folder('_rels');
            zip.folder('word').file('document.xml', this.createWordXML());
            zip.folder('customXml');
            zip.file('[Content_Types].xml', this.createContentTypesXML());
            zip.folder('_rels').file('.rels', this.createRelsXML());
            zip.folder('word/_rels').file('document.xml.rels', this.createDocumentRelsXML());

            // Generate file
            zip.generateAsync({type : "blob"}).then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.currentFile.name.replace('.pdf', '')}_extracted.docx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            });
        } catch (error) {
            console.error('Error downloading DOCX:', error);
            alert('Lỗi khi tải xuống: ' + error.message);
        }
    }

    createWordXML() {
        const content = this.extractedText.split('\n').filter(line => line.trim()).map(line => {
            return `<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr><w:r><w:rPr><w:rStyle w:val="Normal"/></w:rPr><w:t>${this.escapeXml(line)}</w:t></w:r></w:p>`;
        }).join('');

        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${content}<w:sectPr><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    }

    createContentTypesXML() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
    }

    createRelsXML() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
    }

    createDocumentRelsXML() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
    }

    escapeXml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
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
