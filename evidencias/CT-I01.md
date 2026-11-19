joseelias@MacBook-Pro-de-Jose alunos % node --test --test-concurrency=1 tests/aula02.test.js
✖ integração: pedido reduz estoque (182.468106ms)
  AssertionError [ERR_ASSERTION]: Resetar dados antes da prática
      at TestContext.<anonymous> (/Users/joseelias/Downloads/E-COMERCE TESTE DE SOFTWARE/alunos/tests/aula02.test.js:40:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Test.run (node:internal/test_runner/test:1113:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }

Pós-resolução:
✔ integração: pedido reduz estoque (254.465003ms)
