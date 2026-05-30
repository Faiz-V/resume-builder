/**
 * editor.js - 编辑器逻辑
 * 
 * 核心职责：
 * 1. 维护简历数据对象（内存中）
 * 2. 动态渲染表单（教育、工作、项目、技能的增删改）
 * 3. 监听输入变化，实时更新预览
 * 4. 自动保存到 localStorage（浏览器本地存储）
 * 5. 从 localStorage 恢复数据（刷新页面不丢失）
 */

const ResumeEditor = {
    // ==================== 数据定义 ====================
    
    // 当前选中的模板名称（minimal / business / creative）
    currentTemplate: 'minimal',
    
    // 简历数据结构：这是整个应用的核心数据
    data: {
        personal: {
            name: '',      // 姓名
            phone: '',     // 电话
            email: '',     // 邮箱
            job: '',       // 求职意向
            summary: ''    // 个人简介
        },
        education: [],     // 教育背景数组
        work: [],          // 工作经历数组
        projects: [],      // 项目经验数组
        skills: []         // 技能特长数组
    },

    // localStorage 中使用的键名
    STORAGE_KEY: 'resume_app_data',

    // ==================== 初始化 ====================
    
    /**
     * 初始化编辑器
     * 页面加载时调用，负责恢复数据和绑定事件
     */
    init: function() {
        // 第1步：尝试从 localStorage 恢复之前保存的数据
        this.loadData();
        
        // 第2步：将恢复的数据填充到表单中
        this.fillPersonalForm();
        this.renderAllLists();
        
        // 第3步：绑定所有输入框的监听事件（实现实时预览）
        this.bindInputListeners();
        
        // 第4步：更新右侧预览
        this.updatePreview();
    },

    // ==================== localStorage 操作 ====================
    
    /**
     * 保存数据到 localStorage
     * localStorage 是浏览器自带的本地存储，数据不会随页面刷新丢失
     */
    saveData: function() {
        try {
            // JSON.stringify：将 JavaScript 对象转为字符串（localStorage 只能存字符串）
            const jsonString = JSON.stringify({
                template: this.currentTemplate,
                data: this.data
            });
            localStorage.setItem(this.STORAGE_KEY, jsonString);
        } catch (e) {
            console.error('保存数据失败:', e);
        }
    },

    /**
     * 从 localStorage 读取数据
     */
    loadData: function() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                // JSON.parse：将字符串转回 JavaScript 对象
                const parsed = JSON.parse(saved);
                if (parsed.data) {
                    this.data = parsed.data;
                }
                if (parsed.template) {
                    this.currentTemplate = parsed.template;
                }
            }
        } catch (e) {
            console.error('读取数据失败:', e);
        }
    },

    // ==================== 数据更新与预览 ====================
    
    /**
     * 更新右侧简历预览
     * 根据当前选中的模板和数据，生成 HTML 并插入预览区
     */
    updatePreview: function() {
        const previewContainer = document.getElementById('resume-preview');
        if (!previewContainer) return;
        
        // 获取当前模板对应的渲染函数
        const templateFunc = ResumeTemplates[this.currentTemplate];
        if (templateFunc) {
            // 生成简历 HTML
            previewContainer.innerHTML = templateFunc(this.data);
        }
    },

    /**
     * 保存数据并更新预览（每次输入变化后调用）
     */
    sync: function() {
        this.saveData();
        this.updatePreview();
    },

    // ==================== 个人信息表单 ====================
    
    /**
     * 将数据填充到个人信息表单
     */
    fillPersonalForm: function() {
        document.getElementById('input-name').value = this.data.personal.name || '';
        document.getElementById('input-phone').value = this.data.personal.phone || '';
        document.getElementById('input-email').value = this.data.personal.email || '';
        document.getElementById('input-job').value = this.data.personal.job || '';
        document.getElementById('input-summary').value = this.data.personal.summary || '';
    },

    /**
     * 绑定个人信息输入框的监听事件
     */
    bindInputListeners: function() {
        const self = this;
        
        // 定义需要监听的字段和对应的数据路径
        const fields = [
            { id: 'input-name', key: 'name' },
            { id: 'input-phone', key: 'phone' },
            { id: 'input-email', key: 'email' },
            { id: 'input-job', key: 'job' },
            { id: 'input-summary', key: 'summary' }
        ];
        
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                // 'input' 事件：每次键盘输入都会触发，实现实时更新
                element.addEventListener('input', function() {
                    self.data.personal[field.key] = this.value;
                    self.sync();
                });
            }
        });
    },

    // ==================== 动态列表渲染（教育、工作、项目、技能） ====================
    
    /**
     * 渲染所有动态列表
     */
    renderAllLists: function() {
        this.renderEducationList();
        this.renderWorkList();
        this.renderProjectList();
        this.renderSkillList();
    },

    // ---------- 教育背景 ----------
    
    renderEducationList: function() {
        const container = document.getElementById('edu-list');
        if (!container) return;
        container.innerHTML = this.data.education.map((item, index) => this.createEduForm(item, index)).join('');
        this.bindListListeners('edu', ['school', 'major', 'degree', 'time', 'description']);
    },

    createEduForm: function(item, index) {
        return `
            <div class="form-item" data-index="${index}" data-type="edu">
                <span class="btn-delete" onclick="ResumeEditor.removeEducation(${index})"><i class="fas fa-trash-alt"></i> 删除</span>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">学校名称</label>
                        <input type="text" class="edu-school w-full border rounded px-2 py-1 text-sm" placeholder="如：北京大学" value="${escapeHtml(item.school)}">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">专业</label>
                        <input type="text" class="edu-major w-full border rounded px-2 py-1 text-sm" placeholder="如：计算机科学" value="${escapeHtml(item.major)}">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">学历</label>
                        <input type="text" class="edu-degree w-full border rounded px-2 py-1 text-sm" placeholder="如：本科" value="${escapeHtml(item.degree)}">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">时间段</label>
                        <input type="text" class="edu-time w-full border rounded px-2 py-1 text-sm" placeholder="如：2018 - 2022" value="${escapeHtml(item.time)}">
                    </div>
                </div>
                <div class="mt-2">
                    <label class="block text-xs text-gray-500 mb-1">描述（可选）</label>
                    <textarea class="edu-description w-full border rounded px-2 py-1 text-sm resize-none" rows="2" placeholder="在校经历、荣誉奖项等...">${escapeHtml(item.description)}</textarea>
                </div>
            </div>
        `;
    },

    addEducation: function() {
        this.data.education.push({
            school: '',
            major: '',
            degree: '',
            time: '',
            description: ''
        });
        this.renderEducationList();
        this.sync();
    },

    removeEducation: function(index) {
        this.data.education.splice(index, 1);
        this.renderEducationList();
        this.sync();
    },

    // ---------- 工作经历 ----------
    
    renderWorkList: function() {
        const container = document.getElementById('work-list');
        if (!container) return;
        container.innerHTML = this.data.work.map((item, index) => this.createWorkForm(item, index)).join('');
        this.bindListListeners('work', ['company', 'position', 'time', 'description']);
    },

    createWorkForm: function(item, index) {
        return `
            <div class="form-item" data-index="${index}" data-type="work">
                <span class="btn-delete" onclick="ResumeEditor.removeWork(${index})"><i class="fas fa-trash-alt"></i> 删除</span>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">公司名称</label>
                        <input type="text" class="work-company w-full border rounded px-2 py-1 text-sm" placeholder="如：某某科技有限公司" value="${escapeHtml(item.company)}">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">职位</label>
                        <input type="text" class="work-position w-full border rounded px-2 py-1 text-sm" placeholder="如：前端工程师" value="${escapeHtml(item.position)}">
                    </div>
                </div>
                <div class="mt-2">
                    <label class="block text-xs text-gray-500 mb-1">时间段</label>
                    <input type="text" class="work-time w-full border rounded px-2 py-1 text-sm" placeholder="如：2022.06 - 至今" value="${escapeHtml(item.time)}">
                </div>
                <div class="mt-2">
                    <label class="block text-xs text-gray-500 mb-1">工作描述</label>
                    <textarea class="work-description w-full border rounded px-2 py-1 text-sm resize-none" rows="3" placeholder="描述你的工作职责和业绩...
建议用数据量化成果，如：提升页面加载速度 30%">${escapeHtml(item.description)}</textarea>
                </div>
            </div>
        `;
    },

    addWork: function() {
        this.data.work.push({
            company: '',
            position: '',
            time: '',
            description: ''
        });
        this.renderWorkList();
        this.sync();
    },

    removeWork: function(index) {
        this.data.work.splice(index, 1);
        this.renderWorkList();
        this.sync();
    },

    // ---------- 项目经验 ----------
    
    renderProjectList: function() {
        const container = document.getElementById('project-list');
        if (!container) return;
        container.innerHTML = this.data.projects.map((item, index) => this.createProjectForm(item, index)).join('');
        this.bindListListeners('project', ['name', 'role', 'time', 'description']);
    },

    createProjectForm: function(item, index) {
        return `
            <div class="form-item" data-index="${index}" data-type="project">
                <span class="btn-delete" onclick="ResumeEditor.removeProject(${index})"><i class="fas fa-trash-alt"></i> 删除</span>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">项目名称</label>
                        <input type="text" class="project-name w-full border rounded px-2 py-1 text-sm" placeholder="如：电商平台重构" value="${escapeHtml(item.name)}">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">担任角色</label>
                        <input type="text" class="project-role w-full border rounded px-2 py-1 text-sm" placeholder="如：前端负责人" value="${escapeHtml(item.role)}">
                    </div>
                </div>
                <div class="mt-2">
                    <label class="block text-xs text-gray-500 mb-1">时间段</label>
                    <input type="text" class="project-time w-full border rounded px-2 py-1 text-sm" placeholder="如：2023.01 - 2023.06" value="${escapeHtml(item.time)}">
                </div>
                <div class="mt-2">
                    <label class="block text-xs text-gray-500 mb-1">项目描述</label>
                    <textarea class="project-description w-full border rounded px-2 py-1 text-sm resize-none" rows="3" placeholder="描述项目背景、你的职责、取得的成果...
建议包含：技术栈、团队规模、量化成果">${escapeHtml(item.description)}</textarea>
                </div>
            </div>
        `;
    },

    addProject: function() {
        this.data.projects.push({
            name: '',
            role: '',
            time: '',
            description: ''
        });
        this.renderProjectList();
        this.sync();
    },

    removeProject: function(index) {
        this.data.projects.splice(index, 1);
        this.renderProjectList();
        this.sync();
    },

    // ---------- 技能特长 ----------
    
    renderSkillList: function() {
        const container = document.getElementById('skill-list');
        if (!container) return;
        container.innerHTML = this.data.skills.map((item, index) => this.createSkillForm(item, index)).join('');
        this.bindListListeners('skill', ['name', 'level']);
    },

    createSkillForm: function(item, index) {
        return `
            <div class="form-item" data-index="${index}" data-type="skill">
                <span class="btn-delete" onclick="ResumeEditor.removeSkill(${index})"><i class="fas fa-trash-alt"></i> 删除</span>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">技能名称</label>
                        <input type="text" class="skill-name w-full border rounded px-2 py-1 text-sm" placeholder="如：JavaScript" value="${escapeHtml(item.name)}">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">熟练程度（可选）</label>
                        <select class="skill-level w-full border rounded px-2 py-1 text-sm">
                            <option value="" ${!item.level ? 'selected' : ''}>请选择</option>
                            <option value="入门" ${item.level === '入门' ? 'selected' : ''}>入门</option>
                            <option value="初级" ${item.level === '初级' ? 'selected' : ''}>初级</option>
                            <option value="熟练" ${item.level === '熟练' ? 'selected' : ''}>熟练</option>
                            <option value="精通" ${item.level === '精通' ? 'selected' : ''}>精通</option>
                            <option value="专家" ${item.level === '专家' ? 'selected' : ''}>专家</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    },

    addSkill: function() {
        this.data.skills.push({
            name: '',
            level: ''
        });
        this.renderSkillList();
        this.sync();
    },

    removeSkill: function(index) {
        this.data.skills.splice(index, 1);
        this.renderSkillList();
        this.sync();
    },

    // ==================== 通用列表事件绑定 ====================
    
    /**
     * 绑定动态列表中输入框的事件
     * @param {string} type - 类型前缀（edu, work, project, skill）
     * @param {string[]} fields - 字段名数组
     */
    bindListListeners: function(type, fields) {
        const self = this;
        const containerMap = {
            'edu': 'edu-list',
            'work': 'work-list',
            'project': 'project-list',
            'skill': 'skill-list'
        };
        const dataMap = {
            'edu': 'education',
            'work': 'work',
            'project': 'projects',
            'skill': 'skills'
        };
        
        const container = document.getElementById(containerMap[type]);
        if (!container) return;
        
        // 遍历所有条目
        const items = container.querySelectorAll('.form-item');
        items.forEach(item => {
            const index = parseInt(item.dataset.index);
            
            fields.forEach(field => {
                const input = item.querySelector(`.${type}-${field}`);
                if (input) {
                    input.addEventListener('input', function() {
                        // 更新内存中的数据
                        self.data[dataMap[type]][index][field] = this.value;
                        // 同步保存和预览
                        self.sync();
                    });
                }
            });
        });
    }
};
