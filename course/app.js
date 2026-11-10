'use strict';
// Innerlab Courses — course catalog and optional interest-registration receiver.
// Set COURSE_API_URL to your deployed Google Apps Script /exec endpoint only after testing.
// Until then, the form safely copies a registration request; it does not collect leads online.
const COURSE_API_URL = '';
const COURSES = [
 {id:'hieu-minh',title:'Hiểu mình, hiểu người',category:'self',categoryName:'KHÁM PHÁ BẢN THÂN',short:'Bắt đầu từ những câu hỏi bên trong để hiểu rõ hơn cách mình suy nghĩ, cảm nhận và kết nối.',audience:'Dành cho người muốn bắt đầu',art:'art-self',symbol:'✦',number:'01',topics:['Nhận diện giá trị và điểm mạnh cá nhân','Khám phá cách mình suy nghĩ và phản ứng','Hiểu sự khác biệt trong giao tiếp','Lên kế hoạch phát triển bản thân phù hợp'],after:'Một điểm khởi đầu để hiểu chính mình rõ hơn.'},
 {id:'tri-tue-cam-xuc',title:'Trí tuệ cảm xúc',category:'self',categoryName:'KHÁM PHÁ BẢN THÂN',short:'Học cách gọi tên cảm xúc, lắng nghe bản thân và xây dựng những kết nối lành mạnh.',audience:'Dành cho hành trình nội tâm',art:'art-soul',symbol:'♡',number:'02',topics:['Nhận diện cảm xúc và nhu cầu bên trong','Hiểu những thói quen phản ứng','Lắng nghe và trao đổi cảm xúc','Xây dựng thói quen chăm sóc bản thân'],after:'Thêm ngôn ngữ để hiểu cảm xúc và các mối quan hệ.'},
 {id:'giao-tiep-tu-tin',title:'Giao tiếp & sự tự tin',category:'skill',categoryName:'KỸ NĂNG SỐNG',short:'Tìm ra tiếng nói của riêng bạn và luyện tập diễn đạt rõ ràng, tự nhiên trong cuộc sống.',audience:'Dành cho người muốn kết nối',art:'art-talk',symbol:'◎',number:'03',topics:['Nhận ra phong cách giao tiếp cá nhân','Lắng nghe chủ động và phản hồi có chủ đích','Diễn đạt suy nghĩ với sự rõ ràng','Thực hành tình huống đời sống thường gặp'],after:'Tự tin hơn trong cách trao đổi và thể hiện ý tưởng.'},
 {id:'hoc-tap-hieu-qua',title:'Học tập & tư duy hiệu quả',category:'skill',categoryName:'KỸ NĂNG SỐNG',short:'Khám phá cách học phù hợp, duy trì sự tập trung và biến kiến thức thành hành động.',audience:'Dành cho người yêu học hỏi',art:'art-learn',symbol:'✳',number:'04',topics:['Tìm hiểu phong cách và động lực học tập','Thiết lập mục tiêu học tập thực tế','Rèn tư duy đặt câu hỏi và ghi nhớ','Xây dựng nhịp học bền vững'],after:'Một cách tiếp cận chủ động hơn với việc học.'},
 {id:'dinh-huong-tuong-lai',title:'Định hướng hành trình tương lai',category:'skill',categoryName:'KỸ NĂNG SỐNG',short:'Kết nối điều mình yêu thích, khả năng và lựa chọn để tìm hướng đi phù hợp hơn.',audience:'Dành cho giai đoạn chuyển mình',art:'art-career',symbol:'↗',number:'05',topics:['Nhận diện điều mình coi trọng','Khám phá thế mạnh và sở thích','Xác định những lựa chọn trước mắt','Xây dựng kế hoạch bước nhỏ để bắt đầu'],after:'Rõ hơn về những lựa chọn bạn muốn theo đuổi.'},
 {id:'ai-ung-dung',title:'AI cho cuộc sống & công việc',category:'ai',categoryName:'AI & CÔNG NGHỆ',short:'Làm quen với AI và học cách sử dụng công cụ thông minh để học tập, sáng tạo và làm việc.',audience:'Dành cho người mới tiếp cận AI',art:'art-ai',symbol:'✧',number:'06',topics:['Hiểu cơ bản về khả năng và giới hạn của AI','Cách đặt câu hỏi để nhận được câu trả lời tốt','Ứng dụng AI trong học tập và công việc','Kiểm chứng thông tin và sử dụng có trách nhiệm'],after:'Tự tin thử nghiệm AI với những công việc thực tế.'}
];
const $=id=>document.getElementById(id);
const encode=text=>String(text).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let activeCategory='all',searchText='',lastFocus=null,toastTimer=null,modalOpen=null;
function renderCourses(){
 const shown=COURSES.filter(c=>(activeCategory==='all'||c.category===activeCategory)&&[c.title,c.short,c.categoryName,c.topics.join(' ')].join(' ').toLocaleLowerCase('vi').includes(searchText));
 $('courseGrid').innerHTML=shown.map(c=>'<article class="course-card"><div class="course-art '+c.art+'"><span class="card-badge">ĐANG GIỚI THIỆU</span><span class="art-orbit" aria-hidden="true"></span><span class="art-bubble" aria-hidden="true"></span><span class="art-symbol" aria-hidden="true">'+encode(c.symbol)+'</span><span class="art-serial">'+encode(c.number)+' / 06</span></div><div class="course-content"><span class="course-category">'+encode(c.categoryName)+'</span><h3>'+encode(c.title)+'</h3><p>'+encode(c.short)+'</p><div class="course-meta"><span>'+encode(c.audience)+'</span><span>Học phí: cập nhật sau</span></div><div class="course-actions"><button type="button" class="course-details" data-details="'+encode(c.id)+'">Xem nội dung ↗</button><button type="button" class="course-register" data-enroll="'+encode(c.id)+'">Đăng ký quan tâm ↗</button></div></div></article>').join('');
 $('emptyState').hidden=shown.length>0;
}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('is-visible'),2600);}
function setFilter(value){activeCategory=value;document.querySelectorAll('.filter').forEach(b=>{const yes=b.dataset.filter===value;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});renderCourses();}
function closeMenu(){const el=$('mobileMenu');el.hidden=true;$('menuToggle').setAttribute('aria-expanded','false');$('menuToggle').setAttribute('aria-label','Mở menu');}
$('menuToggle').addEventListener('click',()=>{const open=$('mobileMenu').hidden;$('mobileMenu').hidden=!open;$('menuToggle').setAttribute('aria-expanded',String(open));$('menuToggle').setAttribute('aria-label',open?'Đóng menu':'Mở menu');});
$('mobileMenu').querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
$('courseSearch').addEventListener('input',e=>{searchText=e.target.value.trim().toLocaleLowerCase('vi');renderCourses();});
$('resetFilters').onclick=()=>{searchText='';$('courseSearch').value='';setFilter('all');};
function openModal(id){
 lastFocus=document.activeElement;modalOpen=id;const box=$(id);box.hidden=false;document.body.style.overflow='hidden';
 const target=box.querySelector('.modal-close');if(target)target.focus();
}
function closeModal(id){const box=$(id);box.hidden=true;modalOpen=null;document.body.style.overflow='';if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus();}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close==='detail'?'detailModal':'enrollModal')));
document.querySelectorAll('.modal-backdrop').forEach(box=>box.addEventListener('mousedown',e=>{if(e.target===box)closeModal(box.id);}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalOpen)closeModal(modalOpen);if(e.key!=='Tab'||!modalOpen)return;const dialog=$(modalOpen);const focusable=Array.from(dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')).filter(el=>el.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
function openDetails(id){
 const c=COURSES.find(c=>c.id===id);if(!c)return;
 $('detailBody').innerHTML='<div class="detail-banner '+c.art+'"><span class="detail-icon" aria-hidden="true">'+encode(c.symbol)+'</span></div><div class="detail-body-copy"><span class="modal-eyebrow">'+encode(c.categoryName)+'</span><h2 id="detailTitle">'+encode(c.title)+'</h2><p>'+encode(c.short)+'</p><h3 class="detail-section-label">NHỮNG NỘI DUNG CÓ THỂ KHÁM PHÁ</h3><ul class="detail-list">'+c.topics.map(t=>'<li>'+encode(t)+'</li>').join('')+'</ul><p><strong>Điều bạn hướng đến:</strong> '+encode(c.after)+'</p><div class="detail-footer"><p>Lịch học và học phí<br><strong>Được công bố trước khi mở lớp</strong></p><button type="button" class="btn btn-ink" data-detail-enroll="'+encode(c.id)+'">Tôi quan tâm khóa này ↗</button></div></div>';
 openModal('detailModal');
}
function openEnroll(id){
 if(modalOpen)closeModal(modalOpen);
 $('enrollForm').reset();$('enrollMessage').textContent='';$('enrollReceipt').hidden=true;
 $('enrollSubmit').textContent=COURSE_API_URL.trim()?'Gửi đăng ký quan tâm ↗':'Sao chép thông tin đăng ký ↗';
 $('enrollCourse').value=id||'';
 openModal('enrollModal');$('enrollName').focus();
}
document.addEventListener('click',e=>{
 const details=e.target.closest('[data-details]');if(details)openDetails(details.dataset.details);
 const enroll=e.target.closest('[data-enroll]');if(enroll)openEnroll(enroll.dataset.enroll);
 const detailEnroll=e.target.closest('[data-detail-enroll]');if(detailEnroll)openEnroll(detailEnroll.dataset.detailEnroll);
});
$('navEnroll').onclick=()=>openEnroll('');
$('mobileEnroll').onclick=()=>{closeMenu();openEnroll('');};
$('footerEnroll').onclick=()=>openEnroll('');
const select=$('enrollCourse');
COURSES.forEach(c=>{const op=document.createElement('option');op.value=c.id;op.textContent=c.title;select.appendChild(op)});
function validPhone(raw){return /^(?:0[35789]\d{8}|\+84[35789]\d{8})$/.test(raw.replace(/[\s().-]/g,''));}
function genCode(){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const arr=new Uint8Array(10);crypto.getRandomValues(arr);return 'IC-'+Array.from(arr,n=>alphabet[n%alphabet.length]).join('').match(/.{1,5}/g).join('-');}
function summary(data){return ['INNERLAB COURSES - ĐĂNG KÝ QUAN TÂM','Mã tham chiếu: '+data.inquiry_code,'Họ và tên: '+data.full_name,'Số điện thoại/Zalo: '+data.contact,'Khóa học: '+data.course_title,'Điều mong đợi: '+(data.note||'Chưa cung cấp'),'Thời gian: '+data.submitted_at,'Tôi đồng ý để Innerlab liên hệ về khóa học trên.'].join('\n');}
function showReceipt(title,message,copyText){
 const el=$('enrollReceipt');el.hidden=false;el.replaceChildren();
 const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=message;el.append(h,p);
 if(copyText){const box=document.createElement('code');box.textContent=copyText;el.append(box);const btn=document.createElement('button');btn.type='button';btn.textContent='Sao chép lại';btn.onclick=()=>copyToClipboard(copyText);el.append(btn);}
}
async function copyToClipboard(content){
 try{await navigator.clipboard.writeText(content);toast('Đã sao chép thông tin.');return true;}
 catch(e){toast('Hãy chọn và sao chép nội dung hiển thị bên dưới.');return false;}
}
$('enrollForm').addEventListener('submit',async e=>{
 e.preventDefault();const form=e.currentTarget;
 const full_name=$('enrollName').value.trim(),contact=$('enrollPhone').value.trim(),course_id=$('enrollCourse').value,note=$('enrollNote').value.trim();
 const error=$('enrollMessage');error.textContent='';
 if(!full_name||!contact||!course_id||!$('enrollConsent').checked){error.textContent='Vui lòng điền họ tên, số điện thoại / Zalo, chọn khóa học và đồng ý để Innerlab liên hệ.';return;}
 if(!validPhone(contact)){error.textContent='Vui lòng nhập số di động Việt Nam hợp lệ (ví dụ: 0912 345 678).';$('enrollPhone').focus();return;}
 const course=COURSES.find(c=>c.id===course_id);if(!course){error.textContent='Khóa học đã chọn không hợp lệ.';return;}
 const data={record_type:'course_inquiry',inquiry_code:genCode(),full_name,contact,course_id,course_title:course.title,note,consent:true,submitted_at:new Date().toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour12:false})+' GMT+7',site_version:'1.0'};
 const btn=$('enrollSubmit');btn.disabled=true;
 try{
   if(!COURSE_API_URL.trim()){
    const text=summary(data);await copyToClipboard(text);
    showReceipt('Thông tin đã chuẩn bị','Trang đang ở chế độ giới thiệu và chưa kết nối nơi nhận đăng ký. Nội dung đã được sao chép nếu trình duyệt cho phép; vui lòng lưu lại để gửi khi Innerlab công bố kênh liên hệ.',text);
    form.reset();return;
   }
   btn.textContent='Đang gửi yêu cầu...';
   await fetch(COURSE_API_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});
   showReceipt('Yêu cầu đã được gửi từ trình duyệt','Hệ thống chưa thể tự xác minh việc Google Sheets đã ghi nhận. Vui lòng lưu mã tham chiếu và chờ Innerlab xác nhận.',summary(data));
   form.reset();
 }catch(err){error.textContent='Không thể gửi yêu cầu. Vui lòng kiểm tra mạng và thử lại.';}
 finally{btn.disabled=false;btn.textContent=COURSE_API_URL.trim()?'Gửi đăng ký quan tâm ↗':'Sao chép thông tin đăng ký ↗';}
});
$('year').textContent=new Date().getFullYear();
renderCourses();
