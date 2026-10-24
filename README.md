# bysunling.com

孙玲的中文个人站点，以及同仓库维护的工作坊子站。两个站点由 Netlify 独立部署。

## 站点结构

| 目录 | 站点 | Netlify 发布目录 |
| --- | --- | --- |
| 仓库根目录 | <https://bysunling.com/> | `.` |
| `workshops/` | <https://workshops.bysunling.com/> | `workshops/public` |

当前是工作坊子站迁移的第一阶段。根目录中的旧工作坊页面会暂时保留，等子域名完成部署和验证后，再改成永久跳转并删除重复文件。

## 本地预览

个人站：

```bash
python -m http.server 8000
```

工作坊站：

```bash
cd workshops
npx netlify dev
```

## 部署

`bysunling.com` 继续使用仓库根目录的 `netlify.toml`。

`workshops.bysunling.com` 使用 `workshops/netlify.toml`。在 Netlify 中把 Base directory 设置为 `workshops`，它会发布 `public/` 并从 `netlify/functions/` 加载 Functions。

工作坊子站的迁移与环境变量说明见 [`workshops/README.md`](workshops/README.md)。
