/**
 * optimizer.js - 简历优化建议逻辑
 * 
 * 这个模块负责分析用户填写的简历内容，并给出改进建议。
 * 虽然界面上叫"AI 优化"，但实际上是一个基于规则的引擎，
 * 这样更容易理解，也无需后端服务器支持。
 * 
 * 分析维度：
 * 1. 完整性检查：必填项是否填写
 * 2. 内容质量：描述是否足够详细
 * 3. 量化检查：是否包含数据和数字
 * 4. 关键词检查：是否包含行业常用词
 * 5. 格式建议：时间格式、技能数量等
 */

const ResumeOptimizer = {

    /**
     * 主分析函数
     * @param {Object} data - 简历数据对象
     * @returns {Array} - 建议列表，每个建议包含 type、title、description
     */
    analyze: function(data) {
        const suggestions = [];
        
        // ==================== 1. 个人信息检查 ====================
        
        // 检查姓名
        if (!data.personal.name || data.personal.name.trim().length === 0) {
            suggestions.push({
                type: 'error',
                title: '缺少姓名',
                description: '姓名是简历的必备信息，请填写您的真实姓名。'
            });
        }
        
        // 检查联系方式（至少要有电话或邮箱）
        if (!data.personal.phone && !data.personal.email) {
            suggestions.push({
                type: 'error',
                title: '缺少联系方式',
                description: '请至少填写电话号码或电子邮箱，否则 HR 无法联系到您。'
            });
        }
        
        // 检查求职意向
        if (!data.personal.job || data.personal.job.trim().length === 0) {
            suggestions.push({
                type: 'warning',
                title: '缺少求职意向',
                description: '明确的求职意向能让 HR 快速了解您的目标岗位，建议填写。'
            });
        }
        
        // 检查个人简介长度
        if (!data.personal.summary || data.personal.summary.trim().length < 30) {
            suggestions.push({
                type: 'warning',
                title: '个人简介过短',
                description: '个人简介建议 50-200 字，突出您的核心优势和职业目标。例如："5年前端开发经验，精通 Vue/React，曾主导日活百万级项目..."'
            });
        }
        
        // ==================== 2. 教育背景检查 ====================
        
        if (!data.education || data.education.length === 0) {
            suggestions.push({
                type: 'warning',
                title: '缺少教育背景',
                description: '教育背景是简历的重要组成部分，请添加您的学历信息。'
            });
        } else {
            // 检查每条教育记录是否完整
            data.education.forEach((edu, index) => {
                if (!edu.school || !edu.major) {
                    suggestions.push({
                        type: 'warning',
                        title: `教育背景第 ${index + 1} 条信息不完整`,
                        description: '请填写完整的学校名称和专业信息。'
                    });
                }
            });
        }
        
        // ==================== 3. 工作经历检查 ====================
        
        if (!data.work || data.work.length === 0) {
            suggestions.push({
                type: 'info',
                title: '缺少工作经历',
                description: '如果您是应届生，可以将实习经历和项目经验写得详细一些来弥补。'
            });
        } else {
            // 检查工作描述的质量
            data.work.forEach((work, index) => {
                const desc = work.description || '';
                
                // 检查描述长度
                if (desc.trim().length < 20) {
                    suggestions.push({
                        type: 'warning',
                        title: `工作经历第 ${index + 1} 条描述过短`,
                        description: `在 "${work.company || '未命名公司'}" 的描述过于简单。建议详细说明您的工作职责、使用的技术、取得的成果。`
                    });
                }
                
                // 检查是否包含数字（量化成果）
                if (desc.length > 10 && !/\d/.test(desc)) {
                    suggestions.push({
                        type: 'info',
                        title: `工作经历第 ${index + 1} 条缺少量化数据`,
                        description: `在 "${work.company || '未命名公司'}" 的描述中没有数字。尝试加入量化成果，如："提升效率 30%"、"服务 10万+ 用户"、"减少成本 20%" 等，能让您的贡献更有说服力。`
                    });
                }
                
                // 检查是否使用了 STAR 法则相关的关键词
                const starKeywords = ['负责', '主导', '参与', '完成', '实现', '优化', '提升', '设计', '开发'];
                const hasStarKeyword = starKeywords.some(kw => desc.includes(kw));
                if (desc.length > 10 && !hasStarKeyword) {
                    suggestions.push({
                        type: 'info',
                        title: `工作经历第 ${index + 1} 条可加强动词使用`,
                        description: `尝试使用更有力量的动词开头，如"负责..."、"主导..."、"优化..."、"实现..."，避免平铺直叙。`
                    });
                }
            });
        }
        
        // ==================== 4. 项目经验检查 ====================
        
        if (!data.projects || data.projects.length === 0) {
            suggestions.push({
                type: 'info',
                title: '缺少项目经验',
                description: '项目经验是展示您实战能力的重要部分。即使是个人项目或课程作业，也可以写进去。'
            });
        } else {
            data.projects.forEach((proj, index) => {
                const desc = proj.description || '';
                
                if (desc.trim().length < 20) {
                    suggestions.push({
                        type: 'warning',
                        title: `项目经验第 ${index + 1} 条描述过短`,
                        description: `"${proj.name || '未命名项目'}" 的描述太简单。一个好的项目描述应包含：项目背景、您的职责、技术栈、项目成果。`
                    });
                }
                
                // 检查是否包含技术关键词
                const techKeywords = ['Vue', 'React', 'Angular', 'Node', 'Java', 'Python', 'Go', 'Spring', 'MySQL', 'Redis', 'Docker', 'K8s', '微服务', '前后端分离', 'RESTful', 'Git'];
                const hasTechKeyword = techKeywords.some(kw => desc.includes(kw) || (proj.role && proj.role.includes(kw)));
                if (desc.length > 10 && !hasTechKeyword) {
                    suggestions.push({
                        type: 'info',
                        title: `项目经验第 ${index + 1} 条可补充技术栈`,
                        description: `在 "${proj.name || '未命名项目'}" 中提及您使用的技术栈，如 Vue、React、Spring Boot 等，有助于 HR 和技术面试官快速了解您的能力范围。`
                    });
                }
            });
        }
        
        // ==================== 5. 技能特长检查 ====================
        
        if (!data.skills || data.skills.length === 0) {
            suggestions.push({
                type: 'warning',
                title: '缺少技能特长',
                description: '技能列表能让面试官快速了解您的技术栈，建议至少添加 3-5 项核心技能。'
            });
        } else {
            if (data.skills.length < 3) {
                suggestions.push({
                    type: 'info',
                    title: '技能数量较少',
                    description: `目前只填写了 ${data.skills.length} 个技能，建议增加到 5-10 个，涵盖技术栈、工具、软技能等。`
                });
            }
            
            // 检查是否有重复技能
            const skillNames = data.skills.map(s => s.name.toLowerCase().trim()).filter(n => n);
            const duplicates = skillNames.filter((item, index) => skillNames.indexOf(item) !== index);
            if (duplicates.length > 0) {
                suggestions.push({
                    type: 'warning',
                    title: '存在重复技能',
                    description: `技能 "${duplicates[0]}" 出现了多次，建议合并或删除重复项。`
                });
            }
        }
        
        // ==================== 6. 综合评估 ====================
        
        // 如果没有任何问题，给一个鼓励
        if (suggestions.length === 0) {
            suggestions.push({
                type: 'success',
                title: '简历质量不错！',
                description: '您的简历内容完整、描述详细，继续保持！建议在投递前再检查一遍错别字。'
            });
        } else {
            // 计算完整度
            let score = 100;
            const errorCount = suggestions.filter(s => s.type === 'error').length;
            const warningCount = suggestions.filter(s => s.type === 'warning').length;
            score -= errorCount * 15;
            score -= warningCount * 8;
            score = Math.max(0, score);
            
            // 在第一条插入综合评分
            suggestions.unshift({
                type: score >= 80 ? 'success' : (score >= 60 ? 'warning' : 'error'),
                title: `简历完整度评分：${score} 分`,
                description: score >= 80 
                    ? '您的简历已经比较完善了，根据下方建议微调即可。'
                    : (score >= 60 
                        ? '简历基本合格，但还有不少提升空间，建议根据下方建议进行优化。'
                        : '简历目前还比较简陋，建议认真完善以下内容后再投递。')
            });
        }
        
        return suggestions;
    },

    /**
     * 显示优化建议弹窗
     */
    showSuggestions: function(suggestions) {
        const modal = document.getElementById('optimize-modal');
        const content = document.getElementById('optimize-content');
        
        if (!modal || !content) return;
        
        // 生成建议卡片 HTML
        content.innerHTML = suggestions.map(s => `
            <div class="suggestion-card ${s.type}">
                <h4>
                    ${this.getIcon(s.type)} ${escapeHtml(s.title)}
                </h4>
                <p>${escapeHtml(s.description).replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');
        
        // 显示弹窗（flex 布局实现居中）
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    },

    /**
     * 隐藏优化建议弹窗
     */
    hideSuggestions: function() {
        const modal = document.getElementById('optimize-modal');
        if (!modal) return;
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        
        // 恢复背景滚动
        document.body.style.overflow = '';
    },

    /**
     * 根据建议类型返回对应的图标
     */
    getIcon: function(type) {
        const icons = {
            error: '<i class="fas fa-times-circle text-red-500 mr-1"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-yellow-500 mr-1"></i>',
            success: '<i class="fas fa-check-circle text-green-500 mr-1"></i>',
            info: '<i class="fas fa-info-circle text-blue-500 mr-1"></i>'
        };
        return icons[type] || icons.info;
    }
};
