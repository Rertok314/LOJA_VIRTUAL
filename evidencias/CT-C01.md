joseelias@MacBook-Pro-de-Jose alunos % k6 run --summary-export=resultado-carga.json tests/carga/carga.js
  scenarios: 5 max VUs for 30s
  ✓ 'rate>0.99' rate=100.00%
  ✓ 'p(95)<500' p(95)=29.32ms
  ✓ 'rate<0.01' rate=0.00%
  checks_total.......: 290 (100% succeeded)
  http_req_duration..: avg=16.82ms med=13.75ms max=79.29ms p(95)=29.32ms
  http_req_failed....: 0.00% (0 out of 145)
  http_reqs..........: 145 (4.799208/s)
  data_received......: 154 MB (5.1 MB/s)
