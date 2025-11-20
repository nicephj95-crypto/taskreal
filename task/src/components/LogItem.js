export function LogItem(log, { onEdit, onDelete }) {
  const item = document.createElement('li');
  item.className = 'log-item';

  const header = document.createElement('div');
  header.className = 'log-item__header';

  const title = document.createElement('h3');
  title.className = 'log-item__title';
  title.textContent = log.title;

  const date = document.createElement('span');
  date.className = 'log-item__date';
  date.textContent = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(log.createdAt);

  header.append(title, date);

  const body = document.createElement('p');
  body.className = 'log-item__body';
  body.textContent = log.description;

  const actions = document.createElement('div');
  actions.className = 'log-item__actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-secondary';
  editBtn.textContent = '수정하기';
  editBtn.addEventListener('click', () => onEdit(log));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = '삭제';
  deleteBtn.addEventListener('click', () => onDelete(log));

  actions.append(editBtn, deleteBtn);

  item.append(header, body, actions);

  return item;
}
