import { expect, test } from '@playwright/test';

const FORBIDDEN_PATTERNS = [
  /permission denied/i,
  /column .* does not exist/i,
  /undefined/i,
  /Cannot read properties/i,
  /Failed to fetch/i,
];

async function guardPage(page) {
  const failures = [];

  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' || FORBIDDEN_PATTERNS.some((pattern) => pattern.test(text))) {
      failures.push(`console ${message.type()}: ${text}`);
    }
  });
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));

  async function assertHealthy() {
    await expect(page.locator('#root')).not.toBeEmpty();
    const bodyText = await page.locator('body').innerText();
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(bodyText, `forbidden UI text: ${pattern}`).not.toMatch(pattern);
    }

    const errorToasts = await page.getByTestId('toast').filter({ hasText: /오류|permission denied|Failed to fetch/i }).count();
    expect(errorToasts, 'error toast should not be visible').toBe(0);
    expect(failures, 'browser console/page errors').toEqual([]);
  }

  return { assertHealthy };
}

async function gotoApp(page) {
  await page.goto('/');
  await expect(page.getByTestId('nav-analysis')).toBeVisible();
}

async function nav(page, key) {
  await page.getByTestId(`nav-${key}`).click();
}

function cartItem(page, name) {
  return page.getByTestId('cart-item').filter({ hasText: name });
}

async function clearCart(page) {
  await nav(page, 'cart');
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const deleteButton = page.getByTestId('cart-delete').first();
    if (!(await deleteButton.isVisible().catch(() => false))) break;
    await deleteButton.click();
    await page.waitForTimeout(400);
  }
  await expect(page.getByTestId('cart-empty')).toBeVisible();
}

async function addInventoryItem(page, name) {
  await nav(page, 'inventory');
  const row = page.getByTestId('data-row').filter({ hasText: name }).first();
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: '담기' }).click();
  await expect(page.getByTestId('toast').filter({ hasText: '장바구니에 추가했습니다' })).toBeVisible();
  await nav(page, 'cart');
  await expect(cartItem(page, name)).toBeVisible();
}

async function reloadMany(page, times, assertion, assertHealthy) {
  for (let index = 0; index < times; index += 1) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('nav-analysis')).toBeVisible();
    await assertion();
    await assertHealthy();
  }
}

async function deleteRowByTitle(page, title) {
  const row = page.getByTestId('data-row').filter({ hasText: title }).first();
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: '삭제' }).click();
  await expect(row).toHaveCount(0);
}

async function deleteAllRowsByTitle(page, title) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const row = page.getByTestId('data-row').filter({ hasText: title }).first();
    if (!(await row.isVisible().catch(() => false))) break;
    await row.getByRole('button', { name: '삭제' }).click();
    await page.waitForTimeout(400);
  }
  await expect(page.getByTestId('data-row').filter({ hasText: title })).toHaveCount(0);
}

test('cart and order data survive repeated refreshes', async ({ page }) => {
  const { assertHealthy } = await guardPage(page);
  await gotoApp(page);
  await assertHealthy();

  await clearCart(page);

  await addInventoryItem(page, '우유');
  await reloadMany(page, 20, async () => {
    await nav(page, 'cart');
    await expect(cartItem(page, '우유')).toBeVisible();
  }, assertHealthy);

  const milk = cartItem(page, '우유');
  await milk.getByTestId('cart-qty').fill('3');
  await milk.getByTestId('cart-qty').blur();
  await expect(page.getByTestId('toast').filter({ hasText: '장바구니 수량을 수정했습니다' })).toBeVisible();
  await expect(milk.getByTestId('cart-qty')).toHaveValue('3');

  await reloadMany(page, 20, async () => {
    await nav(page, 'cart');
    await expect(cartItem(page, '우유').getByTestId('cart-qty')).toHaveValue('3');
  }, assertHealthy);

  await cartItem(page, '우유').getByTestId('cart-delete').click();
  await expect(cartItem(page, '우유')).toHaveCount(0);

  await reloadMany(page, 20, async () => {
    await nav(page, 'cart');
    await expect(cartItem(page, '우유')).toHaveCount(0);
  }, assertHealthy);

  await addInventoryItem(page, '우유');
  await addInventoryItem(page, '원두');
  await nav(page, 'cart');
  await page.getByTestId('order-all').click();
  await expect(page.getByTestId('order-modal')).toBeVisible();
  await page.getByTestId('confirm-order').click();
  await expect(page.getByTestId('order-modal')).toHaveCount(0);
  await expect(page.getByTestId('cart-empty')).toBeVisible();

  await nav(page, 'history');
  await expect(page.getByTestId('data-row').filter({ hasText: 'ordered' }).first()).toBeVisible();

  await reloadMany(page, 20, async () => {
    await nav(page, 'cart');
    await expect(page.getByTestId('cart-empty')).toBeVisible();
    await nav(page, 'history');
    await expect(page.getByTestId('data-row').filter({ hasText: 'ordered' }).first()).toBeVisible();
  }, assertHealthy);
});

test('events, community posts, and coffee issues survive refresh and delete', async ({ page }) => {
  const { assertHealthy } = await guardPage(page);
  const suffix = Date.now();
  const eventTitle = `E2E 특이사항 ${suffix}`;
  const issueTitle = `E2E 커피이슈 ${suffix}`;

  await gotoApp(page);

  await nav(page, 'events');
  await page.getByPlaceholder('제목').fill(eventTitle);
  await page.getByRole('button', { name: '등록' }).click();
  await expect(page.getByTestId('toast').filter({ hasText: '특이사항이 저장되었습니다' })).toBeVisible();
  await expect(page.getByTestId('data-row').filter({ hasText: eventTitle })).toBeVisible();
  await reloadMany(page, 10, async () => {
    await nav(page, 'events');
    await expect(page.getByTestId('data-row').filter({ hasText: eventTitle })).toBeVisible();
  }, assertHealthy);
  await deleteRowByTitle(page, eventTitle);
  await reloadMany(page, 10, async () => {
    await nav(page, 'events');
    await expect(page.getByTestId('data-row').filter({ hasText: eventTitle })).toHaveCount(0);
  }, assertHealthy);

  await nav(page, 'community');
  await deleteAllRowsByTitle(page, '새 게시글');
  await page.getByRole('button', { name: '글쓰기' }).click();
  await expect(page.getByTestId('toast').filter({ hasText: '게시글이 저장되었습니다' })).toBeVisible();
  await expect(page.getByTestId('data-row').filter({ hasText: '새 게시글' }).first()).toBeVisible();
  await reloadMany(page, 10, async () => {
    await nav(page, 'community');
    await expect(page.getByTestId('data-row').filter({ hasText: '새 게시글' }).first()).toBeVisible();
  }, assertHealthy);
  await deleteRowByTitle(page, '새 게시글');
  await reloadMany(page, 10, async () => {
    await nav(page, 'community');
    await expect(page.getByTestId('data-row').filter({ hasText: '새 게시글' })).toHaveCount(0);
  }, assertHealthy);

  await nav(page, 'issues');
  await page.getByPlaceholder('제목').fill(issueTitle);
  await page.getByRole('button', { name: '등록' }).click();
  await expect(page.getByTestId('toast').filter({ hasText: '커피 이슈가 등록되었습니다' })).toBeVisible();
  await expect(page.getByTestId('data-row').filter({ hasText: issueTitle })).toBeVisible();
  await reloadMany(page, 10, async () => {
    await nav(page, 'issues');
    await expect(page.getByTestId('data-row').filter({ hasText: issueTitle })).toBeVisible();
  }, assertHealthy);
  await deleteRowByTitle(page, issueTitle);
  await reloadMany(page, 10, async () => {
    await nav(page, 'issues');
    await expect(page.getByTestId('data-row').filter({ hasText: issueTitle })).toHaveCount(0);
  }, assertHealthy);
});
