# bylingsun.com

静态双语站点，可直接托管到 GitHub Pages。

## 本地预览
```bash
python -m http.server 8000
```
然后浏览器访问 http://localhost:8000/ ，如需查看中文/英文入口分别访问 `/zh/` 与 `/en/`。

## 部署到 GitHub Pages
1. 将仓库推送到 GitHub。
2. 在仓库 Settings → Pages 中，选择部署来源为 `Deploy from a branch`，分支 `main`（或你的默认分支），目录 `/(root)`。
3. 保存后等待 GitHub Pages 构建完成（通常 1-2 分钟）。

## 自定义域名
1. 在 Pages 设置中填写你的自定义域名。
2. 按提示配置 DNS（通常是 CNAME 记录指向 `<username>.github.io`）。
3. 本仓库已预留 `CNAME` 文件占位符（TODO），填写域名后即可生效。

## 兼容性说明
- 使用相对路径加载资源，适配 GitHub Pages 根路径或自定义域名。
- `.nojekyll` 已添加，避免被 Jekyll 处理。
