export function LoggerModal({ logs, onClose }) {
  const overlay = document.createElement('div');
  overlay.className = 'logger-modal-overlay active';

  const card = document.createElement('div');
  card.className = 'logger-modal-card';

  const title = document.createElement('h2');
  title.textContent = '작업 로그';

  const list = document.createElement('ul');

  if (!logs.length) {
    const empty = document.createElement('p');
    empty.textContent = '아직 수행된 작업이 없습니다.';
    empty.style.color = '#94a3b8';
    card.append(title, empty);
  } else {
    logs.forEach((entry) => {
      const item = document.createElement('li');
      item.textContent = `${formatDate(entry.at)} · ${entry.message}`;
      list.appendChild(item);
    });
    card.append(title, list);
  }

  const closeButton = document.createElement('button');
  closeButton.textContent = '닫기';
  closeButton.className = 'btn btn-secondary';
  closeButton.style.marginTop = '24px';
  closeButton.addEventListener('click', onClose);
  card.appendChild(closeButton);

  overlay.append(card);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      onClose();
    }
  });

  return overlay;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
