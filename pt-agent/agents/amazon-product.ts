/// <reference lib="dom" />
import ms = require('ms');
import { Page } from 'puppeteer';
import { extractLabels } from '../util/labels';
import { dollarsAndCents } from '../util/price';
import { AgentOptions, AgentResult } from '../util/types';

export default async function amazonProduct(page: Page, { url, labels }: AgentOptions): Promise<AgentResult[]> {
  await page.goto(url, { timeout: ms("10 mins") });

  const id = url.match(/\/dp\/([A-Z0-9]+)\/?/)?.[1];

  if (!id) {
    return [];
  }

  const [title, image, priceText] = await Promise.all([
    page.$eval("#productTitle", h1 => h1.textContent).catch(() => null),
    page.$eval("#landingImage", img => img.getAttribute("src")).catch(() => null),
    page.$eval(".a-price .a-offscreen", span => span.textContent).catch(() => null),
  ]);

  const parseResult = priceText ? dollarsAndCents.parse(priceText) : null;
  const price = parseResult?.status ? parseResult.value : null;

  if (!price) {
    return [];
  }

  return [{
    vendor: "amazon",
    id,
    title: title?.trim() ?? "",
    image,
    href: url,
    price,
    labels: extractLabels(title, labels)
  }]
}