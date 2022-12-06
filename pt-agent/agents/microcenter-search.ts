/// <reference lib="dom" />
import { addDays, addMonths, addYears, getUnixTime } from 'date-fns';
import ms = require('ms');
import { ElementHandle, Page } from 'puppeteer';
import { URL } from 'url'
import { extractLabels } from '../util/labels';
import { AgentLabels, AgentOptions, AgentResult } from '../util/types';

async function parseProduct(handle: ElementHandle<HTMLElement>, labels: AgentLabels): Promise<AgentResult | null> {
  const [id, title, image, path, price] = await Promise.all([
    handle.$eval(".pDescription a", el => (el as HTMLElement).dataset.id).catch(() => null),
    handle.$eval(".pDescription", h4 => h4.textContent).catch(() => null),
    handle.$eval(".SearchResultProductImage", img => img.getAttribute("src")).catch(() => null),
    handle.$eval(".pDescription a", a => a.getAttribute("href")).catch(() => null),
    handle.$eval(".pDescription a", el => Number((el as HTMLElement).dataset?.price?.replace(".","")))
      .catch(() => null),
  ]);

  if (!id) {
    return null;
  }

  const href = path ? new URL(path, "https://www.microcenter.com").href : null;

  if (!price) {
    return null;
  }

  return {
    vendor: "micro-center",
    id,
    title: title?.trim() ?? "",
    image,
    href,
    price,
    labels: extractLabels(title, labels),
  }
}

export default async function microcenterSearch(page: Page, { url, labels }: AgentOptions): Promise<AgentResult[]> {
  await page.setCookie({
    name: "MicrocenterPrivacy",
    value: "Accepted",
    domain: ".microcenter.com",
    path: "/",
    httpOnly: false,
    sameSite: "None",
    secure: true,
    expires: getUnixTime(addMonths(new Date(), 6))
  }, {
    name: "storeSelected",
    value: "131",
    domain: ".microcenter.com",
    path: "/",
    httpOnly: false,
    sameSite: "None",
    secure: true,
    expires: getUnixTime(addYears(new Date(), 1))
  }, {
    name: "viewtype",
    value: "list",
    domain: ".microcenter.com",
    path: "/",
    httpOnly: false,
    sameSite: "None",
    secure: true,
    expires: getUnixTime(addDays(new Date(), 1))
  });
  await page.goto(url, { timeout: ms("10 mins")});

  const products = await page.$$<HTMLElement>("li.product_wrapper");  
  const agentResults = await Promise.all(products.map(product => parseProduct(product, labels)));
  return agentResults
    .filter<AgentResult>((result): result is AgentResult => !!result)
}