import fs from 'fs';
import { SingleBar, Presets } from 'cli-progress';
import { formatISO } from 'date-fns';
import delay from 'delay';
import puppeteer from 'puppeteer';
import { assert } from 'superstruct';
import toml from 'toml';
import ms from 'ms'
import { Agent, AgentOptions, Config } from './util/types';
import amazonProduct from './agents/amazon-product';
import amazonSearch from './agents/amazon-search';
import bestbuyProduct from './agents/bestbuy-product';
import bestbuySearch from './agents/bestbuy-search';
import microcenterProduct from './agents/microcenter-product';
import microcenterSearch from './agents/microcenter-search';

const agents: Record<string, Agent> = {
  amazonProduct,
  amazonSearch,
  bestbuyProduct,
  bestbuySearch,
  microcenterProduct,
  microcenterSearch
};

(async () => {
  const config = toml.parse(fs.readFileSync("./config.toml", { encoding: "utf-8" }));
  assert(config, Config);

  const browser = await puppeteer.launch({
    timeout: ms("5 mins")
  });
  const page = await browser.newPage();
  try {
    const accessTime = formatISO(new Date());
    const progress = new SingleBar({}, Presets.shades_classic);

    const tasks = Object.entries<AgentOptions[]>(config.agents)
      .flatMap(([key, options]) => options.map(task => ({ key, agent: agents[key], task })))

    progress.start(tasks.length, 0);
    const output = [];
    for (const {key, agent, task} of tasks) {
      const results = await agent(page, task)
      output.push(...results.map(result => ({ ...result, accessTime })))
      progress.increment(1, { key });
      await delay(250);      
    }
    progress.stop();
    const serialized = JSON.stringify(output.filter((item) => !!item), null, 2);
    fs.writeFileSync(`./out-${accessTime}.json`, serialized, { encoding: "utf-8" });
  } finally {
    await page.close();
    await browser.close();
  }
})()