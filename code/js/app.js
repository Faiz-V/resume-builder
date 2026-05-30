/**
 * app.js - 主逻辑入口
 * 
 * 这是整个应用的"指挥官"，负责：
 * 1. 页面加载完成后初始化各个模块
 * 2. 绑定所有按钮的点击事件
 * 3. 处理页面切换（模板页 <=> 编辑页）
 * 4. 响应用户的各种操作
 * 
 * 执行顺序：DOMContentLoaded -> init()
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== 1. 初始化编辑器模块 ====================
    // 这会从 localStorage 恢复数据，填充表单，并渲染预览
    ResumeEditor.init();
    
    // ==================== 2. 模板选择功能 ====================
    
    /**
     * 获取所有模板卡片，绑定点击事件
     * 点击后：记录模板类型 -> 切换页面 -> 更新预览
     */
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            // 从 data-template 属性获取模板名称
            const templateName = this.dataset.template;
            
            // 设置当前模板
            ResumeEditor.currentTemplate = templateName;
            
            // 保存到 localStorage（记住用户的选择）
            ResumeEditor.saveData();
            
            // 切换到编辑页面
            showPage('editor');
            
            // 更新预览（使用新选中的模板）
            ResumeEditor.updatePreview();
            
            console.log('已选择模板:', templateName);
        });
    });
    
    // ==================== 3. 导航按钮 ====================
    
    // "选择模板" 按钮 - 返回模板列表页
    document.getElementById('btn-nav-templates').addEventListener('click', function() {
        showPage('templates');
    });
    
    // "编辑简历" 按钮 - 进入编辑器（保持当前模板）
    document.getElementById('btn-nav-editor').addEventListener('click', function() {
        showPage('editor');
        ResumeEditor.updatePreview();
    });
    
    // ==================== 4. 动态添加条目按钮 ====================
    
    // 添加教育背景
    document.getElementById('btn-add-edu').addEventListener('click', function() {
        ResumeEditor.addEducation();
    });
    
    // 添加工作经历
    document.getElementById('btn-add-work').addEventListener('click', function() {
        ResumeEditor.addWork();
    });
    
    // 添加项目经验
    document.getElementById('btn-add-project').addEventListener('click', function() {
        ResumeEditor.addProject();
    });
    
    // 添加技能特长
    document.getElementById('btn-add-skill').addEventListener('click', function() {
        ResumeEditor.addSkill();
    });
    
    // ==================== 5. AI 优化按钮 ====================
    
    document.getElementById('btn-optimize').addEventListener('click', function() {
        // 获取当前简历数据
        const data = ResumeEditor.data;
        
        // 调用优化器分析
        const suggestions = ResumeOptimizer.analyze(data);
        
        // 显示建议弹窗
        ResumeOptimizer.showSuggestions(suggestions);
    });
    
    // ==================== 6. 导出按钮 ====================
    
    // 导出 PDF
    document.getElementById('btn-export-pdf').addEventListener('click', function() {
        ResumeExport.exportPDF();
    });
    
    // 导出 PNG
    document.getElementById('btn-export-png').addEventListener('click', function() {
        ResumeExport.exportPNG();
    });
    
    // ==================== 7. 弹窗关闭按钮 ====================
    
    // 右上角的 X 按钮
    document.getElementById('btn-close-modal').addEventListener('click', function() {
        ResumeOptimizer.hideSuggestions();
    });
    
    // 底部的"知道了，去修改"按钮
    document.getElementById('btn-close-modal-2').addEventListener('click', function() {
        ResumeOptimizer.hideSuggestions();
    });
    
    // 点击弹窗背景（黑色半透明区域）也可以关闭
    document.getElementById('optimize-modal').addEventListener('click', function(e) {
        // e.target 是实际被点击的元素
        // 如果点击的是 modal 本身（而不是里面的内容），则关闭
        if (e.target === this) {
            ResumeOptimizer.hideSuggestions();
        }
    });
    
    // ==================== 8. 键盘快捷键 ====================
    
    // 按 ESC 键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            ResumeOptimizer.hideSuggestions();
        }
    });
    
    // ==================== 页面切换辅助函数 ====================
    
    /**
     * 切换显示的页面
     * @param {string} pageName - 'templates' 或 'editor'
     */
    function showPage(pageName) {
        const templatesPage = document.getElementById('page-templates');
        const editorPage = document.getElementById('page-editor');
        
        if (pageName === 'templates') {
            // 显示模板页，隐藏编辑页
            templatesPage.classList.remove('hidden');
            editorPage.classList.add('hidden');
            
            // 恢复页面滚动（编辑页可能有特殊处理）
            document.body.style.overflow = '';
        } else if (pageName === 'editor') {
            // 隐藏模板页，显示编辑页
            templatesPage.classList.add('hidden');
            editorPage.classList.remove('hidden');
        }
    }
    
    // ==================== 9. 自动保存提示 ====================
    
    // 每隔 30 秒自动保存一次（防止意外丢失）
    setInterval(function() {
        ResumeEditor.saveData();
        console.log('自动保存完成');
    }, 30000);
    
    // 页面关闭前保存
    window.addEventListener('beforeunload', function() {
        ResumeEditor.saveData();
    });
    
    // ==================== 初始化完成 ====================
    console.log('简历应用初始化完成！');
    console.log('当前模板:', ResumeEditor.currentTemplate);
    console.log('简历数据:', ResumeEditor.data);
});
