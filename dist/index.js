"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const core = require("@actions/core");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const core__namespace = /* @__PURE__ */ _interopNamespaceDefault(core);
const B = /\{[^{}]+\}/g, F = () => {
  var r, t;
  return typeof process == "object" && Number.parseInt((t = (r = process == null ? void 0 : process.versions) == null ? void 0 : r.node) == null ? void 0 : t.substring(0, 2)) >= 18 && process.versions.undici;
};
function M() {
  return Math.random().toString(36).slice(2, 11);
}
function W(r) {
  let {
    baseUrl: t = "",
    Request: e = globalThis.Request,
    fetch: s = globalThis.fetch,
    querySerializer: n,
    bodySerializer: o,
    headers: i,
    requestInitExt: l = void 0,
    ...y
  } = { ...r };
  l = F() ? l : void 0, t = U(t);
  const h = [];
  async function p(c, a) {
    const {
      baseUrl: m,
      fetch: I = s,
      Request: Y = e,
      headers: J,
      params: g = {},
      parseAs: A = "json",
      querySerializer: j,
      bodySerializer: k = o ?? Q,
      body: v,
      ...x
    } = a || {};
    m && (t = U(m));
    let z = typeof n == "function" ? n : O(n);
    j && (z = typeof j == "function" ? j : O({
      ...typeof n == "object" ? n : {},
      ...j
    }));
    const q = v === void 0 ? void 0 : k(v), L = (
      // with no body, we should not to set Content-Type
      q === void 0 || // if serialized body is FormData; browser will correctly set Content-Type & boundary expression
      q instanceof FormData ? {} : {
        "Content-Type": "application/json"
      }
    ), N = {
      redirect: "follow",
      ...y,
      ...x,
      body: q,
      headers: X(L, i, J, g.header)
    };
    let E, S, b = new e(_(c, { baseUrl: t, params: g, querySerializer: z }), N);
    for (const u in x)
      u in b || (b[u] = x[u]);
    if (h.length) {
      E = M(), S = Object.freeze({
        baseUrl: t,
        fetch: I,
        parseAs: A,
        querySerializer: z,
        bodySerializer: k
      });
      for (const u of h)
        if (u && typeof u == "object" && typeof u.onRequest == "function") {
          const d = await u.onRequest({
            request: b,
            schemaPath: c,
            params: g,
            options: S,
            id: E
          });
          if (d) {
            if (!(d instanceof e))
              throw new Error("onRequest: must return new Request() when modifying the request");
            b = d;
          }
        }
    }
    let f;
    try {
      f = await I(b, l);
    } catch (u) {
      let d = u;
      if (h.length)
        for (let w = h.length - 1; w >= 0; w--) {
          const T = h[w];
          if (T && typeof T == "object" && typeof T.onError == "function") {
            const R = await T.onError({
              request: b,
              error: d,
              schemaPath: c,
              params: g,
              options: S,
              id: E
            });
            if (R) {
              if (R instanceof Response) {
                d = void 0, f = R;
                break;
              }
              if (R instanceof Error) {
                d = R;
                continue;
              }
              throw new Error("onError: must return new Response() or instance of Error");
            }
          }
        }
      if (d)
        throw d;
    }
    if (h.length)
      for (let u = h.length - 1; u >= 0; u--) {
        const d = h[u];
        if (d && typeof d == "object" && typeof d.onResponse == "function") {
          const w = await d.onResponse({
            request: b,
            response: f,
            schemaPath: c,
            params: g,
            options: S,
            id: E
          });
          if (w) {
            if (!(w instanceof Response))
              throw new Error("onResponse: must return new Response() when modifying the response");
            f = w;
          }
        }
      }
    if (f.status === 204 || f.headers.get("Content-Length") === "0")
      return f.ok ? { data: void 0, response: f } : { error: void 0, response: f };
    if (f.ok)
      return A === "stream" ? { data: f.body, response: f } : { data: await f[A](), response: f };
    let C = await f.text();
    try {
      C = JSON.parse(C);
    } catch {
    }
    return { error: C, response: f };
  }
  return {
    request(c, a, m) {
      return p(a, { ...m, method: c.toUpperCase() });
    },
    /** Call a GET endpoint */
    GET(c, a) {
      return p(c, { ...a, method: "GET" });
    },
    /** Call a PUT endpoint */
    PUT(c, a) {
      return p(c, { ...a, method: "PUT" });
    },
    /** Call a POST endpoint */
    POST(c, a) {
      return p(c, { ...a, method: "POST" });
    },
    /** Call a DELETE endpoint */
    DELETE(c, a) {
      return p(c, { ...a, method: "DELETE" });
    },
    /** Call a OPTIONS endpoint */
    OPTIONS(c, a) {
      return p(c, { ...a, method: "OPTIONS" });
    },
    /** Call a HEAD endpoint */
    HEAD(c, a) {
      return p(c, { ...a, method: "HEAD" });
    },
    /** Call a PATCH endpoint */
    PATCH(c, a) {
      return p(c, { ...a, method: "PATCH" });
    },
    /** Call a TRACE endpoint */
    TRACE(c, a) {
      return p(c, { ...a, method: "TRACE" });
    },
    /** Register middleware */
    use(...c) {
      for (const a of c)
        if (a) {
          if (typeof a != "object" || !("onRequest" in a || "onResponse" in a || "onError" in a))
            throw new Error("Middleware must be an object with one of `onRequest()`, `onResponse() or `onError()`");
          h.push(a);
        }
    },
    /** Unregister middleware */
    eject(...c) {
      for (const a of c) {
        const m = h.indexOf(a);
        m !== -1 && h.splice(m, 1);
      }
    }
  };
}
function $(r, t, e) {
  if (t == null)
    return "";
  if (typeof t == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${r}=${(e == null ? void 0 : e.allowReserved) === true ? t : encodeURIComponent(t)}`;
}
function H(r, t, e) {
  if (!t || typeof t != "object")
    return "";
  const s = [], n = {
    simple: ",",
    label: ".",
    matrix: ";"
  }[e.style] || "&";
  if (e.style !== "deepObject" && e.explode === false) {
    for (const l in t)
      s.push(l, e.allowReserved === true ? t[l] : encodeURIComponent(t[l]));
    const i = s.join(",");
    switch (e.style) {
      case "form":
        return `${r}=${i}`;
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${r}=${i}`;
      default:
        return i;
    }
  }
  for (const i in t) {
    const l = e.style === "deepObject" ? `${r}[${i}]` : i;
    s.push($(l, t[i], e));
  }
  const o = s.join(n);
  return e.style === "label" || e.style === "matrix" ? `${n}${o}` : o;
}
function P(r, t, e) {
  if (!Array.isArray(t))
    return "";
  if (e.explode === false) {
    const o = { form: ",", spaceDelimited: "%20", pipeDelimited: "|" }[e.style] || ",", i = (e.allowReserved === true ? t : t.map((l) => encodeURIComponent(l))).join(o);
    switch (e.style) {
      case "simple":
        return i;
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${r}=${i}`;
      // case "spaceDelimited":
      // case "pipeDelimited":
      default:
        return `${r}=${i}`;
    }
  }
  const s = { simple: ",", label: ".", matrix: ";" }[e.style] || "&", n = [];
  for (const o of t)
    e.style === "simple" || e.style === "label" ? n.push(e.allowReserved === true ? o : encodeURIComponent(o)) : n.push($(r, o, e));
  return e.style === "label" || e.style === "matrix" ? `${s}${n.join(s)}` : n.join(s);
}
function O(r) {
  return function(e) {
    const s = [];
    if (e && typeof e == "object")
      for (const n in e) {
        const o = e[n];
        if (o != null) {
          if (Array.isArray(o)) {
            if (o.length === 0)
              continue;
            s.push(
              P(n, o, {
                style: "form",
                explode: true,
                ...r == null ? void 0 : r.array,
                allowReserved: (r == null ? void 0 : r.allowReserved) || false
              })
            );
            continue;
          }
          if (typeof o == "object") {
            s.push(
              H(n, o, {
                style: "deepObject",
                explode: true,
                ...r == null ? void 0 : r.object,
                allowReserved: (r == null ? void 0 : r.allowReserved) || false
              })
            );
            continue;
          }
          s.push($(n, o, r));
        }
      }
    return s.join("&");
  };
}
function G(r, t) {
  let e = r;
  for (const s of r.match(B) ?? []) {
    let n = s.substring(1, s.length - 1), o = false, i = "simple";
    if (n.endsWith("*") && (o = true, n = n.substring(0, n.length - 1)), n.startsWith(".") ? (i = "label", n = n.substring(1)) : n.startsWith(";") && (i = "matrix", n = n.substring(1)), !t || t[n] === void 0 || t[n] === null)
      continue;
    const l = t[n];
    if (Array.isArray(l)) {
      e = e.replace(s, P(n, l, { style: i, explode: o }));
      continue;
    }
    if (typeof l == "object") {
      e = e.replace(s, H(n, l, { style: i, explode: o }));
      continue;
    }
    if (i === "matrix") {
      e = e.replace(s, `;${$(n, l)}`);
      continue;
    }
    e = e.replace(s, i === "label" ? `.${encodeURIComponent(l)}` : encodeURIComponent(l));
  }
  return e;
}
function Q(r) {
  return r instanceof FormData ? r : JSON.stringify(r);
}
function _(r, t) {
  var n;
  let e = `${t.baseUrl}${r}`;
  (n = t.params) != null && n.path && (e = G(e, t.params.path));
  let s = t.querySerializer(t.params.query ?? {});
  return s.startsWith("?") && (s = s.substring(1)), s && (e += `?${s}`), e;
}
function X(...r) {
  const t = new Headers();
  for (const e of r) {
    if (!e || typeof e != "object")
      continue;
    const s = e instanceof Headers ? e.entries() : Object.entries(e);
    for (const [n, o] of s)
      if (o === null)
        t.delete(n);
      else if (Array.isArray(o))
        for (const i of o)
          t.append(n, i);
      else o !== void 0 && t.set(n, o);
  }
  return t;
}
function U(r) {
  return r.endsWith("/") ? r.substring(0, r.length - 1) : r;
}
class Z extends EventTarget {
  constructor(t, e, s) {
    super(), this.promise = this.track(t, e, s);
  }
  async track(t, e, s) {
    const n = typeof e == "object" ? e.id : e, o = {
      pollingInterval: 2e3,
      ...s
    };
    let i = 0;
    for (; ; ) {
      const l = await t.GET("/v1/jobs/{jobId}", {
        params: { path: { jobId: n } }
      });
      if (l.error) {
        if (i < 5 && l.error.error.code === "404.job") {
          i++, await this.delay(o.pollingInterval);
          continue;
        }
        throw l.error;
      }
      const y = l.data.data, h = V(y);
      if (this.dispatchEvent(
        new CustomEvent("progress", {
          detail: { ...h, state: y.state.current }
        })
      ), K(y)) {
        if (y.state.current === "error")
          throw y;
        return this.dispatchEvent(
          new CustomEvent("done", {
            detail: y
          })
        ), y;
      }
      await this.delay(o.pollingInterval);
    }
  }
  delay(t = 2e3) {
    return new Promise((e) => setTimeout(e, t));
  }
}
function K(r) {
  return [
    "completed",
    "error",
    "expired"
  ].includes(r.state.current);
}
const D = "0001-01-01T00:00:00Z";
function V(r) {
  if (!r.tasks || r.tasks.length === 0)
    return { total: 0, completed: 0, failed: 0, percent: 100 };
  const t = r.tasks.reduce(
    (e, s) => {
      var o, i, l;
      const n = ((o = s.steps) == null ? void 0 : o.length) || 1;
      if (e.total += n, s.state.current === "pending")
        return e;
      if (!((i = s.steps) != null && i.length)) {
        switch (s.state.current) {
          case "completed":
            e.completed += 1;
            break;
          case "error":
            e.failed += 1;
        }
        return e;
      }
      return (l = s.steps) == null || l.forEach((y) => {
        if (y.completed !== D) {
          e.completed += 1;
          return;
        }
        ["error", "completed"].includes(s.state.current || "") && y.started !== D && (e.failed += 1);
      }), e;
    },
    { total: 0, completed: 0, failed: 0 }
  );
  return {
    ...t,
    percent: t.completed / t.total * 100
  };
}
function ee(r, t, e) {
  return new Z(r, t, e);
}
function te({
  apiKey: r,
  baseUrl: t = "https://api.cycle.io",
  hubId: e,
  fetch: s
}) {
  const n = W({
    baseUrl: t,
    fetch: s || fetch
  }), o = {
    async onRequest({ request: i }) {
      return i.headers.set("Authorization", `Bearer ${r}`), i.headers.set("X-Hub-Id", e), i;
    }
  };
  return n.use(o), n;
}
const zeroTimeString = "0001-01-01T00:00:00Z";
async function triggerPipeline(client, pipelineId, variables, advanced) {
  var _a;
  core__namespace.info(`🚀 Triggering pipeline: ${pipelineId}`);
  const { data, error } = await client.POST(
    `/v1/pipelines/{pipelineId}/trigger`,
    {
      params: {
        path: {
          pipelineId
        }
      },
      body: {
        secret: core__namespace.getInput("secret"),
        variables,
        advanced
      }
    }
  );
  if (error) {
    throw new Error(
      `❌ Failed to trigger pipeline: ${error.error.title} ${error.error.detail ? ` - ${error.error.detail}` : ""}`
    );
  }
  const { data: jd } = data;
  try {
    const job = await ee(client, jd.job.id).promise;
    const pipelineRunId = (_a = job.tasks[0]) == null ? void 0 : _a.output.run_id;
    if (!pipelineRunId) {
      throw new Error(`❌ Failed to trigger pipeline: job is missing run ID`);
    }
    core__namespace.info(`✅ Pipeline triggered successfully! Run ID: ${pipelineRunId}`);
    return pipelineRunId;
  } catch (e) {
    if (typeof e === "object" && "id" in e) {
      const j = e;
      throw new Error(
        `❌ Failed to trigger pipeline: job failed - ${j.state.error.message}`
      );
    } else {
      throw new Error(
        `❌ Failed to trigger pipeline: ${JSON.stringify(e, null, 2)}`
      );
    }
  }
}
async function trackPipeline(client, pipelineId, runId) {
  let completedSteps = /* @__PURE__ */ new Set();
  while (true) {
    const { data, error } = await client.GET(
      `/v1/pipelines/{pipelineId}/runs/{runId}`,
      {
        params: {
          path: {
            pipelineId,
            runId
          }
        }
      }
    );
    if (error) {
      core__namespace.setFailed(
        `❌ Error fetching pipeline status: ${error.error.title} ${error.error.detail ? ` - ${error.error.detail}` : ""}`
      );
      return;
    }
    const { data: pipelineRun } = data;
    for (const stage of pipelineRun.stages) {
      for (const step of stage.steps) {
        const stepId = step.identifier || step.action;
        const finished = step.events.finished != zeroTimeString;
        if (finished && !completedSteps.has(stepId)) {
          completedSteps.add(stepId);
          if (step.success) {
            core__namespace.info(`✅ Step completed: ${step.action} (ident: ${step.identifier})`);
          } else {
            core__namespace.setFailed(`❌ Step failed: ${step.action} (ident: ${step.identifier})`);
            return;
          }
        }
      }
    }
    if (pipelineRun.state.current === "complete") {
      core__namespace.info("🎉 Pipeline run completed successfully!");
      return;
    }
    core__namespace.info("⏳ Pipeline still running...");
    await new Promise((res) => setTimeout(res, 5e3));
  }
}
async function run() {
  try {
    const apiKey = core__namespace.getInput("api_key");
    const hubId = core__namespace.getInput("hub_id");
    const pipelineId = core__namespace.getInput("pipeline_id");
    let variables = {};
    try {
      const variablesInput = core__namespace.getInput("variables");
      if (variablesInput) {
        variables = JSON.parse(variablesInput);
      }
    } catch (error) {
      throw new Error("❌ Invalid JSON format in 'variables' input.");
    }
    let advanced = {};
    try {
      const advancedInput = core__namespace.getInput("advanced");
      if (advancedInput) {
        advanced = JSON.parse(advancedInput);
      }
    } catch (error) {
      throw new Error("❌ Invalid JSON format in 'advanced' input.");
    }
    const client = te({
      apiKey,
      hubId
    });
    const pipelineRunId = await triggerPipeline(client, pipelineId, variables, advanced);
    await trackPipeline(client, pipelineId, pipelineRunId);
  } catch (error) {
    core__namespace.setFailed(`❌ Action failed: ${error.message}`);
  }
}
run();
exports.zeroTimeString = zeroTimeString;
