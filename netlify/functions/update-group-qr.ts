import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { passcode, imageBase64, workshopId } = body;

    const expectedPasscode = process.env.ADMIN_PASSCODE;
    if (!expectedPasscode || passcode !== expectedPasscode) {
      return { statusCode: 403, body: JSON.stringify({ error: "口令错误或后端未配置口令" }) };
    }

    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: "缺少图片数据" }) };
    }

    const token = process.env.GH_RW_WORKSHOP_ASSETS_TOKEN;
    if (!token) {
      return { statusCode: 500, body: JSON.stringify({ error: "缺少 GitHub Token" }) };
    }

    const repoName = process.env.GH_REPO_NAME || "workshop-assets";
    const fullRepoName = repoName.includes('/') ? repoName : `sunling/${repoName}`;
    const branch = process.env.GH_REPO_BRANCH || "main";
    const folderName = workshopId || "from-recording-to-practice-2026-08";
    const filePath = `group-qr/${folderName}/latest.png`;
    const apiUrl = `https://api.github.com/repos/${fullRepoName}/contents/${filePath}`;

    // 1. Get the current file's SHA (so we can overwrite it)
    let sha;
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }

    // 2. Extract raw base64 data
    const base64Content = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // 3. PUT the new file
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update workshop group QR code via admin panel",
        content: base64Content,
        branch: branch,
        sha: sha // Only provided if it existed
      }),
    });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      return { statusCode: putRes.status, body: JSON.stringify({ error: "更新 GitHub 文件失败", details: errorText }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, message: "二维码已成功更新" }),
    };

  } catch (error) {
    console.error("Error updating QR:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "服务器内部错误" }) };
  }
};
