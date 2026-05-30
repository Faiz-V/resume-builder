/**
 * export.js - 导出功能
 * 
 * 本文件负责将简历预览导出为图片（PNG）和 PDF 格式。
 * 
 * 核心技术：
 * 1. html2canvas - 将 HTML DOM 元素渲染为 Canvas 画布（即图片）
 * 2. jsPDF - 将 Canvas 图片写入 PDF 文件
 * 
 * 注意事项：
 * - 由于使用了外部字体和图标，导出效果可能与屏幕显示略有差异
 * - 导出时会自动设置合适的分辨率，确保打印清晰
 */

const ResumeExport = {

    /**
     * 导出为 PNG 图片
     * 流程：HTML -> Canvas -> PNG DataURL -> 下载
     */
    exportPNG: async function() {
        const preview = document.getElementById('resume-preview');
        if (!preview) {
            alert('未找到简历预览区域');
            return;
        }
        
        // 显示提示
        const btn = document.getElementById('btn-export-png');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>生成中...';
        btn.disabled = true;
        
        try {
            // 等待一小段时间，让 UI 更新（按钮状态变化）
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 使用 html2canvas 将简历预览区域转为 Canvas
            // scale: 3 表示 3 倍分辨率，保证图片清晰
            const canvas = await html2canvas(preview, {
                scale: 3,                    // 高清缩放
                useCORS: true,               // 允许跨域图片
                allowTaint: true,            // 允许污染画布（用于渲染外部图标）
                backgroundColor: '#ffffff',  // 背景色设为白色
                logging: false               // 关闭控制台日志
            });
            
            // 将 Canvas 转为 PNG 格式的 Data URL
            const imageData = canvas.toDataURL('image/png');
            
            // 创建下载链接
            const link = document.createElement('a');
            const fileName = this.getFileName() + '.png';
            link.download = fileName;
            link.href = imageData;
            
            // 触发下载（模拟点击）
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('导出 PNG 失败:', error);
            alert('导出失败，请重试。错误：' + error.message);
        } finally {
            // 恢复按钮状态
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },

    /**
     * 导出为 PDF 文件
     * 流程：HTML -> Canvas -> 转为图片 -> 插入 PDF -> 下载
     * 
     * PDF 尺寸说明：
     * - A4 纸尺寸：210mm x 297mm
     * - 在 PDF 中，单位是毫米（mm）
     */
    exportPDF: async function() {
        const preview = document.getElementById('resume-preview');
        if (!preview) {
            alert('未找到简历预览区域');
            return;
        }
        
        // 显示提示
        const btn = document.getElementById('btn-export-pdf');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>生成中...';
        btn.disabled = true;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 第1步：HTML 转 Canvas
            const canvas = await html2canvas(preview, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
            });
            
            // 第2步：获取 Canvas 图片数据
            const imageData = canvas.toDataURL('image/png');
            
            // 第3步：计算 PDF 中的图片尺寸（保持比例）
            // A4 尺寸：210mm x 297mm
            const pdfWidth = 210;
            const pdfHeight = 297;
            
            // 获取 Canvas 的宽高比
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            
            // 根据比例计算在 PDF 中的实际高度
            // 如果简历内容超过一页，需要计算实际高度
            let finalWidth = pdfWidth;
            let finalHeight = pdfWidth / ratio;
            
            // 第4步：创建 PDF 文档
            // jsPDF 的 orientation: 'portrait' 表示纵向，'p' 是缩写
            // unit: 'mm' 使用毫米作为单位
            // format: 'a4' 使用 A4 纸张
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });
            
            // 第5步：如果内容超过一页，需要分页处理
            if (finalHeight <= pdfHeight) {
                // 单页：直接添加图片
                pdf.addImage(imageData, 'PNG', 0, 0, finalWidth, finalHeight);
            } else {
                // 多页：需要裁剪分页（简化处理：缩放以适应单页）
                // 更复杂的分页需要逐行计算，这里先采用缩放方案
                const scale = pdfHeight / finalHeight;
                finalWidth = pdfWidth * scale;
                finalHeight = pdfHeight;
                
                // 居中显示
                const xOffset = (pdfWidth - finalWidth) / 2;
                pdf.addImage(imageData, 'PNG', xOffset, 0, finalWidth, finalHeight);
            }
            
            // 第6步：保存 PDF
            const fileName = this.getFileName() + '.pdf';
            pdf.save(fileName);
            
        } catch (error) {
            console.error('导出 PDF 失败:', error);
            alert('导出失败，请重试。错误：' + error.message);
        } finally {
            // 恢复按钮状态
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },

    /**
     * 生成文件名（基于姓名和当前日期）
     */
    getFileName: function() {
        const name = ResumeEditor.data.personal.name || '简历';
        const date = new Date();
        const dateStr = date.getFullYear() + 
                        String(date.getMonth() + 1).padStart(2, '0') + 
                        String(date.getDate()).padStart(2, '0');
        return name + '_简历_' + dateStr;
    }
};
