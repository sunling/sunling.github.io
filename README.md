# bysunling.com

孙玲的中文个人站点，由 Netlify 自动部署。

## 本地预览

```bash
python -m http.server 8000
```

然后浏览器访问 http://localhost:8000/ 。

## 部署

生产站点：<https://bysunling.com/>

Netlify 已连接本仓库。推送到 `main` 后会自动触发部署，发布目录为仓库根目录。

## URL 结构

站点以中文内容为准，首页和各内容页面都直接位于根路径：

- 首页：`/`
- 工作坊记录：`/workshops.html`
- 输入输出系统工作坊：`/input-output-workshop.html`

旧的 `/zh/*` 和 `/en/*` 地址由 Netlify 永久跳转到新的无语言前缀地址。
