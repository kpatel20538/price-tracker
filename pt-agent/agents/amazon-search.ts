/// <reference lib="dom" />
import { addMonths, getUnixTime } from 'date-fns';
import ms = require('ms');
import { ElementHandle, Page } from 'puppeteer';
import { URL } from 'url'
import { extractLabels } from '../util/labels';
import { dollarsAndCents } from '../util/price';
import { AgentLabels, AgentOptions, AgentResult } from '../util/types';

async function parseResultItem(handle: ElementHandle<HTMLElement>, labels: AgentLabels): Promise<AgentResult | null> {
  const [id, isAdHolder] = await Promise.all([
    handle.evaluate(el => el.dataset.asin),
    handle.evaluate(el => el.classList.contains("AdHolder"))
  ]);

  if (isAdHolder || !id) {
    return null;
  }

  const [title, image, path, priceText] = await Promise.all([
    handle.$eval("h2", h2 => h2.textContent).catch(() => null),
    handle.$eval(".s-product-image-container img.s-image", img => img.getAttribute("src")).catch(() => null),
    handle.$eval("h2 a", a => a.getAttribute("href")).catch(() => null),
    handle.$eval(".a-price .a-offscreen", span => span.textContent).catch(() => null),
  ]);

  const href = path ? new URL(path, "https://www.amazon.com").href : null;

  const parseResult = priceText ? dollarsAndCents.parse(priceText) : null;
  const price = parseResult?.status ? parseResult.value : null;

  if (!price) {
    return null;
  }

  return {
    vendor: "amazon",
    id,
    title: title?.trim() ?? "",
    image,
    href,
    price,
    labels: extractLabels(title, labels)
  }
}

export default async function amazonSearch(page: Page, { url, labels }: AgentOptions): Promise<AgentResult[]> {
  await page.goto(url, { timeout: ms("10 mins") });
  
  const resultItems = await page.$$<HTMLElement>(".s-result-item")
  const agentResults = await Promise.all(resultItems.map(resultItem => parseResultItem(resultItem, labels)));
  return agentResults
    .filter<AgentResult>((result): result is AgentResult => !!result)
}