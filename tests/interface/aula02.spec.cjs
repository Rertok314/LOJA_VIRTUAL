const { test, expect } = require('@playwright/test');

const endereco = {
  street: 'Rua Teste',
  number: '10',
  district: 'Centro',
  city: 'Maricá',
  state: 'RJ',
  zip: '24900000'
};

async function login(page) {
  await page.goto('/#entrar');
  await expect(page.locator('#view-login')).toBeVisible();
  await page.getByTestId('login-email').fill('cliente-a@loja.test');
  await page.getByTestId('login-password').fill('SenhaDidatica123!');
  await page.locator('#login-form').getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/#catalogo$/);
}

async function preencherEndereco(page) {
  for (const [campo, valor] of Object.entries(endereco)) {
    await page.getByTestId('addr-' + campo).fill(valor);
  }
}

test('sistema: jornada de compra e histórico após recarregar', async ({ page }) => {
  await login(page);

  // Adiciona 2 unidades do produto-teste
  const adicionar = page.locator('[data-testid="add-to-cart"][data-product-id="produto-teste"]');
  await adicionar.click();
  await adicionar.click();

  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('cart-subtotal')).toContainText('300,00');

  await preencherEndereco(page);

  const resposta = page.waitForResponse(r => r.url().endsWith('/api/checkout') && r.request().method() === 'POST');
  await page.getByTestId('checkout-button').click();
  const r = await resposta;
  expect(r.status()).toBe(201);
  const { order } = await r.json();

  await expect(page.getByTestId('receipt')).toContainText(order.id);
  await page.getByRole('link', { name: 'Pedidos', exact: true }).click();
  await page.reload();
  await expect(page.locator('#view-orders')).toBeVisible();
  await expect(page.getByTestId('orders-list').getByRole('heading', { name: order.id, exact: true })).toBeVisible();
});

test('sistema: compra acima do estoque exibe mensagem e recusa finalização', async ({ page }) => {
  await login(page);

  // Adiciona o produto ao carrinho
  const adicionar = page.locator('[data-testid="add-to-cart"][data-product-id="produto-teste"]');
  await adicionar.click();

  await page.getByTestId('nav-cart').click();

  // Altera a quantidade no carrinho para um valor excessivo (ex: 99 unidades)
  const inputQtd = page.locator('input[data-qty="true"][data-product-id="produto-teste"]');
  await inputQtd.fill('99');
  await inputQtd.dispatchEvent('change');

  await preencherEndereco(page);

  // Tenta finalizar compra
  await page.getByTestId('checkout-button').click();

  // Verifica se o feedback de erro do checkout exibe a mensagem de indisponibilidade
  const feedback = page.getByTestId('checkout-feedback');
  await expect(feedback).toBeVisible();
  await expect(feedback).toContainText('Quantidade indisponível em estoque');

  // Garante que o recibo de compra concluída NÃO foi exibido
  await expect(page.getByTestId('receipt')).toBeEmpty();
});

test('sistema: compra das últimas unidades zera estoque no catálogo', async ({ page }) => {
  await login(page);

  // O produto tinha 5 unidades. O primeiro teste comprou 2, restando 3 unidades.
  // Adiciona o produto ao carrinho e define a quantidade para comprar as 3 restantes
  const adicionar = page.locator('[data-testid="add-to-cart"][data-product-id="produto-teste"]');
  await adicionar.click();

  await page.getByTestId('nav-cart').click();
  const inputQtd = page.locator('input[data-qty="true"][data-product-id="produto-teste"]');
  await inputQtd.fill('3');
  await inputQtd.dispatchEvent('change');

  await preencherEndereco(page);

  const resposta = page.waitForResponse(r => r.url().endsWith('/api/checkout') && r.request().method() === 'POST');
  await page.getByTestId('checkout-button').click();
  const r = await resposta;
  expect(r.status()).toBe(201);

  // Verifica se o recibo foi exibido
  const { order } = await r.json();
  await expect(page.getByTestId('receipt')).toContainText(order.id);

  // Volta ao catálogo e recarrega para conferir o estoque zerado
  await page.getByRole('link', { name: 'Catálogo', exact: true }).click();
  await page.reload();
  const cardProduto = page.locator('[data-testid="product-card"][data-product-id="produto-teste"]');
  await expect(cardProduto.locator('.stock')).toContainText('Estoque: 0');
});

