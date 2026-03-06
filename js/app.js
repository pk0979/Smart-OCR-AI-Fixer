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
        this.downloadDocxBtn = document.getElementById('downloadDocx');
        this.resetBtn = document.getElementById('resetBtn');
        this.startOcrBtn = document.getElementById('startOcrBtn');
        this.changeFileBtn = document.getElementById('changeFileBtn');
        this.selectedFileName = document.getElementById('selectedFileName');
        this.selectedFileSize = document.getElementById('selectedFileSize');
        this.featureSection = document.getElementById('featureSection');
        this.aiToggle = document.getElementById('aiToggle');
        
        this.currentFile = null;
        this.extractedText = '';
        this.aiEnabled = false;
        
        this.init();
    }

    init() {
        console.log('Initializing SmartOCR...');
        
        // AI Toggle
        this.aiToggle.addEventListener('change', (e) => {
            this.aiEnabled = e.target.checked;
            console.log('AI mode:', this.aiEnabled);
        });
        
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
        
        // Download DOCX button
        this.downloadDocxBtn.addEventListener('click', () => {
            console.log('Download DOCX clicked');
            this.downloadDocx();
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            console.log('Reset clicked');
            this.reset();
        });
        
        // Load external libraries dynamically
        this.loadLibraries()
            .then(() => console.log('Libraries loaded successfully'))
            .catch(err => console.error('Library load error:', err));
        
        console.log('%cSmartOCR initialized successfully', 'color: green; font-weight: bold;');
    }

    loadScript(url) {
        return new Promise((resolve, reject) => {
            try {
                const s = document.createElement('script');
                s.src = url;
                s.async = true;
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Failed to load ' + url));
                document.head.appendChild(s);
            } catch (err) {
                reject(err);
            }
        });
    }

    async loadLibraries() {
        const loaders = [];
        if (typeof window.saveAs === 'undefined') {
            loaders.push(this.loadScript('https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/file-saver.min.js'));
        }
        if (typeof window.JSZip === 'undefined') {
            loaders.push(this.loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'));
        }
        if (typeof window.pdfjsLib === 'undefined') {
            loaders.push(this.loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'));
        }
        if (loaders.length === 0) return Promise.resolve();
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Library load timeout')), 15000));
        return Promise.race([Promise.all(loaders), timeout]);
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
        this.featureSection.classList.add('hidden');
        this.progressSection.classList.add('hidden');
        this.resultSection.classList.add('hidden');
        this.selectedFileSection.classList.remove('hidden');
        
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
        this.featureSection.classList.remove('hidden');
    }

    async processPDF(file) {
        console.log('Processing PDF:', file.name);
        this.selectedFileSection.classList.add('hidden');
        this.progressSection.classList.remove('hidden');
        this.resultSection.classList.add('hidden');
        
        try {
            // Set PDF.js worker
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
            }
            
            await this.extractTextFromPDF(file);
            
            this.progressSection.classList.add('hidden');
            this.resultSection.classList.remove('hidden');
            
            const fileName = file.name.replace('.pdf', '');
            this.resultText.textContent = `File "${fileName}" đã được chuyển đổi thành công! Kích thước: ${(file.size / 1024).toFixed(2)} KB` + (this.aiEnabled ? ' (AI Sửa lỗi kích hoạt)' : '');
            
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert('Lỗi khi xử lý file: ' + error.message);
            this.progressSection.classList.add('hidden');
        }
    }

    async extractTextFromPDF(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                
                let fullText = '';
                let processedPages = 0;
                
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                    
                    processedPages++;
                    const progress = (processedPages / pdf.numPages) * 100;
                    this.progressBar.style.width = progress + '%';
                    this.progressPercent.textContent = Math.floor(progress) + '%';
                }
                
                // Apply AI correction if enabled
                this.extractedText = this.aiEnabled ? this.correctSpellingWithAI(fullText) : fullText;
                
                console.log('PDF text extracted successfully');
                resolve();
            } catch (error) {
                console.error('Error extracting PDF:', error);
                reject(error);
            }
        });
    }

    // Simulated OCR (deprecated - using real PDF extraction now)
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
                    this.extractedText = this.generateSampleOCRText(file.name);
                    resolve();
                }
            }, 300);
        });
    }

    generateSampleOCRText(fileName) {
        let text = `=== SMART OCR & AI FIXER ===
Tệp xử lý: ${fileName}
Ngày xử lý: ${new Date().toLocaleString('vi-VN')}
Chế độ AI: ${this.aiEnabled ? 'KÍCH HOẠT' : 'KHÔNG KÍCH HOẠT'}

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

        if (this.aiEnabled) {
            text = this.correctSpellingWithAI(text);
            text += '\n\n[AI CORRECTION APPLIED - Lỗi chính tả đã được sửa]';
        }
        
        return text;
    }

    correctSpellingWithAI(text) {
        // Simple spelling correction for Vietnamese
        let corrected = text;
        
        // Common typo patterns for Vietnamese
        const patterns = [
            { find: /\bduoc\b/gi, replace: 'được' },
            { find: /\bco\b/gi, replace: 'có' },
            { find: /\bva\b/gi, replace: 'và' },
            { find: /\bla\b/gi, replace: 'là' },
            { find: /\bvi\b/gi, replace: 'vì' },
            { find: /\btrren\b/gi, replace: 'trên' },
            { find: /\bdudi\b/gi, replace: 'dưới' },
            { find: /\btrong\b/gi, replace: 'trong' },
            { find: /\bkhong\b/gi, replace: 'không' },
            { find: /\bnhu\b/gi, replace: 'như' },
            { find: /\bcung\b/gi, replace: 'cũng' },
            { find: /\brat\b/gi, replace: 'rất' }
        ];
        
        patterns.forEach(pattern => {
            corrected = corrected.replace(pattern.find, pattern.replace);
        });
        
        return corrected;
    }

    downloadDocx() {
        if (!this.extractedText) {
            alert('Không có nội dung để tải xuống.');
            return;
        }
        
        console.log('downloadDocx called');
        console.log('JSZip available:', typeof window.JSZip);
        console.log('saveAs available:', typeof window.saveAs);
        
        try {
            if (!window.JSZip) {
                console.error('JSZip not available');
                alert('Thư viện đang tải. Vui lòng chờ 2-3 giây và thử lại.');
                return;
            }
            
            if (!window.saveAs) {
                console.error('saveAs not available');
                alert('Thư viện FileSaver đang tải. Vui lòng chờ 2-3 giây và thử lại.');
                return;
            }
            
            const fileName = this.currentFile.name.replace('.pdf', '');
            console.log('Creating DOCX for:', fileName);
            
            // Create Word document structure
            const docContent = this.createWordXML(this.extractedText, fileName);
            
            // Create ZIP file for DOCX
            const zip = new window.JSZip();
            
            // Add [Content_Types].xml
            zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
            
            // Add document.xml.rels
            zip.folder('word').file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);
            
            // Add document.xml
            zip.folder('word').file('document.xml', docContent);
            
            // Add _rels/.rels
            zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
            
            console.log('Generating DOCX blob...');
            // Generate the DOCX file
            zip.generateAsync({ type: 'blob' }).then(blob => {
                console.log('DOCX blob created, size:', blob.size);
                window.saveAs(blob, `${fileName}_extracted.docx`);
                console.log('Word document downloaded successfully');
                alert('✅ Tải Word thành công!');
            }).catch(err => {
                console.error('Error creating DOCX blob:', err);
                alert('Lỗi khi tạo file Word: ' + err.message);
            });
        } catch (error) {
            console.error('Error in downloadDocx:', error);
            alert('Lỗi: ' + error.message);
        }
    }
    
    createWordXML(text, fileName) {
        // Split text into paragraphs
        const paragraphs = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => `<w:p><w:r><w:t>${this.escapeXml(line)}</w:t></w:r></w:p>`)
            .join('');
        
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
<w:p>
<w:pPr>
<w:pStyle w:val="Heading1"/>
</w:pPr>
<w:r>
<w:t>${this.escapeXml(fileName)}</w:t>
</w:r>
</w:p>
${paragraphs}
</w:body>
</w:document>`;
    }
    
    escapeXml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

    reset() {
        console.log('Resetting application');
        this.fileInput.value = '';
        this.currentFile = null;
        this.extractedText = '';
        this.selectedFileSection.classList.add('hidden');
        this.progressSection.classList.add('hidden');
        this.resultSection.classList.add('hidden');
        this.featureSection.classList.remove('hidden');
        this.progressBar.style.width = '0%';
        this.progressPercent.textContent = '0%';
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('%cInitializing SmartOCR', 'color: blue; font-weight: bold;');
    new SmartOCR();
});
