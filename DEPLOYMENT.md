# DesignPrompt 自动部署指南

## 🚀 快速部署

### 方法1：GitHub 连接（推荐）
```bash
# 1. 推送到 GitHub
git init
git add .
git commit -m "DesignPrompt: 设计原则转换AI提示词网站"
git branch -M main
git remote add origin https://github.com/yourusername/design-principles.git
git push -u origin main

# 2. Vercel 自动部署
# - 访问 https://vercel.com/new
# - 选择 GitHub仓库：`yourusername/design-principles`
# - 域名已配置：designprompt.vercel.app
# - 点击 Deploy → 自动部署
```

### 方法2：Vercel CLI
```bash
# 安装并登录
npm i -g vercel
vercel login

# 一键部署（自动绑定域名）
vercel --prod
```

### 方法3：直接拖拽部署
```bash
# 打包项目
zip -r design-principles.zip . -x "*.DS_Store"

# 上传部署
# 1. 访问 https://vercel.com/
# 2. 点击 "Deploy"
# 3. 拖拽 design-principles.zip
# 4. 配置域名：designprompt.vercel.app
```

## ⚙️ 项目配置

### 已配置文件
- `vercel.json` - 重写规则和安全头
- `package.json` - 项目信息和脚本
- `.gitignore` - 忽略不必要文件

### Vercel 配置详解
```json
{
  "outputDirectory": "./",
  "rewrites": [
    { "source": "/((?!.*\\.).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)\\.(css|js)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}
```

**关键配置说明**：
- `"outputDirectory": "./"` - 指定当前目录为输出目录（解决public目录问题）
- `rewrites` - SPA路由支持，所有非文件请求重定向到index.html
- `headers` - 安全头和缓存策略配置

## 🔄 自动触发部署

### GitHub Actions 集成（可选）
创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📊 验证部署

### 本地测试
```bash
# 启动本地服务器
python -m http.server 8000
# 访问: http://localhost:8000
```

### 部署验证清单
- [ ] 域名可访问: https://designprompt.vercel.app
- [ ] 页面正常加载，无404错误
- [ ] CSS/JS文件正确加载
- [ ] 导航功能正常工作
- [ ] 复制功能正常
- [ ] 响应式设计正常
- [ ] 页面标题和meta信息正确

## 🐛 域名配置

### 已配置域名
- **主域名**: https://designprompt.vercel.app
- **自动HTTPS**: Vercel 自动配置SSL证书

### 自定义域名（如需）
```bash
# Vercel控制台 → 项目设置 → Domains
# 添加自定义域名并配置DNS
```

## 🔄️ 持续部署流程

### 更新内容
1. 修改代码
2. `git add . && git commit -m "update: 描述更新"`
3. `git push origin main`
4. Vercel自动部署（约1-2分钟）

### 分支部署
```bash
# 创建功能分支
git checkout -b feature/add-new-principle
# 开发完成后
git add . && git commit -m "feat: 添加新设计原则"
git push origin feature/add-new-principle
# Vercel会自动部署预览版本
```

## 🔧 故障排除

### 常见问题
1. **部署失败**：检查 Vercel 控制台错误日志
2. **域名冲突**：确认域名未被其他项目使用
3. **文件缺失**：检查 `.gitignore` 是否排除了必要文件
4. **HTTPS问题**：Vercel 自动处理，无需手动配置

### 调试命令
```bash
# 查看部署日志
vercel logs

# 本地测试
npm run dev
# 或
python -m http.server 8000
```

## 📋 一键部署命令总结

```bash
# 最快部署方式
git clone https://github.com/yourusername/design-principles.git
cd design-principles
vercel --prod

# 完整部署流程（包含GitHub集成）
git init
git add .
git commit -m "Initial commit: DesignPrompt website"
git remote add origin https://github.com/yourusername/design-principles.git
git branch -M main
git push -u origin main
# 然后连接 Vercel GitHub集成
```