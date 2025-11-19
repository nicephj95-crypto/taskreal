import { ModalEdit } from './components/ModalEdit.js';
import { LoggerModal } from './components/LoggerModal.js';
import { LogItem } from './components/LogItem.js';

const initialLogs = [
  {
    id: crypto.randomUUID(),
    title: 'UI 가이드 작성',
    description: '디자인 시스템에 맞춰 Logger 보드의 기본 UI 가이드를 정리했습니다.',
    author: '강의팀',
    createdAt: new Date('2024-01-15T09:30:00'),
  },
  {
    id: crypto.randomUUID(),
    title: '데이터 모델 점검',
    description: '실제 강의 노트 구조에 맞춰 LogItem 데이터 모델을 점검했습니다.',
    author: '운영자',
    createdAt: new Date('2024-01-17T13:10:00'),
  },
];

const actionLogs = [];

const app = document.querySelector('#app');
const board = document.createElement('section');
board.className = 'board-shell';

const heading = document.createElement('div');
heading.className = 'board-heading';

const title = document.createElement('h1');
title.textContent = 'Logger 게시판';

const historyButton = document.createElement('button');
historyButton.textContent = '작업 로그 보기';
historyButton.addEventListener('click', () => {
  const loggerModal = LoggerModal({
    logs: actionLogs,
    onClose: () => closeModal(loggerModal),
  });
  document.body.appendChild(loggerModal);
});

heading.append(title, historyButton);

const list = document.createElement('ul');
list.className = 'log-list';

board.append(heading, list);
app.append(board);

let currentLogs = [...initialLogs];
renderList();

function renderList() {
  list.innerHTML = '';

  if (!currentLogs.length) {
    const empty = document.createElement('p');
    empty.className = 'log-empty';
    empty.textContent = '등록된 게시글이 없습니다.';
    list.appendChild(empty);
    return;
  }

  currentLogs.forEach((log) => {
    const item = LogItem(log, {
      onEdit: openEditModal,
      onDelete: deleteLog,
    });
    list.appendChild(item);
  });
}

function openEditModal(log) {
  const modal = ModalEdit({
    log,
    onClose: () => closeModal(modal),
    onSave: (newLog) => {
      currentLogs = currentLogs.map((item) => (item.id === log.id ? newLog : item));
      actionLogs.unshift({
        at: new Date(),
        message: `${newLog.title} 게시글이 수정되었습니다.`,
      });
      renderList();
      closeModal(modal);
    },
  });

  document.body.appendChild(modal);
}

function deleteLog(log) {
  const confirmed = confirm(`'${log.title}' 게시글을 삭제할까요?`);
  if (!confirmed) return;

  currentLogs = currentLogs.filter((item) => item.id !== log.id);
  actionLogs.unshift({
    at: new Date(),
    message: `${log.title} 게시글이 삭제되었습니다.`,
  });
  renderList();
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.addEventListener(
    'transitionend',
    () => {
      modal.remove();
    },
    { once: true }
  );
}
