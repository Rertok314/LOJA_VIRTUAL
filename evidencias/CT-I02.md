test at tests/aula02.test.js:55:1
✖ integração: pedido criado pode ser consultado (115.975835ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  400 !== 201
  
      at TestContext.<anonymous> (/Users/joseelias/Downloads/E-COMERCE TESTE DE SOFTWARE/alunos/tests/aula02.test.js:65:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Test.run (node:internal/test_runner/test:1113:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:788:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 400,
    expected: 201,
    operator: 'strictEqual',
    diff: 'simple'
  }

Pós-resolução:
✔ integração: pedido criado pode ser consultado (189.26515ms)
