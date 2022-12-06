/// <reference lib="dom" />
import { addDays, addMonths, addYears, getUnixTime } from 'date-fns';
import ms = require('ms');
import { Page } from 'puppeteer';
import { URL } from 'url';
import { extractLabels } from '../util/labels';
import { dollarsAndCents } from '../util/price';
import { AgentOptions, AgentResult } from '../util/types';

export default async function microcenterProduct(page: Page, { url, labels }: AgentOptions): Promise<AgentResult[]> {
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
  await page.goto(url, { timeout: ms("10 mins") });

  const id = url.match(/\/product\/([0-9]+)\/?/)?.[1];

  if (!id) {
    return [];
  }

  const [title, image, price] = await Promise.all([
    page.$eval("h1 *[data-name]", h1 => h1.textContent).catch(() => null),
    page.$eval(".productImageZoom", img => img.getAttribute("src")).catch(() => null),
    page.$eval("h1 *[data-name]", el => Number((el as HTMLElement).dataset?.price?.replace(".","")))
      .catch(() => null),
  ]);

  if (!price) {
    return [];
  }

  return [{
    vendor: "micro-center",
    id,
    title: title?.trim() ?? "",
    image,
    href: url,
    price,
    labels: extractLabels(title, labels)
  }]
}