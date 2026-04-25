const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn    = document.querySelector('.close-btn');

let currentProjectImages = [];
let currentIndex = 0;

// ── 커서를 따라다니는 버튼 생성 ─────────────────────────
const cursorPrev = document.createElement('div');
cursorPrev.id = 'cursor-prev';
cursorPrev.className = 'cursor-btn';
lightbox.appendChild(cursorPrev);

const cursorNext = document.createElement('div');
cursorNext.id = 'cursor-next';
cursorNext.className = 'cursor-btn';
lightbox.appendChild(cursorNext);

let activeCursorBtn = null;

// 커서 위치 추적
lightbox.addEventListener('mousemove', (e) => {
  const half = window.innerWidth / 2;
  const x = e.clientX;
  const y = e.clientY;

  // X 버튼 영역 위에 있으면 커서 버튼 숨김
  const closeBtnRect = closeBtn.getBoundingClientRect();
  const isOverCloseBtn = (
    x >= closeBtnRect.left &&
    x <= closeBtnRect.right &&
    y >= closeBtnRect.top &&
    y <= closeBtnRect.bottom
  );

  if (isOverCloseBtn) {
    cursorPrev.style.display = 'none';
    cursorNext.style.display = 'none';
    activeCursorBtn = null;
    return;
  }

  // 좌우 버튼 전환
  if (x < half) {
    cursorPrev.style.left = x + 'px';
    cursorPrev.style.top  = y + 'px';
    cursorPrev.style.display = 'flex';
    cursorNext.style.display = 'none';
    activeCursorBtn = cursorPrev;
  } else {
    cursorNext.style.left = x + 'px';
    cursorNext.style.top  = y + 'px';
    cursorNext.style.display = 'flex';
    cursorPrev.style.display = 'none';
    activeCursorBtn = cursorNext;
  }

  // 이미지 위인지 판별 → 색상 전환
  const imgRect = lightboxImg.getBoundingClientRect();
  const isOverImage = (
    x >= imgRect.left &&
    x <= imgRect.right &&
    y >= imgRect.top &&
    y <= imgRect.bottom
  );

  if (activeCursorBtn) {
    if (isOverImage) {
      activeCursorBtn.classList.add('over-image');
    } else {
      activeCursorBtn.classList.remove('over-image');
    }
  }
});

// 마우스가 라이트박스 밖으로 나가면 버튼 숨김
lightbox.addEventListener('mouseleave', () => {
  cursorPrev.style.display = 'none';
  cursorNext.style.display = 'none';
  activeCursorBtn = null;
});

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

// ── 라이트박스 닫기 ──────────────────────────────────────
function closeLightbox() {
  lightbox.classList.remove('active');
  cursorPrev.style.display = 'none';
  cursorNext.style.display = 'none';
  activeCursorBtn = null;
  setTimeout(() => {
    document.body.classList.remove('stop-scroll');
  }, 300);
}

// ── 이미지 클릭 → 라이트박스 열기 ───────────────────────
document.querySelectorAll('.project').forEach(project => {
  const imagesInProject = Array.from(project.querySelectorAll('.img-box img'));

  imagesInProject.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentProjectImages = imagesInProject;
      currentIndex = index;

      createDots(imagesInProject.length);
      lightboxImg.src = img.src.replace('w_1000', 'w_2500');
      updateDots(index);

      document.body.classList.add('stop-scroll');
      lightbox.classList.add('active');
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