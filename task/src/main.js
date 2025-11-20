import { ModalEdit } from './components/ModalEdit.js';
import { LoggerModal } from './components/LoggerModal.js';

const lectureSessions = [
  {
    id: crypto.randomUUID(),
    module: '4-1',
    title: 'React Beautiful Dnd 를 이용한 간단한 앱 만들기',
    description: 'Hello Pangea DnD 스타일로 칸반 보드를 구축합니다.',
    status: 'todo',
    author: '헬로우 판게아',
  },
  {
    id: crypto.randomUUID(),
    module: '4-2',
    title: 'Drag And Drop 기능 만들기 시작하기',
    description: '드래그 시작과 호버 시각 효과를 셋업합니다.',
    status: 'todo',
    author: '헬로우 판게아',
  },
  {
    id: crypto.randomUUID(),
    module: '4-3',
    title: 'DragEnd 기능 생성하기',
    description: 'onDragEnd 핸들러로 순서를 계산합니다.',
    status: 'progress',
    author: '헬로우 판게아',
  },
  {
    id: crypto.randomUUID(),
    module: '4-4',
    title: 'sort 로직 생성하기',
    description: 'droppable 간 이동 및 정렬 로직을 다룹니다.',
    status: 'progress',
    author: '헬로우 판게아',
  },
  {
    id: crypto.randomUUID(),
    module: '5-2',
    title: 'Login 기능 구현하기',
    description: 'Firebase Auth 로그인 흐름을 설계합니다.',
    status: 'done',
    author: 'Firebase',
  },
  {
    id: crypto.randomUUID(),
    module: '5-3',
    title: 'Redux Store에 유저 데이터 넣기',
    description: '스토어에 인증된 유저 정보를 적재합니다.',
    status: 'done',
    author: 'Redux',
  },
  {
    id: crypto.randomUUID(),
    module: '5-4',
    title: 'LogOut 기능 구현하기',
    description: '토큰 파기 및 상태 초기화를 실습합니다.',
    status: 'done',
    author: 'Firebase',
  },
  {
    id: crypto.randomUUID(),
    module: '5-5',
    title: '배포하기',
    description: '완성한 DnD 보드를 정적 사이트로 배포합니다.',
    status: 'done',
    author: '배포',
  },
];

const columns = [
  { id: 'todo', label: '준비 중', hint: 'dragStart · drop 핸들러 구성' },
  { id: 'progress', label: '실습 진행', hint: '드래그 중간 정렬 & 상태 전파' },
  { id: 'done', label: '완료됨', hint: '로그인/배포까지 마무리' },
];

const store = createStore({
  user: null,
  columns: columns.reduce(
    (acc, column) => ({ ...acc, [column.id]: lectureSessions.filter((item) => item.status === column.id) }),
    {}
  ),
  history: [
    {
      at: new Date(),
      message: '헬로우 판게아 DnD 강의 실습 보드를 초기화했습니다.',
    },
  ],
});

const app = document.querySelector('#app');
const layout = document.createElement('div');
layout.className = 'board-shell';

const heading = document.createElement('div');
heading.className = 'board-heading';

const title = document.createElement('div');
title.innerHTML = `
  <p class="board-eyebrow">오늘의 강의 목록</p>
  <h1>Drag & Drop · Firebase · Redux</h1>
  <p class="board-subtitle">Hello Pangea DnD 감성으로 강의 흐름을 따라가 보세요.</p>
`;

const controls = document.createElement('div');
controls.className = 'board-controls';

const historyButton = document.createElement('button');
historyButton.className = 'btn btn-secondary';
historyButton.textContent = '작업 로그 보기';
historyButton.addEventListener('click', () => {
  const modal = LoggerModal({ logs: store.getState().history, onClose: () => closeModal(modal) });
  document.body.appendChild(modal);
});

controls.append(historyButton);
heading.append(title, controls);

const authArea = document.createElement('div');
authArea.className = 'auth-area';

const columnsContainer = document.createElement('div');
columnsContainer.className = 'columns';

layout.append(heading, authArea, columnsContainer);
app.append(layout);

render();
store.subscribe(render);

function render() {
  renderAuth();
  renderColumns();
}

function renderAuth() {
  const state = store.getState();
  authArea.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'auth-card';

  if (!state.user) {
    const intro = document.createElement('div');
    intro.innerHTML = `
      <h3>Firebase 로그인 체험</h3>
      <p>이메일을 입력하면 가상의 Firebase Auth가 실행되고, Redux 스토어에 유저가 채워집니다.</p>
    `;

    const form = document.createElement('form');
    form.className = 'auth-form';

    const emailLabel = document.createElement('label');
    emailLabel.textContent = '이메일';
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.required = true;
    emailInput.value = 'dev@hello-pangea.com';
    emailLabel.appendChild(emailInput);

    const nameLabel = document.createElement('label');
    nameLabel.textContent = '닉네임 (선택)';
    const nameInput = document.createElement('input');
    nameInput.placeholder = '캠퍼스 계정';
    nameLabel.appendChild(nameInput);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'btn btn-primary';
    submit.textContent = 'Firebase 로그인';

    form.append(emailLabel, nameLabel, submit);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      const user = mockFirebaseSignIn(email, nameInput.value.trim());
      store.dispatch({ type: 'LOGIN', payload: user });
    });

    card.append(intro, form);
  } else {
    const info = document.createElement('div');
    info.className = 'auth-info';
    info.innerHTML = `
      <h3>환영합니다, ${state.user.displayName}님</h3>
      <p>${state.user.email} · Firebase 모드 · Redux Store에 유저 데이터 보관됨</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'auth-actions';

    const logout = document.createElement('button');
    logout.className = 'btn btn-secondary';
    logout.textContent = 'LogOut 기능 실행';
    logout.addEventListener('click', () => store.dispatch({ type: 'LOGOUT' }));

    const deploy = document.createElement('button');
    deploy.className = 'btn btn-primary';
    deploy.textContent = '배포 체크';
    deploy.addEventListener('click', () => {
      store.dispatch({
        type: 'APPEND_HISTORY',
        payload: `${state.user.displayName}님이 배포 체크를 완료했습니다.`,
      });
      alert('정적 사이트 배포 체크 완료!');
    });

    actions.append(logout, deploy);
    card.append(info, actions);
  }

  authArea.append(card);
}

function renderColumns() {
  const state = store.getState();
  columnsContainer.innerHTML = '';

  columns.forEach((column) => {
    const panel = document.createElement('section');
    panel.className = 'column';
    panel.dataset.column = column.id;

    const header = document.createElement('header');
    header.className = 'column__header';

    const title = document.createElement('div');
    title.innerHTML = `<p class="column__eyebrow">${column.hint}</p><h2>${column.label}</h2>`;

    const badge = document.createElement('span');
    badge.className = 'column__badge';
    badge.textContent = `${state.columns[column.id].length}개`;

    header.append(title, badge);

    const list = document.createElement('div');
    list.className = 'column__list';

    state.columns[column.id].forEach((item) => {
      const card = createCard(item, column.id, Boolean(state.user));
      list.appendChild(card);
    });

    if (!state.columns[column.id].length) {
      const empty = document.createElement('p');
      empty.className = 'column__empty';
      empty.textContent = '드래그해서 강의를 배치하세요.';
      list.appendChild(empty);
    }

    panel.append(header, list);
    columnsContainer.appendChild(panel);

    if (state.user) {
      enableDroppable(list, column.id);
    } else {
      panel.classList.add('column--locked');
    }
  });
}

function createCard(item, columnId, isActive) {
  const card = document.createElement('article');
  card.className = 'dnd-card';
  card.draggable = isActive;
  card.dataset.id = item.id;
  card.dataset.column = columnId;

  const top = document.createElement('div');
  top.className = 'dnd-card__top';
  top.innerHTML = `<span class="chip">${item.module}</span><p class="dnd-card__author">${item.author}</p>`;

  const title = document.createElement('h3');
  title.textContent = item.title;

  const desc = document.createElement('p');
  desc.className = 'dnd-card__desc';
  desc.textContent = item.description;

  const actions = document.createElement('div');
  actions.className = 'dnd-card__actions';

  const edit = document.createElement('button');
  edit.className = 'btn btn-secondary';
  edit.textContent = '내용 수정';
  edit.addEventListener('click', () => openEditModal(item, columnId));

  actions.append(edit);
  card.append(top, title, desc, actions);

  if (isActive) {
    card.addEventListener('dragstart', (event) => handleDragStart(event, item.id));
  }

  return card;
}

function enableDroppable(target, columnId) {
  target.addEventListener('dragover', (event) => {
    event.preventDefault();
    target.classList.add('column__list--hover');
  });

  target.addEventListener('dragleave', () => {
    target.classList.remove('column__list--hover');
  });

  target.addEventListener('drop', (event) => {
    event.preventDefault();
    target.classList.remove('column__list--hover');
    const id = event.dataTransfer?.getData('text/plain');
    if (!id) return;
    store.dispatch({ type: 'MOVE_ITEM', payload: { id, to: columnId } });
  });
}

function handleDragStart(event, id) {
  event.dataTransfer.setData('text/plain', id);
  event.dataTransfer.effectAllowed = 'move';
}

function openEditModal(item, columnId) {
  const modal = ModalEdit({
    log: { ...item },
    onClose: () => closeModal(modal),
    onSave: (next) => {
      store.dispatch({ type: 'UPDATE_ITEM', payload: { ...next, columnId } });
      closeModal(modal);
    },
  });

  document.body.appendChild(modal);
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

function mockFirebaseSignIn(email, displayName) {
  return {
    uid: crypto.randomUUID(),
    email,
    displayName: displayName || email.split('@')[0],
    provider: 'firebase-hello-pangea',
    loginAt: new Date(),
  };
}

function createStore(initialState) {
  let state = initialState;
  const listeners = [];

  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index >= 0) listeners.splice(index, 1);
      };
    },
    dispatch(action) {
      switch (action.type) {
        case 'LOGIN': {
          state = { ...state, user: action.payload };
          pushHistory(`${action.payload.displayName}님이 Firebase 로그인에 성공했습니다.`);
          break;
        }
        case 'LOGOUT': {
          const name = state.user?.displayName ?? '알 수 없음';
          state = { ...state, user: null };
          pushHistory(`${name}님이 LogOut 기능을 실행했습니다.`);
          break;
        }
        case 'MOVE_ITEM': {
          const { id, to } = action.payload;
          const updatedColumns = Object.fromEntries(columns.map((col) => [col.id, []]));
          let movedItem = null;

          columns.forEach((col) => {
            state.columns[col.id].forEach((item) => {
              if (item.id === id) {
                movedItem = { ...item, status: to };
                return;
              }
              updatedColumns[col.id].push(item);
            });
          });

          if (movedItem) {
            updatedColumns[to].push(movedItem);
            state = { ...state, columns: updatedColumns };
            pushHistory(`${movedItem.module} · ${movedItem.title}을(를) '${to}' 칼럼으로 이동했습니다.`);
          }
          break;
        }
        case 'UPDATE_ITEM': {
          const { columnId, ...nextItem } = action.payload;
          const updated = { ...state.columns };
          updated[columnId] = updated[columnId].map((item) => (item.id === nextItem.id ? nextItem : item));
          state = { ...state, columns: updated };
          pushHistory(`${nextItem.module} 강의 내용을 수정했습니다.`);
          break;
        }
        case 'APPEND_HISTORY': {
          pushHistory(action.payload);
          break;
        }
        default:
          break;
      }

      listeners.forEach((listener) => listener());
    },
  };

  function pushHistory(message) {
    const entry = { at: new Date(), message };
    state = { ...state, history: [entry, ...state.history].slice(0, 40) };
  }
}
