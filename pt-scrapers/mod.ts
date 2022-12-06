import puppeteer from "https://deno.land/x/puppeteer@9.0.1/mod.ts";
import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";

const url = 'https://kami4ka.github.io/dynamic-website-example/';

try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const html = await page.content();
    await page.screenshot({ path: "example.png" });
    
    const $ = cheerio.load(html);

    const pageText = $('div').text();

    console.log(pageText)
} catch(error) {
    console.log(error);
}