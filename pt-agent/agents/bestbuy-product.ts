/// <reference lib="dom" />
import ms = require('ms');
import { Page } from 'puppeteer';
import { URL } from 'url';
import { extractLabels } from '../util/labels';
import { dollarsAndCents } from '../util/price';
import { AgentOptions, AgentResult } from '../util/types';

export default async function bestbuyProduct(page: Page, { url, labels }: AgentOptions): Promise<AgentResult[]> {
  await page.goto(url, { timeout: ms("10 mins"), waitUntil: "domcontentloaded" });

  const { searchParams } = new URL(url)
  const id = searchParams.get("skuId")

  if (!id) {
    return [];
  }

  const [title, image, priceText] = await Promise.all([
    page.$eval(".sku-title", h1 => h1.textContent).catch(() => null),
    page.$eval(".primary-image", img => img.getAttribute("src")).catch(() => null),
    page.$eval(".priceView-hero-price *[aria-hidden='true']", span => span.textContent).catch(() => null),
  ]);

  const parseResult = priceText ? dollarsAndCents.parse(priceText) : null;
  const price = parseResult?.status ? parseResult.value : null;

  if (!price) {
    return [];
  }

  return [{
    vendor: "best-buy",
    id,
    title: title?.trim() ?? "",
    image,
    href: url,
    price,
    labels: extractLabels(title, labels)
  }]
}