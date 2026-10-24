const FEEDBACK_TABLE = "workshop_feedback";
const COHORT = "second-2026-08";
const SOURCE = "workshops.bysunling.com/workshop-feedback.html";

const ATTENDANCE_OPTIONS = new Set([
  "live_upper",
  "live_lower",
  "replay_upper",
  "replay_lower",
  "none",
]);

const INCOMPLETE_REASON_OPTIONS = new Set([
  "time_conflict",
  "forgot_or_interrupted",
  "tool_threshold",
  "setup_incomplete",
  "planned_replay",
  "motivation_dropped",
  "other",
]);

const OUTCOME_OPTIONS = new Set([
  "started_recording",
  "connected_chatgpt_github",
  "connected_doubao_feishu",
  "completed_review",
  "created_schedule",
  "tried_bubble_breaker",
  "tried_personal_expression",
  "understood_only",
  "no_change",
]);

const MAX_LENGTHS = {
  incomplete_other: 1000,
  expectation_detail: 1500,
  learning: 2000,
  friction: 2000,
  next_iteration: 2000,
  contact: 200,
};

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanText(value, fieldName) {
  if (value === undefined || value === null) return null;

  const normalized = String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  if (!normalized) return null;
  return normalized.slice(0, MAX_LENGTHS[fieldName] || 2000);
}

function cleanChoices(value, allowed) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).trim()))]
    .filter((item) => allowed.has(item));
}

function validateFeedback(input = {}) {
  const errors = [];
  const attendanceModes = cleanChoices(input.attendance_modes, ATTENDANCE_OPTIONS);
  const incompleteReasons = cleanChoices(input.incomplete_reasons, INCOMPLETE_REASON_OPTIONS);
  const outcomes = cleanChoices(input.outcomes, OUTCOME_OPTIONS);
  const score = Number(input.expectation_score);
  const expectationScore = Number.isInteger(score) && score >= 1 && score <= 5 ? score : null;

  const payload = {
    cohort: COHORT,
    feedback_version: 1,
    attendance_modes: attendanceModes,
    incomplete_reasons: incompleteReasons,
    incomplete_other: cleanText(input.incomplete_other, "incomplete_other"),
    expectation_score: expectationScore,
    expectation_detail: cleanText(input.expectation_detail, "expectation_detail"),
    outcomes,
    learning: cleanText(input.learning, "learning"),
    friction: cleanText(input.friction, "friction"),
    next_iteration: cleanText(input.next_iteration, "next_iteration"),
    follow_up: input.follow_up === true,
    contact: cleanText(input.contact, "contact"),
    quote_permission: input.quote_permission === "anonymous" ? "anonymous" : "no",
    source: SOURCE,
  };

  if (input.website) errors.push("提交没有成功，请稍后再试。");
  if (attendanceModes.length === 0) errors.push("请选择你实际参加过哪些部分。");
  if (attendanceModes.includes("none") && attendanceModes.length > 1) {
    errors.push("“没有参加或看回放”不能与其他参与方式同时选择。");
  }
  if (input.expectation_score !== "not_applicable" && expectationScore === null) {
    errors.push("请选择这次经历达到期待的程度。");
  }
  if (outcomes.length === 0) errors.push("请选择工作坊之后实际发生了什么。");
  if (outcomes.includes("no_change") && outcomes.length > 1) {
    errors.push("“暂时没有变化”不能与其他结果同时选择。");
  }
  if (!payload.learning && !payload.friction && !payload.next_iteration) {
    errors.push("请至少留下一条真实反馈：收获、困惑或下一期建议都可以。");
  }
  if (payload.follow_up && !payload.contact) {
    errors.push("如果愿意进一步聊，请留下一个联系方式。");
  }

  return { payload, errors };
}

async function insertFeedback(payload, env) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase environment variables.");

  const response = await fetch(`${supabaseUrl}/rest/v1/${FEEDBACK_TABLE}`, {
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

async function handleWorkshopFeedback(request, env) {
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed." });

  let input;
  try {
    input = await request.json();
  } catch {
    return jsonResponse(400, { error: "请求格式不正确，请刷新页面后重试。" });
  }

  const { payload, errors } = validateFeedback(input);
  if (errors.length > 0) return jsonResponse(400, { error: errors[0], errors });

  try {
    await insertFeedback(payload, env);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, { error: "提交没有成功，请稍后再试。" });
  }
}

export {
  COHORT,
  SOURCE,
  cleanChoices,
  validateFeedback,
  insertFeedback,
  handleWorkshopFeedback,
};
