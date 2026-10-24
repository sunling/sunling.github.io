# workshops.bysunling.com

孙玲的工作坊子站，与个人站同仓库维护、独立部署。

## 目录

```text
workshops/
├── public/               # 子站页面与静态资源
├── netlify/functions/    # 报名、反馈与二维码 Functions
├── supabase/migrations/  # 工作坊相关数据库迁移
├── planning/             # 不公开发布的策划材料
├── netlify.toml
└── package.json
```

## 本地运行

```bash
npm install
npm test
npx netlify dev
```

## Netlify 设置

从 `sunling/sunling.github.io` 创建第二个 Netlify Site：

- Base directory：`workshops`
- Build command：留空
- Publish directory：`public`
- Functions directory：`netlify/functions`
- Custom domain：`workshops.bysunling.com`

需要从当前个人站复制以下环境变量：

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `GH_RW_WORKSHOP_ASSETS_TOKEN`
- `GH_REPO_NAME`
- `GH_REPO_BRANCH`
- `ADMIN_PASSCODE`

不要把这些值提交到仓库。

## 迁移顺序

1. 创建新的 Netlify Site，并使用 `workshops` 作为 Base directory。
2. 复制环境变量并完成 Deploy Preview。
3. 运行 `supabase/migrations/20260903023351_allow_workshops_subdomain.sql`。
4. 绑定并验证 `workshops.bysunling.com`。
5. 确认报名、反馈和二维码接口正常。
6. 再从个人站移除旧工作坊文件，并为旧 URL 添加 301 跳转。

第三期的当前策划基线见 [`planning/third-workshop.md`](planning/third-workshop.md)。
