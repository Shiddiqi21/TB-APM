// ===== DETEKSI.JS — Detection Page Logic (Connected to Flask API) =====

const wasteData = {
  plastik:{
    icon:'🧴', name:'Plastik', color:'#3B82F6',
    desc:'Sampah plastik merupakan salah satu jenis sampah yang paling umum ditemui. Plastik terbuat dari polimer sintetis yang sulit terurai secara alami. Jenis ini mencakup botol minuman, kantong belanja, kemasan makanan, dan berbagai produk plastik lainnya yang perlu penanganan khusus agar tidak mencemari lingkungan.',
    badges:[
      {icon:'📍', label:'Asal', value:'Industri Petrokimia'},
      {icon:'🏷️', label:'Nama Ilmiah', value:'Polimer Sintetis'},
      {icon:'♻️', label:'Cara Daur Ulang', value:'Didaur ulang menjadi produk baru'}
    ],
    guide:[
      'Bilas bersih kemasan plastik sebelum dibuang',
      'Pipihkan/lumatkan untuk menghemat ruang',
      'Pisahkan berdasarkan kode resin (angka pada kemasan)',
      'Kumpulkan dalam wadah khusus sampah plastik',
      'Serahkan ke bank sampah atau pengepul daur ulang',
      'Jangan membakar plastik — menghasilkan racun berbahaya'
    ],
    refs:['Botol plastik PET','Kantong kresek','Kemasan makanan']
  },
  kaca:{
    icon:'🍾', name:'Kaca', color:'#06B6D4',
    desc:'Sampah kaca termasuk material anorganik yang membutuhkan waktu jutaan tahun untuk terurai. Kaca berasal dari silikon dioksida yang ditemukan di alam. Meski rapuh, kaca memiliki nilai daur ulang yang tinggi dan dapat dilebur kembali menjadi produk kaca baru tanpa kehilangan kualitas.',
    badges:[
      {icon:'📍', label:'Asal', value:'Alam/Tambang'},
      {icon:'🏷️', label:'Nama Ilmiah', value:'Silikon Dioksida (SiO₂)'},
      {icon:'♻️', label:'Cara Daur Ulang', value:'Dilebur ulang menjadi kaca baru'}
    ],
    guide:[
      'Tangani dengan hati-hati — kaca mudah pecah dan berbahaya',
      'Jangan memecah kaca secara sengaja',
      'Pisahkan dari jenis sampah lain untuk keamanan',
      'Bungkus potongan kaca tajam dengan koran sebelum dibuang',
      'Serahkan ke bank sampah atau pengepul kaca',
      'Kaca berwarna dan bening dipisah untuk daur ulang'
    ],
    refs:['Botol kaca bening','Botol kaca berwarna','Toples kaca']
  },
  logam:{
    icon:'🥫', name:'Logam', color:'#6B7280',
    desc:'Sampah logam memiliki nilai ekonomi tinggi dan tingkat daur ulang yang sangat baik. Logam dapat dilebur dan dibentuk kembali berulang kali tanpa kehilangan sifat materialnya. Jenis ini mencakup kaleng aluminium, kaleng besi, peralatan logam bekas, dan berbagai produk metal lainnya.',
    badges:[
      {icon:'📍', label:'Asal', value:'Industri Pertambangan'},
      {icon:'🏷️', label:'Nama Ilmiah', value:'Logam/Alloy'},
      {icon:'♻️', label:'Cara Daur Ulang', value:'Dilebur dan dibentuk ulang'}
    ],
    guide:[
      'Pisahkan logam aluminium dari besi/baja',
      'Lumatkan kaleng untuk menghemat volume penyimpanan',
      'Bersihkan dari sisa makanan/minuman sebelum dikumpulkan',
      'Kumpulkan dalam jumlah cukup sebelum dijual ke pengepul',
      'Logam berkarat tetap bisa didaur ulang',
      'Periksa harga beli di bank sampah atau pengepul terdekat'
    ],
    refs:['Kaleng aluminium','Kaleng besi','Besi tua']
  },
  kardus:{
    icon:'📦', name:'Kardus', color:'#F59E0B',
    desc:'Kardus dan karton termasuk sampah organik yang relatif mudah terurai dan memiliki nilai daur ulang yang baik. Terbuat dari serat selulosa kayu, kardus dapat diproses kembali menjadi produk kertas baru. Kondisi kering sangat penting untuk menjaga kualitas kardus agar dapat didaur ulang.',
    badges:[
      {icon:'📍', label:'Asal', value:'Industri Kehutanan'},
      {icon:'🏷️', label:'Nama Ilmiah', value:'Serat Selulosa'},
      {icon:'♻️', label:'Cara Daur Ulang', value:'Diolah menjadi produk kertas baru'}
    ],
    guide:[
      'Jaga agar kardus tetap kering — basah mengurangi nilainya',
      'Lipat dan ratakan kardus untuk menghemat ruang',
      'Ikat/bundel kardus yang sudah diratakan',
      'Lepaskan pita perekat/selotip sebelum dikumpulkan',
      'Pisahkan dari kardus yang terkontaminasi makanan berminyak',
      'Serahkan ke bank sampah untuk mendapat nilai ekonomi'
    ],
    refs:['Kardus bekas','Kotak karton','Kertas tebal']
  }
};

// DOM refs
const uploadZone = document.getElementById('uploadZone');
const previewZone = document.getElementById('previewZone');
const previewImg = document.getElementById('previewImg');
const previewName = document.getElementById('previewName');
const fileInput = document.getElementById('fileInput');
const removeImg = document.getElementById('removeImg');
const detectBtn = document.getElementById('detectBtn');
const loadingState = document.getElementById('loadingState');
const resultSection = document.getElementById('resultSection');
const loadingText = document.getElementById('loadingText');

// Steps
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const line12 = document.getElementById('line12');
const line23 = document.getElementById('line23');

function setStep(n){
  [step1,step2,step3].forEach(s=>s.classList.remove('active','done'));
  [line12,line23].forEach(l=>l.classList.remove('done'));
  if(n>=1) step1.classList.add(n===1?'active':'done');
  if(n>=2){step1.classList.remove('active');step1.classList.add('done');line12.classList.add('done');step2.classList.add(n===2?'active':'done');}
  if(n>=3){step2.classList.remove('active');step2.classList.add('done');line23.classList.add('done');step3.classList.add('active');}
}

let currentFile = null;

function showPreview(file){
  currentFile = file;
  const url = URL.createObjectURL(file);
  previewImg.src = url;
  previewName.textContent = file.name;
  uploadZone.style.display = 'none';
  previewZone.style.display = 'block';
  detectBtn.disabled = false;
  setStep(2);
}

function resetForm(){
  currentFile = null;
  fileInput.value = '';
  previewImg.src = '';
  previewZone.style.display = 'none';
  uploadZone.style.display = 'block';
  loadingState.style.display = 'none';
  resultSection.style.display = 'none';
  detectBtn.disabled = true;
  detectBtn.style.display = 'flex';
  setStep(1);
}

// File input
fileInput.addEventListener('change',e=>{
  const f = e.target.files[0];
  if(f) showPreview(f);
});

// Remove image
removeImg.addEventListener('click', resetForm);

// Drag & Drop
uploadZone.addEventListener('dragover',e=>{e.preventDefault();uploadZone.classList.add('drag-over')});
uploadZone.addEventListener('dragleave',()=>uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop',e=>{
  e.preventDefault();uploadZone.classList.remove('drag-over');
  const f = e.dataTransfer.files[0];
  if(f && f.type.startsWith('image/')) showPreview(f);
});
uploadZone.addEventListener('click',()=>fileInput.click());

// Loading messages
const loadMsgs = ['Memproses gambar...','Menganalisis pola...','Mendeteksi kategori...','Menyelesaikan analisis...'];
let loadIdx = 0;
let loadTimer = null;

// ===== DETECT BUTTON — CONNECTED TO FLASK API =====
detectBtn.addEventListener('click', async ()=>{
  if(!currentFile) return;

  // Show loading
  detectBtn.style.display = 'none';
  loadingState.style.display = 'block';
  resultSection.style.display = 'none';
  loadIdx = 0;
  loadingText.textContent = loadMsgs[0];
  loadTimer = setInterval(()=>{
    loadIdx = (loadIdx+1) % loadMsgs.length;
    loadingText.textContent = loadMsgs[loadIdx];
  }, 600);
  setStep(2);

  try {
    // Kirim gambar ke Flask API
    const formData = new FormData();
    formData.append('file', currentFile);

    const res = await fetch('/api/predict', {
      method: 'POST',
      body: formData
    });

    if(!res.ok){
      const errData = await res.json().catch(()=>({}));
      throw new Error(errData.error || 'Server error');
    }

    const result = await res.json();
    clearInterval(loadTimer);
    loadingState.style.display = 'none';
    showResult(result.category, result.confidence, result.all_predictions);
    setStep(3);

  } catch(err) {
    clearInterval(loadTimer);
    loadingText.textContent = '❌ Gagal mendeteksi. Pastikan server Flask berjalan.';
    console.error('Prediction error:', err);
    setTimeout(()=>{
      loadingState.style.display = 'none';
      detectBtn.style.display = 'flex';
    }, 3000);
  }
});

// ===== SHOW RESULT =====
function showResult(category, confidence, allPredictions){
  const data = wasteData[category];
  if(!data) return;

  // Accent bar
  document.getElementById('resultAccent').style.background = data.color;

  // Icon & name
  document.getElementById('resultIcon').textContent = data.icon;
  const catEl = document.getElementById('resultCategory');
  catEl.textContent = data.name;
  catEl.style.color = data.color;

  // Confidence bar
  const confVal = document.getElementById('confidenceVal');
  if(confVal) confVal.textContent = confidence + '%';
  const confFill = document.getElementById('confidenceFill');
  if(confFill){
    confFill.style.width = '0';
    confFill.style.background = data.color;
    setTimeout(()=>{ confFill.style.width = confidence + '%'; }, 100);
  }

  // Description
  document.getElementById('resultDesc').textContent = data.desc;

  // Badges
  const badgesEl = document.getElementById('resultBadges');
  badgesEl.innerHTML = data.badges.map(b=>
    `<span class="result-badge">${b.icon} <strong>${b.label}:</strong> ${b.value}</span>`
  ).join('');

  // All predictions breakdown
  const breakdownEl = document.getElementById('predictionsBreakdown');
  if(breakdownEl && allPredictions){
    breakdownEl.innerHTML = '<h4 class="pred-breakdown-title">Semua Prediksi</h4>' +
      Object.entries(allPredictions)
        .sort((a,b) => b[1] - a[1])
        .map(([name, pct]) => {
          const d = wasteData[name];
          if(!d) return '';
          const isTop = name === category;
          return `<div class="pred-row">
            <span class="pred-icon">${d.icon}</span>
            <span class="pred-name" style="color:${isTop ? d.color : ''}">${d.name}</span>
            <div class="pred-bar-bg">
              <div class="pred-bar-fill" style="width:${pct}%;background:${d.color}"></div>
            </div>
            <span class="pred-pct" style="color:${isTop ? d.color : ''}">${pct}%</span>
          </div>`;
        }).join('');
  }

  // Guide
  const guideContent = document.getElementById('guideContent');
  guideContent.innerHTML = `<ul class="guide-steps">${data.guide.map((s,i)=>
    `<li class="guide-step"><span class="guide-step-num">${i+1}</span>${s}</li>`
  ).join('')}</ul>`;

  // Guide accordion toggle
  const guideToggle = document.getElementById('guideToggle');
  const guideArrow = guideToggle.querySelector('.guide-arrow');
  guideToggle.onclick = ()=>{
    guideContent.classList.toggle('open');
    guideArrow.classList.toggle('open');
  };

  // Reference images (placeholders)
  const refGrid = document.getElementById('refImagesGrid');
  refGrid.innerHTML = data.refs.map(label=>`
    <div class="ref-img-card">
      <div class="ref-img-placeholder">
        <span>${data.icon}</span>
        <span>${label}</span>
      </div>
    </div>
  `).join('');

  // Show result
  resultSection.style.display = 'block';
}

// Reset button
document.getElementById('resetBtn').addEventListener('click', resetForm);

// Copy result — FIXED (no more confidenceVal crash)
document.getElementById('copyBtn').addEventListener('click',()=>{
  const cat = document.getElementById('resultCategory').textContent;
  const confEl = document.getElementById('confidenceVal');
  const conf = confEl ? confEl.textContent : '-';
  const desc = document.getElementById('resultDesc').textContent;
  const text = `Hasil Deteksi SampahPedia\nKategori: ${cat}\nKeyakinan: ${conf}\nDeskripsi: ${desc}`;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✅ Tersalin!';
    setTimeout(()=>{ btn.textContent = '📋 Salin Hasil'; }, 2000);
  });
});

// Init step
setStep(1);
