function createField(labelText, type, value) {
  const label = document.createElement('label');
  label.textContent = labelText;

  const input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
  input.name = labelText;
  input.value = value;
  if (type !== 'textarea') {
    input.type = type;
  }
  label.appendChild(input);
  return { label, input };
}

export function ModalEdit({ log, onClose, onSave }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-edit-overlay active';

  const card = document.createElement('div');
  card.className = 'modal-card';

  const title = document.createElement('h2');
  title.textContent = '게시글 수정하기';

  const form = document.createElement('form');
  form.className = 'modal-form';

  const titleField = createField('제목', 'text', log.title);
  const descriptionField = createField('내용', 'textarea', log.description);
  const metaField = createField('작성자', 'text', log.author ?? '');

  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'btn btn-secondary';
  cancelButton.textContent = '취소';
  cancelButton.addEventListener('click', onClose);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'btn btn-primary';
  submitButton.textContent = '저장';

  actions.append(cancelButton, submitButton);
  form.append(titleField.label, descriptionField.label, metaField.label, actions);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const newLog = {
      ...log,
      title: titleField.input.value.trim(),
      description: descriptionField.input.value.trim(),
      author: metaField.input.value.trim() || '익명',
      updatedAt: new Date(),
    };

    if (!newLog.title || !newLog.description) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    onSave(newLog);
  });

  card.append(title, form);
  overlay.append(card);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      onClose();
    }
  });

  return overlay;
}
