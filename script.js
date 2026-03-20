const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentProjectImages = [];
let currentIndex = 0;

// 공통: 라이트박스 닫기 함수
function closeLightbox() {
  lightbox.classList.remove('active');
  setTimeout(() => {
    document.body.classList.remove('stop-scroll');
  }, 300);
}

// 1. 프로젝트별 이미지 클릭 이벤트
document.querySelectorAll('.project').forEach(project => {
  const imagesInProject = Array.from(project.querySelectorAll('.img-box img'));
  
  imagesInProject.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentProjectImages = imagesInProject;
      currentIndex = index;
      
      // [수정] 클릭 시 w_1000을 w_2000으로 바꿔 고화질 로드
      const highResSrc = img.src.replace('w_1000', 'w_2500');
      lightboxImg.src = highResSrc;
      
      document.body.classList.add('stop-scroll');
      
      lightbox.classList.add('active');
    });
  });
});

// 2. 배경 클릭 시 닫기
lightbox.addEventListener('click', (e) => {
  if (e.target !== lightboxImg && !e.target.classList.contains('nav-btn')) {
    closeLightbox();
  }
});

// 3. X 버튼 클릭 시 닫기
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});

// 4. 이전/다음 버튼 클릭 (이미지 순환 및 고화질 전환)
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
  // [수정] 이전 이미지도 고화질로 변경
  lightboxImg.src = currentProjectImages[currentIndex].src.replace('w_1000', 'w_2500');
});

nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentProjectImages.length;
  // [수정] 다음 이미지도 고화질로 변경
  lightboxImg.src = currentProjectImages[currentIndex].src.replace('w_1000', 'w_2500');
});