import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete public portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Jasmine Builds — Useful systems, built from real life<\/title>/i,
  );
  assert.match(html, /Useful systems,/);
  assert.match(html, /Build Your Business Brain/);
  assert.match(html, /Business Brain Command Pack/);
  assert.match(html, /Concert Scout/);
  assert.match(html, /Vacation Quest Generator/);
  assert.match(html, /JDesigns Strategist/);
  assert.match(html, /social-card\.png/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("ships the required portfolio assets", async () => {
  await Promise.all([
    access(new URL("../public/social-card.png", import.meta.url)),
    access(new URL("../public/favicon.svg", import.meta.url)),
    access(new URL("../app/page.tsx", import.meta.url)),
    access(new URL("../app/globals.css", import.meta.url)),
    access(new URL("../.openai/hosting.json", import.meta.url)),
  ]);

  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});
