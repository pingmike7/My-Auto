import { chromium } from 'playwright';

const GAME_URL = 'https://g4f.gg/game';

function timeToSeconds(timeStr) {
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

async function main() {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  console.log(`Opening: ${GAME_URL}`);

  await page.goto(GAME_URL, {
    waitUntil: 'networkidle'
  });

  // 读取当前时间
  await page.waitForSelector('#countdown');

  const beforeTime = (
    await page.locator('#countdown').innerText()
  ).trim();

  console.log(`Time before click: ${beforeTime}`);

  const beforeSeconds = timeToSeconds(beforeTime);

  // 点击 + ADD 3 HOURS
  await page.locator('button.vote-btn').click();

  // 等待页面更新
  await page.waitForTimeout(5000);

  // 再次读取时间
  const afterTime = (
    await page.locator('#countdown').innerText()
  ).trim();

  console.log(`Time after click: ${afterTime}`);

  const afterSeconds = timeToSeconds(afterTime);

  // 判断是否成功
  if (afterSeconds > beforeSeconds) {
    console.log('SUCCESS: Countdown increased.');
    process.exit(0);
  } else {
    console.error('FAILED: Countdown did not increase.');
    process.exit(1);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});