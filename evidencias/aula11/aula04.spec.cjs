const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// CASO 1: Acessibilidade - Inspeção automatizada e rótulo no formulário de cadastro (RNF-01)
test('acessibilidade: cadastro sem violações automatizadas detectadas', async ({ page }) => {
  await page.goto('/#cadastro');
  await expect(page.locator('#view-register')).toBeVisible();
  const resultado = await new AxeBuilder({ page }).analyze();
  expect(resultado.violations).toEqual([]);
});

test('acessibilidade: Nome possui rótulo associado (RNF-01)', async ({ page }) => {
  await page.goto('/#cadastro');
  await expect(page.locator('#view-register')).toBeVisible();
  // RNF-01: Associação real entre rótulo e campo de controle
  await expect(page.locator('#register-form').getByLabel('Nome', { exact: true })).toBeVisible();
});

// CASO 2: Acessibilidade - Navegação e foco por teclado no catálogo (RNF-02)
test('acessibilidade: adicionar produto pode receber foco por Tab (RNF-02)', async ({ page }) => {
  await page.goto('/#catalogo');
  const alvo = page.locator('[data-testid="add-to-cart"][data-product-id="produto-teste"]');
  await expect(alvo).toBeVisible();
  await page.locator('#refresh-catalog').focus();
  await page.keyboard.press('Tab');
  // RNF-02 / RNF-03: Botão de ação deve receber foco nativo do teclado
  await expect(alvo).toBeFocused();
});

// CASO 3: Usabilidade - Fluxo de cadastro com dados fictícios
test('usabilidade: fluxo de cadastro de novo usuário com dados fictícios', async ({ page }) => {
  await page.goto('/#cadastro');
  await expect(page.locator('#view-register')).toBeVisible();

  const emailUnico = `usuario_${Date.now()}@teste.com`;
  await page.locator('#register-name').fill('Maria da Silva');
  await page.locator('#register-email').fill(emailUnico);
  await page.locator('#register-password').fill('SenhaDidatica123!');
  await page.locator('#register-form').getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page.locator('#session-chip')).toContainText('Olá, Maria da Silva');
});

// CASO 4: Usabilidade - Jornada de compra com cupom VINTE e verificação de total
test('usabilidade: jornada de compra com cupom VINTE e cálculo do total', async ({ page }) => {
  await page.goto('/#catalogo');
  await expect(page.locator('#view-catalog')).toBeVisible();

  // 1. Localiza Produto Teste e adiciona ao carrinho
  const botaoAdicionar = page.locator('[data-testid="add-to-cart"][data-product-id="produto-teste"]');
  await expect(botaoAdicionar).toBeVisible();
  await botaoAdicionar.click();

  // 2. Navega para o carrinho
  await page.getByTestId('nav-cart').click();
  await expect(page.locator('#view-cart')).toBeVisible();
  await expect(page.getByTestId('cart-content')).toBeVisible();

  // 3. Aplica o cupom VINTE
  await page.locator('#coupon-code').fill('VINTE');
  await page.getByTestId('apply-coupon').click();

  // 4. Valida se o resumo é exibido com clareza para o usuário
  await expect(page.getByTestId('cart-summary')).toBeVisible();
  await expect(page.getByTestId('cart-discount')).toContainText('30,00'); // 20% de R$ 150
  await expect(page.getByTestId('cart-total')).toBeVisible();
});