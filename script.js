const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentProjectImages = [];
let currentIndex = 0;
let uiTimer;

// 공통: 라이트박스 닫기 함수
function closeLightbox() {
  lightbox.classList.remove('active');
  setTimeout(() => {
    document.body.classList.remove('stop-scroll');
    document.body.style.paddingRight = '0px';
  }, 300);
}

// 1. 프로젝트별 이미지 클릭 이벤트
document.querySelectorAll('.project').forEach(project => {
  const imagesInProject = Array.from(project.querySelectorAll('.img-box img'));
  
  imagesInProject.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentProjectImages = imagesInProject;
      currentIndex = index;
      
      lightboxImg.src = img.src;
      
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.classList.add('stop-scroll');
      
      lightbox.classList.add('active');
      resetUITimer();
    });
  });
});

// 2. 배경(여백) 클릭 시 닫기
lightbox.addEventListener('click', (e) => {
  // 클릭된 요소가 이미지(#lightbox-img)가 아니고, 이전/다음 버튼이 아닐 때만 닫기
  if (e.target !== lightboxImg && !e.target.classList.contains('nav-btn')) {
    closeLightbox();
  }
});

// 3. X 버튼 클릭 시 닫기 (이벤트 전파 방지 포함)
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // 배경 클릭 이벤트와 겹치지 않게 방지
  closeLightbox();
});

// 4. 이전/다음 버튼 클릭 (이미지 순환)
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // 닫기 이벤트 발생 방지
  currentIndex = (currentIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
  lightboxImg.src = currentProjectImages[currentIndex].src;
  resetUITimer();
});

nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentProjectImages.length;
  lightboxImg.src = currentProjectImages[currentIndex].src;
  resetUITimer();
});

// UI 타이머 로직은 이전과 동일하게 유지