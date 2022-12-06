/// <reference lib="dom" />
import ms = require('ms');
import { ElementHandle, Page } from 'puppeteer';
import { URL } from 'url'
import { extractLabels } from '../util/labels';
import { dollarsAndCents } from '../util/price';
import { AgentLabels, AgentOptions, AgentResult } from '../util/types';

async function parseSkuItem(handle: ElementHandle<HTMLElement>, labels: AgentLabels): Promise<AgentResult | null> {
  const [id, title, image, path, priceText] = await Promise.all([
    handle.evaluate(el => el.dataset.skuId),
    handle.$eval(".sku-header", h4 => h4.textContent).catch(() => null),
    handle.$eval(".product-image", img => img.getAttribute("src")).catch(() => null),
    handle.$eval(".sku-header a", a => a.getAttribute("href")).catch(() => null),
    handle.$eval(".priceView-hero-price *[aria-hidden='true']", span => span.textContent).catch(() => null),
  ]);

  if (!id) {
    return null;
  }

  const href = path ? new URL(path, "https://www.bestbuy.com").href : null;

  const parseResult = priceText ? dollarsAndCents.parse(priceText) : null;
  const price = parseResult?.status ? parseResult.value : null;

  if (!price) {
    return null;
  }

  return {
    vendor: "best-buy",
    id,
    title: title?.trim() ?? "",
    image,
    href,
    price,
    labels: extractLabels(title, labels),
  }
}

export default async function bestbuySearch(page: Page, { url, labels }: AgentOptions): Promise<AgentResult[]> {
  await page.goto(url, { timeout: ms("10 mins"), waitUntil: "domcontentloaded" });
  const skuItems = await page.$$<HTMLElement>(".sku-item");
  const agentResults = await Promise.all(skuItems.map(skuItem => parseSkuItem(skuItem, labels)));
  return agentResults
    .filter<AgentResult>((result): result is AgentResult => !!result)
}