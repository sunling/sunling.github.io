const test = require("node:test");
const assert = require("node:assert/strict");

const { cleanReferralCode, handleWorkshopSignup, validateSignup } = require("./workshopSignup");

const validSignup = {
  name: "测试用户",
  wechat: "test-wechat",
  stage: "从记录到实践｜2026-08-22",
  current_system: "偶尔会记录，但很难稳定持续",
  main_challenge: "想让记录更容易找回来。",
};

test("normalizes a valid referral code", () => {
  assert.equal(cleanReferralCode("  Friend_A-01  "), "friend_a-01");
});

test("stores a valid referral code separately from page source", () => {
  const { payload, errors } = validateSignup({ ...validSignup, referral_code: "friend-a" });

  assert.deepEqual(errors, []);
  assert.equal(payload.referral_code, "friend-a");
  assert.equal(payload.source, "bysunling.com/from-recording-to-practice-workshop.html");
});

test("keeps direct signups compatible", () => {
  const { payload, errors } = validateSignup(validSignup);

  assert.deepEqual(errors, []);
  assert.equal(payload.referral_code, null);
});

test("rejects an invalid referral code", () => {
  const { payload, errors } = validateSignup({ ...validSignup, referral_code: "friend?a=1" });

  assert.equal(payload.referral_code, null);
  assert.match(errors[0], /报名来源链接无效/);
});

test("sends the referral code to Supabase", async () => {
  const originalFetch = global.fetch;
  let insertedPayload;
  global.fetch = async (_url, options) => {
    insertedPayload = JSON.parse(options.body);
    return { ok: true };
  };

  try {
    const response = await handleWorkshopSignup({
      httpMethod: "POST",
      headers: { "user-agent": "node-test" },
      body: JSON.stringify({ ...validSignup, referral_code: "friend-a" }),
    }, {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "test-key",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(insertedPayload.referral_code, "friend-a");
    assert.equal(insertedPayload.source, "bysunling.com/from-recording-to-practice-workshop.html");
  } finally {
    global.fetch = originalFetch;
  }
});
