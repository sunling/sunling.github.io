const token = process.env.GH_RW_WORKSHOP_ASSETS_TOKEN;
fetch("https://api.github.com/repos/sunling/workshop-assets/contents/group-qr/from-recording-to-practice-2026-08/latest.png", {
  headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }
}).then(r => r.json()).then(d => console.log(d.download_url)).catch(console.error);
