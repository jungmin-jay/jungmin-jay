// ===================== 커스텀 커서 =====================

const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
cursor.innerHTML = '<span class="cursor-text">VIEW<br>IMAGE</span>';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let isLightboxOpen = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.2;
  cursorY += (mouseY - cursorY) * 0.2;

  if (!isLightboxOpen) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top  = cursorY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
document.addEventListener('mouseenter', () => {
  if (!isLightboxOpen) cursor.style.opacity = '1';
});

// 이미지 위에서 확대
document.querySelectorAll('.img-box img').forEach(img => {
  img.addEventListener('mouseenter', () => cursor.classList.add('expand'));
  img.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
});


// ===================== 라이트박스 =====================

const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn    = document.querySelector('.close-btn');

let currentProjectImages = [];
let currentIndex = 0;

// ── 커서를 따라다니는 좌우 버튼 ─────────────────────────
const cursorPrev = document.createElement('div');
cursorPrev.id = 'cursor-prev';
cursorPrev.className = 'cursor-btn';
lightbox.appendChild(cursorPrev);

const cursorNext = document.createElement('div');
cursorNext.id = 'cursor-next';
cursorNext.className = 'cursor-btn';
lightbox.appendChild(cursorNext);

let activeCursorBtn = null;
let lbMouseX = 0, lbMouseY = 0;
let lbBtnX = 0,   lbBtnY = 0;
let lbSide = null;

lightbox.addEventListener('mousemove', (e) => {
  lbMouseX = e.clientX;
  lbMouseY = e.clientY;

  const half = window.innerWidth / 2;
  const x = e.clientX;
  const y = e.clientY;

  // X 버튼 위에 있으면 좌우 버튼 숨김
  const closeBtnRect = closeBtn.getBoundingClientRect();
  const isOverCloseBtn = (
    x >= closeBtnRect.left && x <= closeBtnRect.right &&
    y >= closeBtnRect.top  && y <= closeBtnRect.bottom
  );

  if (isOverCloseBtn) {
    cursorPrev.style.display = 'none';
    cursorNext.style.display = 'none';
    activeCursorBtn = null;
    lbSide = null;
    return;
  }

  // 좌우 결정
  if (x < half) {
    cursorPrev.style.display = 'flex';
    cursorNext.style.display = 'none';
    activeCursorBtn = cursorPrev;
    lbSide = 'prev';
  } else {
    cursorNext.style.display = 'flex';
    cursorPrev.style.display = 'none';
    activeCursorBtn = cursorNext;
    lbSide = 'next';
  }

  // 이미지 위 여부 → 버튼 색상 전환
  const imgRect = lightboxImg.getBoundingClientRect();
  const isOverImage = (
    x >= imgRect.left && x <= imgRect.right &&
    y >= imgRect.top  && y <= imgRect.bottom
  );

  if (activeCursorBtn) {
    activeCursorBtn.classList.toggle('over-image', isOverImage);
  }
});

lightbox.addEventListener('mouseleave', () => {
  cursorPrev.style.display = 'none';
  cursorNext.style.display = 'none';
  activeCursorBtn = null;
  lbSide = null;
});

// 좌우 버튼 부드러운 이동 애니메이션
function animateLbBtn() {
  lbBtnX += (lbMouseX - lbBtnX) * 0.2;
  lbBtnY += (lbMouseY - lbBtnY) * 0.2;

  if (lbSide === 'prev') {
    cursorPrev.style.left = lbBtnX + 'px';
    cursorPrev.style.top  = lbBtnY + 'px';
    cursorPrev.style.transform = 'translate(-50%, -50%)';
  } else if (lbSide === 'next') {
    cursorNext.style.left = lbBtnX + 'px';
    cursorNext.style.top  = lbBtnY + 'px';
    cursorNext.style.transform = 'translate(-50%, -50%)';
  }

  requestAnimationFrame(animateLbBtn);
}
animateLbBtn();

// ── 점(dot) 인디케이터 ───────────────────────────────────
function createDots(total) {
  const old = lightbox.querySelector('.lightbox-dots');
  if (old) old.remove();

  const dotsEl = document.createElement('div');
  dotsEl.className = 'lightbox-dots';

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = i;
      showImage(currentIndex);
    });
    dotsEl.appendChild(dot);
  }

  lightbox.appendChild(dotsEl);
}

function updateDots(index) {
  const dots = lightbox.querySelectorAll('.lightbox-dots .dot');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

// ── 이미지 전환 ──────────────────────────────────────────
function showImage(index) {
  lightboxImg.style.opacity = 0;
  setTimeout(() => {
    const src = currentProjectImages[index].src.replace('w_1000', 'w_2500');
    lightboxImg.src = src;
    lightboxImg.style.opacity = 1;
    updateDots(index);
  }, 150);
}

// ── 라이트박스 열기 ──────────────────────────────────────
function openLightbox() {
  // 클릭 시점의 마우스 좌표로 버튼 위치 초기화
  lbBtnX   = mouseX;
  lbBtnY   = mouseY;
  lbMouseX = mouseX;
  lbMouseY = mouseY;

  lbSide = mouseX < window.innerWidth / 2 ? 'prev' : 'next';
  if (lbSide === 'prev') {
    cursorPrev.style.left = mouseX + 'px';
    cursorPrev.style.top  = mouseY + 'px';
    cursorPrev.style.transform = 'translate(-50%, -50%)';
    cursorPrev.style.display = 'flex';
    cursorNext.style.display = 'none';
    activeCursorBtn = cursorPrev;
  } else {
    cursorNext.style.left = mouseX + 'px';
    cursorNext.style.top  = mouseY + 'px';
    cursorNext.style.transform = 'translate(-50%, -50%)';
    cursorNext.style.display = 'flex';
    cursorPrev.style.display = 'none';
    activeCursorBtn = cursorNext;
  }

  isLightboxOpen = true;
  cursor.style.opacity = '0';
  document.body.classList.add('stop-scroll');
  lightbox.classList.add('active');
}

// ── 라이트박스 닫기 ──────────────────────────────────────
function closeLightbox() {
  isLightboxOpen = false;
  cursor.style.opacity = '1';
  lightbox.classList.remove('active');
  cursorPrev.style.display = 'none';
  cursorNext.style.display = 'none';
  activeCursorBtn = null;
  lbSide = null;
  setTimeout(() => {
    document.body.classList.remove('stop-scroll');
  }, 300);
}

// ── 이미지 클릭 → 라이트박스 열기 ───────────────────────
document.querySelectorAll('.project').forEach(project => {
  const imagesInProject = Array.from(project.querySelectorAll('.img-box img'));

  imagesInProject.forEach((img, index) => {
    img.addEventListener('click', () => {
      cursor.classList.remove('expand');
      currentProjectImages = imagesInProject;
      currentIndex = index;

      createDots(imagesInProject.length);
      lightboxImg.src = img.src.replace('w_1000', 'w_2500');
      updateDots(index);

      openLightbox();
    });
  });
});

// ── 라이트박스 클릭 → 이전/다음 ─────────────────────────
lightbox.addEventListener('click', (e) => {
  if (e.target.closest('.close-btn')) return;
  if (e.target.classList.contains('dot')) return;

  const half = window.innerWidth / 2;
  if (e.clientX < half) {
    currentIndex = (currentIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
    showImage(currentIndex);
  } else {
    currentIndex = (currentIndex + 1) % currentProjectImages.length;
    showImage(currentIndex);
  }
});

// ── X 버튼 ───────────────────────────────────────────────
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});

// ── 키보드 ───────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
    showImage(currentIndex);
  }
  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % currentProjectImages.length;
    showImage(currentIndex);
  }
});