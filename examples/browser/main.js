const container = document.querySelector('#examples');
const summary = document.querySelector('#summary');
const runAll = document.querySelector('#run-all');
document.querySelector('#environment').textContent = navigator.userAgent;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

try {
  const { examples } = await import('../catalog.js');
  const cards = examples.map((example, index) => {
    const card = element('article', undefined, 'example');
    card.id = example.id;
    const header = element('div', undefined, 'example-header');
    const description = element('div', undefined, 'description');
    description.append(element('h3', example.title), element('p', example.subtitle, 'subtitle'),
      element('p', example.basis, 'basis'));
    const status = element('span', '未実行 / Ready', 'status');
    const button = element('button', '実行 / Run');
    button.setAttribute('aria-label', example.title + ' を実行 / Run');
    const actions = element('div', undefined, 'actions');
    actions.append(status, button);
    header.append(element('span', String(index + 1).padStart(2, '0'), 'number'), description, actions);
    const result = element('div', undefined, 'result');
    result.hidden = true;
    card.append(header, result);
    container.append(card);
    return { example, status, button, result, state: 'ready', runs: 0 };
  });

  function updateSummary() {
    const passed = cards.filter(card => card.state === 'passed').length;
    const failed = cards.filter(card => card.state === 'failed').length;
    summary.textContent = passed + ' / ' + cards.length + ' 成功 / passed' +
      (failed ? ' · ' + failed + ' 失敗 / failed' : '');
  }

  async function execute(card) {
    card.state = 'running';
    card.status.dataset.state = 'running';
    card.status.textContent = '実行中 / Running';
    card.result.hidden = false;
    card.result.replaceChildren();
    // Yield a frame so the running state appears before synchronous crypto work.
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
    try {
      const { run } = await card.example.load();
      const result = run();
      const list = element('ul');
      for (const label of result.checks) list.append(element('li', label));
      const details = element('details');
      details.append(element('summary', '入出力を見る / Inspect input & output'),
        element('pre', JSON.stringify({ input: result.input, output: result.output }, null, 2)));
      card.result.append(list, details);
      card.state = 'passed';
      card.runs++;
      card.status.textContent = 'PASS · ' + result.checks.length + ' checks · run ' + card.runs;
    } catch (error) {
      card.state = 'failed';
      card.status.textContent = 'FAIL';
      card.result.append(element('p', '実行に失敗しました / Execution failed\n' + error.message +
        '\nローカルサーバーと表示内容を確認し、ページを再読込してください。' +
        '\nCheck the local server and error, then reload the page.', 'error'));
    }
    card.status.dataset.state = card.state;
    const link = element('a', '呼び出しコード / Example source', 'source');
    link.href = '/examples/' + card.example.source + '?source';
    link.target = '_blank';
    link.rel = 'noopener';
    card.result.append(link);
    updateSummary();
  }

  async function executeSelection(selection) {
    runAll.disabled = true;
    for (const card of cards) card.button.disabled = true;
    try {
      for (const card of selection) await execute(card);
    } finally {
      runAll.disabled = false;
      for (const card of cards) card.button.disabled = false;
    }
  }
  for (const card of cards) {
    card.button.addEventListener('click', () => executeSelection([card]));
  }
  runAll.addEventListener('click', () => executeSelection(cards));
  runAll.disabled = false;
  updateSummary();
} catch (error) {
  const failure = document.querySelector('#page-error');
  failure.hidden = false;
  failure.textContent = '読込失敗 / Loading failed: ' + error.message;
  summary.textContent = 'ローカルサーバーを確認して再読込してください / Check the server and reload';
}
