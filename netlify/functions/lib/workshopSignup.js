const SIGNUP_TABLE = "input_output_workshop_signups";
const COHORT = "pilot-2026-07";
const SOURCE = "sunling.github.io/zh/input-output-workshop.html";

const ALLOWED_STAGES = new Set([
  "首期完整工作坊，199 元",
]);

const MAX_LENGTHS = {
  name: 80,
  wechat: 120,
  email: 160,
  city: 120,
  role: 160,
  stage: 80,
  current_system: 160,
  main_challenge: 1500,
  desired_output: 1500,
  expectation: 1500,
  user_agent: 500,
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  };
}

function parseJsonBody(event) {
  if (!event.body) {
    return {};
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  return JSON.parse(rawBody);
}

function cleanString(value, fieldName) {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (!normalized) {
    return null;
  }

  const maxLength = MAX_LENGTHS[fieldName] || 1000;
  return normalized.slice(0, maxLength);
}

function cleanMultiline(value, fieldName) {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  if (!normalized) {
    return null;
  }

  const maxLength = MAX_LENGTHS[fieldName] || 1500;
  return normalized.slice(0, maxLength);
}

function validateSignup(input = {}, event = {}) {
  const errors = [];

  const payload = {
    name: cleanString(input.name, "name"),
    wechat: cleanString(input.wechat, "wechat"),
    email: cleanString(input.email, "email"),
    city: cleanString(input.city, "city"),
    role: cleanString(input.role, "role"),
    stage: cleanString(input.stage, "stage"),
    current_system: cleanString(input.current_system, "current_system"),
    main_challenge: cleanMultiline(input.main_challenge, "main_challenge"),
    desired_output: cleanMultiline(input.desired_output, "desired_output"),
    expectation: cleanMultiline(input.expectation, "expectation"),
    cohort: COHORT,
    payment_status: "pending",
    status: "submitted",
    source: SOURCE,
    user_agent: cleanString(
      event.headers?.["user-agent"] || event.headers?.["User-Agent"] || input.user_agent,
      "user_agent"
    ),
  };

  if (input.website) {
    errors.push("提交没有成功，请稍后再试。");
  }

  if (!payload.name) {
    errors.push("请填写你的称呼。");
  }

  if (!payload.wechat) {
    errors.push("请填写微信号。");
  }

  if (!payload.stage || !ALLOWED_STAGES.has(payload.stage)) {
    errors.push("请选择有效的报名选项。");
  }

  if (!payload.main_challenge) {
    errors.push("请至少选择或填写一个你最想解决的卡点。");
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push("邮箱格式看起来不正确。");
  }

  return { payload, errors };
}

async function insertSignup(payload, env = process.env) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${SIGNUP_TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${errorText}`);
  }
}

async function handleWorkshopSignup(event, env = process.env) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  let input;
  try {
    input = parseJsonBody(event);
  } catch (error) {
    return jsonResponse(400, { error: "请求格式不正确，请刷新页面后重试。" });
  }

  const { payload, errors } = validateSignup(input, event);
  if (errors.length > 0) {
    return jsonResponse(400, { error: errors[0], errors });
  }

  try {
    await insertSignup(payload, env);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, { error: "提交没有成功，请稍后再试。" });
  }
}

module.exports = {
  COHORT,
  SOURCE,
  validateSignup,
  insertSignup,
  handleWorkshopSignup,
};
