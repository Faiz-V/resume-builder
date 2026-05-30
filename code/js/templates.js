/**
 * templates.js - 简历模板定义
 * 
 * 这个文件包含 3 种简历模板的 HTML 生成逻辑。
 * 每个模板都是一个函数，接收 resumeData（简历数据对象），返回 HTML 字符串。
 * 
 * 数据结构说明：
 * resumeData = {
 *   personal: { name, phone, email, job, summary },
 *   education: [{ school, major, degree, time, description }],
 *   work: [{ company, position, time, description }],
 *   projects: [{ name, role, time, description }],
 *   skills: [{ name, level }]
 * }
 */

// 定义 ResumeTemplates 全局对象，包含所有模板
const ResumeTemplates = {

    /**
     * 模板1：简约风
     * 特点：居中对齐的头部、简洁的分割线、清晰的层次
     */
    minimal: function(data) {
        // 生成个人信息 HTML
        let personalHTML = '';
        if (data.personal.name || data.personal.phone || data.personal.email) {
            const contacts = [];
            if (data.personal.phone) contacts.push(data.personal.phone);
            if (data.personal.email) contacts.push(data.personal.email);
            if (data.personal.job) contacts.push(data.personal.job);
            
            personalHTML = `
                <div class="resume-header">
                    <div class="resume-name">${escapeHtml(data.personal.name || '您的姓名')}</div>
                    <div class="resume-contact">${contacts.join(' &nbsp;|&nbsp; ')}</div>
                </div>
            `;
        }

        // 生成个人简介 HTML
        let summaryHTML = '';
        if (data.personal.summary) {
            summaryHTML = `
                <div class="resume-section">
                    <div class="section-title">个人简介</div>
                    <div class="item-desc">${escapeHtml(data.personal.summary).replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }

        // 生成教育背景 HTML
        let eduHTML = '';
        if (data.education && data.education.length > 0) {
            const items = data.education.map(edu => `
                <div style="margin-bottom: 12px;">
                    <div class="item-header">
                        <div>
                            <span class="item-title">${escapeHtml(edu.school)}</span>
                            <span class="item-subtitle"> — ${escapeHtml(edu.major)} (${escapeHtml(edu.degree)})</span>
                        </div>
                        <span class="item-time">${escapeHtml(edu.time)}</span>
                    </div>
                    ${edu.description ? `<div class="item-desc">${escapeHtml(edu.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            
            eduHTML = `
                <div class="resume-section">
                    <div class="section-title">教育背景</div>
                    ${items}
                </div>
            `;
        }

        // 生成工作经历 HTML
        let workHTML = '';
        if (data.work && data.work.length > 0) {
            const items = data.work.map(w => `
                <div style="margin-bottom: 12px;">
                    <div class="item-header">
                        <div>
                            <span class="item-title">${escapeHtml(w.company)}</span>
                            <span class="item-subtitle"> — ${escapeHtml(w.position)}</span>
                        </div>
                        <span class="item-time">${escapeHtml(w.time)}</span>
                    </div>
                    ${w.description ? `<div class="item-desc">${escapeHtml(w.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            
            workHTML = `
                <div class="resume-section">
                    <div class="section-title">工作经历</div>
                    ${items}
                </div>
            `;
        }

        // 生成项目经验 HTML
        let projectHTML = '';
        if (data.projects && data.projects.length > 0) {
            const items = data.projects.map(p => `
                <div style="margin-bottom: 12px;">
                    <div class="item-header">
                        <div>
                            <span class="item-title">${escapeHtml(p.name)}</span>
                            <span class="item-subtitle"> — ${escapeHtml(p.role)}</span>
                        </div>
                        <span class="item-time">${escapeHtml(p.time)}</span>
                    </div>
                    ${p.description ? `<div class="item-desc">${escapeHtml(p.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            
            projectHTML = `
                <div class="resume-section">
                    <div class="section-title">项目经验</div>
                    ${items}
                </div>
            `;
        }

        // 生成技能特长 HTML
        let skillHTML = '';
        if (data.skills && data.skills.length > 0) {
            const tags = data.skills.map(s => 
                `<span class="skill-item">${escapeHtml(s.name)}${s.level ? ' · ' + escapeHtml(s.level) : ''}</span>`
            ).join('');
            
            skillHTML = `
                <div class="resume-section">
                    <div class="section-title">技能特长</div>
                    <div>${tags}</div>
                </div>
            `;
        }

        // 组合所有部分
        return `
            <div class="resume-minimal">
                ${personalHTML}
                ${summaryHTML}
                ${eduHTML}
                ${workHTML}
                ${projectHTML}
                ${skillHTML}
            </div>
        `;
    },

    /**
     * 模板2：商务风
     * 特点：左侧深蓝色侧边栏，右侧主内容，专业稳重
     */
    business: function(data) {
        // 左侧：姓名、联系方式、技能
        let sidebarHTML = '';
        const hasSidebarContent = data.personal.name || data.personal.phone || data.personal.email || data.personal.job || (data.skills && data.skills.length > 0);
        
        if (hasSidebarContent) {
            // 侧边栏联系信息
            let contactHTML = '';
            if (data.personal.phone) {
                contactHTML += `<div class="sidebar-item"><i class="fas fa-phone mr-2" style="width:16px;text-align:center;"></i>${escapeHtml(data.personal.phone)}</div>`;
            }
            if (data.personal.email) {
                contactHTML += `<div class="sidebar-item"><i class="fas fa-envelope mr-2" style="width:16px;text-align:center;"></i>${escapeHtml(data.personal.email)}</div>`;
            }
            if (data.personal.job) {
                contactHTML += `<div class="sidebar-item"><i class="fas fa-briefcase mr-2" style="width:16px;text-align:center;"></i>${escapeHtml(data.personal.job)}</div>`;
            }

            // 侧边栏技能
            let skillHTML = '';
            if (data.skills && data.skills.length > 0) {
                const items = data.skills.map(s => 
                    `<div style="margin-bottom:6px;">
                        <div style="font-size:13px;margin-bottom:2px;">${escapeHtml(s.name)}</div>
                        <div style="background:rgba(255,255,255,0.2);height:4px;border-radius:2px;">
                            <div style="background:white;height:100%;border-radius:2px;width:${getLevelWidth(s.level)};"></div>
                        </div>
                    </div>`
                ).join('');
                skillHTML = `
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">技能特长</div>
                        ${items}
                    </div>
                `;
            }

            sidebarHTML = `
                <div class="resume-sidebar">
                    <div class="sidebar-name">${escapeHtml(data.personal.name || '您的姓名')}</div>
                    <div class="sidebar-job">${escapeHtml(data.personal.job || '求职意向')}</div>
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">联系方式</div>
                        ${contactHTML}
                    </div>
                    ${skillHTML}
                </div>
            `;
        }

        // 右侧：简介、教育、工作、项目
        let summaryHTML = '';
        if (data.personal.summary) {
            summaryHTML = `
                <div class="main-section">
                    <div class="main-section-title">个人简介</div>
                    <div class="item-desc">${escapeHtml(data.personal.summary).replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }

        let eduHTML = '';
        if (data.education && data.education.length > 0) {
            const items = data.education.map(edu => `
                <div style="margin-bottom: 16px;">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${escapeHtml(edu.school)}</div>
                            <div class="item-subtitle">${escapeHtml(edu.major)} · ${escapeHtml(edu.degree)}</div>
                        </div>
                        <span class="item-time">${escapeHtml(edu.time)}</span>
                    </div>
                    ${edu.description ? `<div class="item-desc">${escapeHtml(edu.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            eduHTML = `
                <div class="main-section">
                    <div class="main-section-title">教育背景</div>
                    ${items}
                </div>
            `;
        }

        let workHTML = '';
        if (data.work && data.work.length > 0) {
            const items = data.work.map(w => `
                <div style="margin-bottom: 16px;">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${escapeHtml(w.company)}</div>
                            <div class="item-subtitle">${escapeHtml(w.position)}</div>
                        </div>
                        <span class="item-time">${escapeHtml(w.time)}</span>
                    </div>
                    ${w.description ? `<div class="item-desc">${escapeHtml(w.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            workHTML = `
                <div class="main-section">
                    <div class="main-section-title">工作经历</div>
                    ${items}
                </div>
            `;
        }

        let projectHTML = '';
        if (data.projects && data.projects.length > 0) {
            const items = data.projects.map(p => `
                <div style="margin-bottom: 16px;">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${escapeHtml(p.name)}</div>
                            <div class="item-subtitle">${escapeHtml(p.role)}</div>
                        </div>
                        <span class="item-time">${escapeHtml(p.time)}</span>
                    </div>
                    ${p.description ? `<div class="item-desc">${escapeHtml(p.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            projectHTML = `
                <div class="main-section">
                    <div class="main-section-title">项目经验</div>
                    ${items}
                </div>
            `;
        }

        return `
            <div class="resume-business">
                ${sidebarHTML}
                <div class="resume-main">
                    ${summaryHTML}
                    ${workHTML}
                    ${projectHTML}
                    ${eduHTML}
                </div>
            </div>
        `;
    },

    /**
     * 模板3：创意风
     * 特点：渐变色彩、圆角标签、现代化布局
     */
    creative: function(data) {
        // 头部区域：头像 + 基本信息
        let headerHTML = '';
        if (data.personal.name || data.personal.job) {
            const contacts = [];
            if (data.personal.phone) contacts.push(`<i class="fas fa-phone mr-1"></i>${escapeHtml(data.personal.phone)}`);
            if (data.personal.email) contacts.push(`<i class="fas fa-envelope mr-1"></i>${escapeHtml(data.personal.email)}`);
            
            headerHTML = `
                <div class="creative-header">
                    <div class="avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="header-info">
                        <h2>${escapeHtml(data.personal.name || '您的姓名')}</h2>
                        <p>${escapeHtml(data.personal.job || '求职意向')} ${contacts.length > 0 ? '· ' + contacts.join(' · ') : ''}</p>
                    </div>
                </div>
            `;
        }

        // 个人简介
        let summaryHTML = '';
        if (data.personal.summary) {
            summaryHTML = `
                <div class="creative-section">
                    <div class="creative-section-title">关于我</div>
                    <div class="item-desc">${escapeHtml(data.personal.summary).replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }

        // 教育背景
        let eduHTML = '';
        if (data.education && data.education.length > 0) {
            const items = data.education.map(edu => `
                <div style="margin-bottom: 16px;">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${escapeHtml(edu.school)}</div>
                            <div class="item-subtitle">${escapeHtml(edu.major)} · ${escapeHtml(edu.degree)}</div>
                        </div>
                        <span class="item-time">${escapeHtml(edu.time)}</span>
                    </div>
                    ${edu.description ? `<div class="item-desc">${escapeHtml(edu.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            eduHTML = `
                <div class="creative-section">
                    <div class="creative-section-title">教育背景</div>
                    ${items}
                </div>
            `;
        }

        // 工作经历
        let workHTML = '';
        if (data.work && data.work.length > 0) {
            const items = data.work.map(w => `
                <div style="margin-bottom: 16px;">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${escapeHtml(w.company)}</div>
                            <div class="item-subtitle">${escapeHtml(w.position)}</div>
                        </div>
                        <span class="item-time">${escapeHtml(w.time)}</span>
                    </div>
                    ${w.description ? `<div class="item-desc">${escapeHtml(w.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            workHTML = `
                <div class="creative-section">
                    <div class="creative-section-title">工作经历</div>
                    ${items}
                </div>
            `;
        }

        // 项目经验
        let projectHTML = '';
        if (data.projects && data.projects.length > 0) {
            const items = data.projects.map(p => `
                <div style="margin-bottom: 16px;">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${escapeHtml(p.name)}</div>
                            <div class="item-subtitle">${escapeHtml(p.role)}</div>
                        </div>
                        <span class="item-time">${escapeHtml(p.time)}</span>
                    </div>
                    ${p.description ? `<div class="item-desc">${escapeHtml(p.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('');
            projectHTML = `
                <div class="creative-section">
                    <div class="creative-section-title">项目经验</div>
                    ${items}
                </div>
            `;
        }

        // 技能特长 - 创意标签形式
        let skillHTML = '';
        if (data.skills && data.skills.length > 0) {
            const tags = data.skills.map(s => 
                `<span class="skill-tag">${escapeHtml(s.name)}</span>`
            ).join('');
            skillHTML = `
                <div class="creative-section">
                    <div class="creative-section-title">技能特长</div>
                    <div>${tags}</div>
                </div>
            `;
        }

        return `
            <div class="resume-creative">
                ${headerHTML}
                ${summaryHTML}
                ${workHTML}
                ${projectHTML}
                ${eduHTML}
                ${skillHTML}
            </div>
        `;
    }
};

/**
 * 工具函数：防止 XSS 攻击的 HTML 转义
 * 将特殊字符转换为 HTML 实体，避免用户输入的脚本被执行
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 工具函数：将技能水平文字转换为百分比宽度
 * 用于商务风模板的进度条显示
 */
function getLevelWidth(level) {
    const levels = {
        '入门': '25%',
        '初级': '40%',
        '熟练': '60%',
        '精通': '80%',
        '专家': '100%'
    };
    return levels[level] || '60%';
}
