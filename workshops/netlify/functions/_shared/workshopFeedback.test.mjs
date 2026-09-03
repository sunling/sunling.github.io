import test from "node:test";
import assert from "node:assert/strict";

import { handleWorkshopFeedback, validateFeedback } from "./workshopFeedback.mjs";

const validFeedback = {
  attendance_modes: ["live_upper", "live_lower"],
  incomplete_reasons: [],
  expectation_score: "4",
  outcomes: ["started_recording", "completed_review"],
  learning: "我更清楚记录之后可以怎样回看。",
  friction: "两套工具来回切换时有点跟不上。",
  next_iteration: "希望保留真实 Demo，但减少同时配置的路径。",
  follow_up: false,
  quote_permission: "anonymous",
};

test("accepts anonymous feedback and fixes server-owned fields", () => {
  const { payload, errors } = validateFeedback({
    ...validFeedback,
    cohort: "made-up-cohort",
    source: "another-site.example",
  });

  assert.deepEqual(errors, []);
  assert.equal(payload.cohort, "second-2026-08");
  assert.equal(payload.source, "workshops.bysunling.com/workshop-feedback.html");
  assert.equal(payload.contact, null);
  assert.equal(payload.quote_permission, "anonymous");
});

test("allows someone who registered but did not attend to respond", () => {
  const { payload, errors } = validateFeedback({
    ...validFeedback,
    attendance_modes: ["none"],
    expectation_score: "not_applicable",
    outcomes: ["no_change"],
    learning: null,
    friction: "报名后动力下降，所以没有参加。",
  });

  assert.deepEqual(errors, []);
  assert.equal(payload.expectation_score, null);
});

test("requires at least one substantive reflection", () => {
  const { errors } = validateFeedback({
    ...validFeedback,
    learning: "",
    friction: "",
    next_iteration: "",
  });

  assert.match(errors[0], /至少留下一条真实反馈/);
});

test("keeps mutually exclusive options exclusive", () => {
  const attendance = validateFeedback({
    ...validFeedback,
    attendance_modes: ["none", "live_upper"],
  });
  const outcomes = validateFeedback({
    ...validFeedback,
    outcomes: ["no_change", "started_recording"],
  });

  assert.match(attendance.errors[0], /不能与其他参与方式/);
  assert.match(outcomes.errors[0], /不能与其他结果/);
});

test("requires contact only when follow-up is requested", () => {
  const withoutContact = validateFeedback({ ...validFeedback, follow_up: true });
  const withContact = validateFeedback({
    ...validFeedback,
    follow_up: true,
    contact: "微信：example",
  });

  assert.match(withoutContact.errors[0], /联系方式/);
  assert.deepEqual(withContact.errors, []);
});

test("posts validated feedback to Supabase", async () => {
  const originalFetch = global.fetch;
  let insertedPayload;
  global.fetch = async (_url, options) => {
    insertedPayload = JSON.parse(options.body);
    return new Response(null, { status: 201 });
  };

  try {
    const response = await handleWorkshopFeedback(new Request("https://example.com/api/workshop-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validFeedback),
    }), {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "test-key",
    });

    assert.equal(response.status, 200);
    assert.equal(insertedPayload.learning, validFeedback.learning);
    assert.equal(insertedPayload.contact, null);
  } finally {
    global.fetch = originalFetch;
  }
});

test("rejects non-POST requests", async () => {
  const response = await handleWorkshopFeedback(
    new Request("https://example.com/api/workshop-feedback"),
    {},
  );
  assert.equal(response.status, 405);
});
