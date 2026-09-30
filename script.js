const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-toggle');
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menu?.addEventListener('click',()=>{header.classList.toggle('open');menu.setAttribute('aria-expanded',header.classList.contains('open'))});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const counterCards=[...document.querySelectorAll('.operation-card:has(.counter)')];
const animateCounter=(counter,card,onComplete=()=>{})=>{
  const target=Number(counter.dataset.count);
  if(prefersReducedMotion){counter.textContent=target;card.classList.add('is-counted');onComplete();return}
  const start=performance.now();
  const duration=1050;
  const update=now=>{
    const progress=Math.min((now-start)/duration,1);
    const eased=1-Math.pow(1-progress,4);
    counter.textContent=Math.round(target*eased);
    if(progress<1){requestAnimationFrame(update);return}
    counter.textContent=target;
    card.classList.add('is-counted');
    onComplete();
  };
  requestAnimationFrame(update);
};
if(counterCards.length){
  const playCounters=()=>{
    let completeCount=0;
    counterCards.forEach(card=>{
      card.classList.add('is-counter-active');
      card.classList.remove('is-counted');
      const counter=card.querySelector('.counter');
      if(!counter)return;
      counter.textContent='0';
      animateCounter(counter,card,()=>{
        completeCount+=1;
        if(completeCount===counterCards.length&&!prefersReducedMotion)setTimeout(playCounters,5000);
      });
    });
  };
  const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    playCounters();
    counterObserver.unobserve(entry.target);
  }),{threshold:.55});
  counterObserver.observe(counterCards[0]);
}

const logoMarquee=document.querySelector('.client-logos__grid');
if(logoMarquee&&!prefersReducedMotion){
  [...logoMarquee.children].forEach(logo=>{
    const duplicate=logo.cloneNode(true);
    duplicate.setAttribute('aria-hidden','true');
    logoMarquee.append(duplicate);
  });
}

const processSection=document.querySelector('.process');
if(processSection){
  processSection.querySelector('.eyebrow').textContent='QUY TRÌNH THỰC HIỆN';
  processSection.querySelector('h2').innerHTML='TỪ YÊU CẦU<br>ĐẾN SẢN PHẨM.';
  processSection.querySelector('.leadtime b').textContent='5–7 NGÀY';
  processSection.querySelector('.timeline li:nth-child(6) span').innerHTML='KIỂM TRA<br>CHẤT LƯỢNG';
  processSection.querySelector('.process-caption').textContent='Tiến độ có thể thay đổi tùy số lượng, thiết kế và yêu cầu đặc biệt của từng dự án.';
  ['IN ẤN','CẮT VẢI','MAY','KIỂM TRA','ĐÓNG GÓI'].forEach((label,index)=>{processSection.querySelectorAll('.production-strip div')[index].innerHTML=`<span>${label}</span>`});
}

const processVisual=document.querySelector('.process-visual');
const packingPhoto=document.querySelector('.packing-feature__photo');
if(packingPhoto){
  const photos=[...packingPhoto.querySelectorAll('img')];
  const track=document.createElement('div');
  track.className='packing-track';
  photos.forEach(photo=>{photo.hidden=false;track.append(photo)});
  photos.forEach(photo=>{const copy=photo.cloneNode(true);copy.alt='';copy.setAttribute('aria-hidden','true');track.append(copy)});
  packingPhoto.prepend(track);
  const controls=packingPhoto.querySelector('.packing-controls');
  controls.innerHTML='<button type="button" aria-label="Tạm dừng cuộn ảnh">Ⅱ</button>';
  const toggle=controls.querySelector('button');
  const motion=track.animate([{transform:'translateX(0)'},{transform:'translateX(-50%)'}],{duration:30000,iterations:Infinity,easing:'linear'});
  let paused=prefersReducedMotion;
  const updateMotion=()=>{
    if(paused)motion.pause();else motion.play();
    toggle.textContent=paused?'▶':'Ⅱ';
    toggle.setAttribute('aria-label',paused?'Tiếp tục cuộn ảnh':'Tạm dừng cuộn ảnh');
  };
  toggle.addEventListener('click',()=>{paused=!paused;updateMotion()});
  updateMotion();
}
if(processVisual){
  const panels=[
    ['assets/%E1%BA%A2nh%20ChatGPT%2010_39_27%2029%20thg%209%2C%202026.png','Mẫu áo thể thao đen vàng của DNY Sport'],
    ['assets/%E1%BA%A2nh%20ChatGPT%2010_40_21%2029%20thg%209%2C%202026.png','Mẫu áo thể thao vàng của DNY Sport'],
    ['assets/%E1%BA%A2nh%20ChatGPT%2010_50_29%2029%20thg%209%2C%202026.png','Mẫu áo thể thao xanh của DNY Sport'],
    ['assets/%E1%BA%A2nh%20ChatGPT%2010_53_38%2029%20thg%209%2C%202026.png','Mẫu áo thể thao đỏ của DNY Sport'],
    ['assets/%E1%BA%A2nh%20ChatGPT%2012_44_00%2029%20thg%209%2C%202026.png','Mẫu đồng phục thể thao DNY Sport'],
    ['assets/%E1%BA%A2nh%20ChatGPT%2012_42_06%2029%20thg%209%2C%202026.png','Mẫu trang phục thể thao DNY Sport']
  ];
  processVisual.classList.add('process-carousel');
  processVisual.innerHTML=`<div class="process-carousel__slides">${panels.map(([src,label],index)=>`<figure class="process-carousel__slide${index===0?' is-active':''}"><img src="${src}" alt="${label}" loading="lazy"><figcaption>${String(index+1).padStart(2,'0')} / ${label}</figcaption></figure>`).join('')}</div><div class="process-carousel__controls"><button type="button" class="process-carousel__arrow" data-direction="previous" aria-label="Xem mẫu trước">←</button><div class="process-carousel__dots" role="tablist" aria-label="Chọn mẫu áo">${panels.map(([,label],index)=>`<button type="button" role="tab" aria-label="${label}" aria-selected="${index===0}" data-slide="${index}"></button>`).join('')}</div><button type="button" class="process-carousel__arrow" data-direction="next" aria-label="Xem mẫu tiếp theo">→</button></div>`;
  const slides=[...processVisual.querySelectorAll('.process-carousel__slide')];
  const dots=[...processVisual.querySelectorAll('.process-carousel__dots button')];
  let activeSlide=0;
  let sliderTimer;
  const showSlide=index=>{
    activeSlide=(index+slides.length)%slides.length;
    slides.forEach((slide,itemIndex)=>slide.classList.toggle('is-active',itemIndex===activeSlide));
    dots.forEach((dot,itemIndex)=>dot.setAttribute('aria-selected',itemIndex===activeSlide?'true':'false'));
  };
  const startSlider=()=>{clearInterval(sliderTimer);sliderTimer=setInterval(()=>showSlide(activeSlide+1),3000)};
  processVisual.querySelectorAll('.process-carousel__arrow').forEach(button=>button.addEventListener('click',()=>{showSlide(activeSlide+(button.dataset.direction==='next'?1:-1));startSlider()}));
  dots.forEach((dot,index)=>dot.addEventListener('click',()=>{showSlide(index);startSlider()}));
  processVisual.addEventListener('mouseenter',()=>clearInterval(sliderTimer));
  processVisual.addEventListener('mouseleave',startSlider);
  startSlider();
}

const kitGallery=document.querySelector('.kit-gallery');
if(kitGallery){
  const kitNames={
    football:'ÁO BÓNG ĐÁ',
    basketball:'ÁO BÓNG RỔ',
    volleyball:'ÁO BÓNG CHUYỀN',
    baseball:'ÁO BÓNG CHÀY',
    pickleball:'ÁO PICKLEBALL',
    gym:'ÁO GYM – YOGA'
  };
  const kitImages={
    football:['ao-bong-da-dny-ha-noi-khue-van-cac-dny-2607160139-1.jpg','bo-quan-ao-bong-da-dny-xanh-ngoc-chim-lac-dny-2608150143-1.jpg','quan-ao-bong-da-thiet-ke-dny-2510030085-1.jpg','quan-ao-bong-da-warrior-berserker-dny-2603070108-1.jpg'].map(file=>`assets/bóng đá/${file}`),
    basketball:['ao-bong-ro-den-cam-13-dny-br2604200105-1.jpg','ao-jersey-bong-ro-dny-den-hoa-tiet-tho-cam-dny-br2609080117-1.jpg','dong-phuc-bong-ro-dny-br2509300094-2.jpg','quan-ao-bong-ro-thiet-ke-dny-br2510300097-2.jpg'].map(file=>`assets/bóng rổ/${file}`),
    volleyball:['ao-bong-chuyen-thi-dau-dny-vb2507070040-1.jpg','bo-quan-ao-bong-chuyen-dny-xanh-duong-loang-may-dny-vb2609230061-2.jpg','do-bong-chuyen-dny-trang-van-xanh-la-libero-dny-vb2609230064-2.jpg','quan-ao-bong-chuyen-clb-thiet-ke-theo-yeu-cau-dny-vb2504090030-1.jpg'].map(file=>`assets/bóng chuyền/${file}`),
    baseball:['ao-bong-chay-dny-brasil-vang-xanh-dny-bc2606230111-11.jpg','ao-bong-chay-dny-viet-nam-den-do-rong-dny-bc2607300113-3.jpg','ao-bong-chay-dny-viet-nam-trang-kem-vintage-dny-bc2607300116-3.jpg','ao-bong-chay-nam-nu-doc-dao-dny-bc2501100043-6.jpg'].map(file=>`assets/bóng chày/${file}`),
    pickleball:['35.jpg','ao-pickleball-xanh-hong-dny-pb2512020068-1.jpg','dong-phuc-pickleball-dny-pb2510140066-1.jpg','quan-ao-pickleball-thiet-ke-thoi-trang-dny-pb2501140034-6.jpg'].map(file=>`assets/pickleball/${file}`),
    gym:['ao-gym-den-dny-gym2512060077-1.jpg','ao-gym-trang-neon-dny-gym2604100095-1.jpg','ao-polo-pt-dny-trang-phoi-do-dong-phuc-coach-dny-gym2608240108-1.jpg','ao-tap-gym-pt-dny-xanh-duong-vang-dny-gym2607130105-21.jpg'].map(file=>`assets/gym/${file}`)
  };
  const kitButtons=[...document.querySelectorAll('.kit-type')];
  const kitTitle=kitGallery.querySelector('.kit-gallery__head h3 span');
  const closeKitGallery=()=>{
    kitGallery.hidden=true;
    kitButtons.forEach(button=>{button.classList.remove('is-active');button.setAttribute('aria-expanded','false')});
  };
  kitButtons.forEach(button=>button.addEventListener('click',()=>{
    const isCurrent=button.classList.contains('is-active');
    if(isCurrent){closeKitGallery();return}
    kitButtons.forEach(item=>{item.classList.toggle('is-active',item===button);item.setAttribute('aria-expanded',item===button?'true':'false')});
    kitTitle.textContent=kitNames[button.dataset.kit];
    kitGallery.hidden=false;
    kitGallery.querySelectorAll('.kit-gallery__card').forEach((card,index)=>{
      card.style.backgroundImage=`url("${encodeURI(kitImages[button.dataset.kit][index])}")`;
      card.setAttribute('aria-label',`${kitNames[button.dataset.kit]} — mẫu ${index+1}`);
      card.querySelector('span').hidden=true;
    });
  }));
  kitGallery.querySelector('.kit-gallery__close').addEventListener('click',closeKitGallery);
  // Show the football collection by default when visitors reach this section.
  kitButtons.find(button=>button.dataset.kit==='football')?.click();
}

const customerProducts=[
  ['Ảnh ChatGPT 10_40_21 29 thg 9, 2026.png','Maxim','Áo thun đồng phục','Áo thun đồng phục Maxim màu vàng nổi bật, nhận diện Car – Bike rõ ràng, phù hợp đội ngũ dịch vụ di chuyển.'],
  ['Ảnh ChatGPT 10_55_47 29 thg 9, 2026.png','Dragon Hoops','Áo bóng rổ','Áo bóng rổ Dragon Hoops tông đỏ, phối biểu tượng rồng và họa tiết trống đồng, tạo phong cách mạnh mẽ và đậm chất Việt.'],
  ['Ảnh ChatGPT 10_58_20 29 thg 9, 2026.png','DNY Sport / Nghiện Đạp','Áo đạp xe','Áo đạp xe Nghiện Đạp tông đỏ – vàng, khai thác họa tiết trống đồng và bản đồ Việt Nam, mang tinh thần thể thao gắn với bản sắc Việt.'],
  ['Ảnh ChatGPT 11_00_57 29 thg 9, 2026.png','Sacombank – Lộ Bình Hòa','Bộ áo quần thể thao','Bộ đồng phục thể thao Sacombank Lộ Bình Hòa phối xanh – cam, họa tiết graphic mạnh và số áo nổi bật, phù hợp hoạt động đội nhóm.'],
  ['Ảnh ChatGPT 11_07_15 29 thg 9, 2026.png','Vua Cầu Lông','Áo cầu lông','Áo cầu lông Vua Cầu Lông phối đen – xanh mint, họa tiết hình học năng động, mang phong cách hiện đại đúng tinh thần môn cầu lông.'],
  ['Ảnh ChatGPT 11_11_33 29 thg 9, 2026.png','Relove Deep Cross Gaming','Áo Esports','Áo thi đấu Relove Deep Cross Gaming tông đen, thiết kế gaming tối giản với hệ thống logo đội tuyển và nhà tài trợ nổi bật.'],
  ['Ảnh ChatGPT 11_15_37 29 thg 9, 2026.png','Bến Tre Fishing Group','Áo khoác câu cá','Áo khoác Bến Tre Fishing Group tông xanh – trắng, có mũ và họa tiết lưới/cá đặc trưng, phù hợp hoạt động câu cá ngoài trời.'],
  ['Ảnh ChatGPT 11_18_07 29 thg 9, 2026.png','ACE Gym / Personal Trainer','Áo polo thể thao','Áo polo Personal Trainer phối đen – hồng nhạt, đường line ôm thân khỏe khoắn, phù hợp đồng phục huấn luyện viên và phòng gym.'],
  ['Ảnh ChatGPT 11_22_43 29 thg 9, 2026.png','Tyresö','Áo khoác thể thao','Áo khoác Tyresö đen – trắng với graphic minh họa mạnh, bố cục trước sau cá tính và phong cách street-sport nổi bật.'],
  ['Ảnh ChatGPT 12_40_49 29 thg 9, 2026.png','Vietstock','Áo polo Pickleball','Áo polo Vietstock phối trắng – xanh, họa tiết hình học cùng biểu tượng vợt pickleball, phù hợp sự kiện và hoạt động thể thao doanh nghiệp.'],
  ['Ảnh ChatGPT 12_42_06 29 thg 9, 2026.png','KW / Muay Thai','Quần Muay Thai','Quần Muay Thai KW màu đỏ, phom short thi đấu đặc trưng với chữ Thái và patch võ thuật, tạo cảm giác mạnh mẽ trên sàn tập.'],
  ['Ảnh ChatGPT 12_44_00 29 thg 9, 2026.png','K-Metal Works Customs / Kiên Phạm','Quần võ thuật','Quần võ thuật cá nhân hóa Kiên Phạm tông xanh đậm – vàng, họa tiết bông lúa và cờ Việt Nam, nhấn mạnh tinh thần thi đấu cá nhân.']
];
const customerList=document.querySelector('.partner-list');
if(customerList){customerList.innerHTML=[...customerProducts,...customerProducts].map(([file,brand,type,description],index)=>`<article class="customer-product" data-product-index="${index%customerProducts.length}"${index>=customerProducts.length?' aria-hidden="true"':''}><img src="${encodeURI(`assets/KHÁCH HÀNG/${file}`)}" alt="${index>=customerProducts.length?'':description}" loading="lazy"><span><b>${String((index%customerProducts.length)+1).padStart(2,'0')} / ${brand}</b><em>${type}</em><small>${description}</small></span></article>`).join('')}

const imageViewer=document.createElement('dialog');
imageViewer.className='image-viewer';
imageViewer.innerHTML='<button class="image-viewer__close" type="button" aria-label="Đóng trình xem ảnh">×</button><div class="image-viewer__stage"><img draggable="false" alt=""></div><div class="image-viewer__toolbar"><button type="button" data-viewer-action="zoom-out" aria-label="Thu nhỏ">−</button><button type="button" data-viewer-action="reset" aria-label="Đặt lại kích thước">100%</button><button type="button" data-viewer-action="zoom-in" aria-label="Phóng to">+</button></div><div class="image-viewer__caption"></div>';
document.body.append(imageViewer);
const viewerImage=imageViewer.querySelector('img');
const viewerCaption=imageViewer.querySelector('.image-viewer__caption');
let viewerScale=1,viewerX=0,viewerY=0,dragStart=null;
const renderViewer=()=>{viewerImage.style.transform=`translate(${viewerX}px,${viewerY}px) scale(${viewerScale})`;imageViewer.querySelector('[data-viewer-action="reset"]').textContent=`${Math.round(viewerScale*100)}%`};
const setViewerScale=next=>{viewerScale=Math.min(5,Math.max(1,next));renderViewer()};
const openViewer=index=>{const [file,brand,type,description]=customerProducts[index];viewerImage.src=encodeURI(`assets/KHÁCH HÀNG/${file}`);viewerImage.alt=description;viewerCaption.innerHTML=`<b>${brand}</b><span>${type}</span>`;viewerScale=1;viewerX=0;viewerY=0;renderViewer();imageViewer.showModal();document.body.classList.add('is-viewing-image')};
const closeViewer=()=>{imageViewer.close();document.body.classList.remove('is-viewing-image')};
customerList?.addEventListener('click',event=>{const card=event.target.closest('.customer-product');if(card)openViewer(Number(card.dataset.productIndex))});
imageViewer.querySelector('.image-viewer__close').addEventListener('click',closeViewer);
imageViewer.addEventListener('click',event=>{if(event.target===imageViewer)closeViewer()});
imageViewer.querySelector('.image-viewer__toolbar').addEventListener('click',event=>{const action=event.target.dataset.viewerAction;if(action==='zoom-in')setViewerScale(viewerScale+.35);if(action==='zoom-out')setViewerScale(viewerScale-.35);if(action==='reset'){viewerScale=1;viewerX=0;viewerY=0;renderViewer()}});
imageViewer.querySelector('.image-viewer__stage').addEventListener('wheel',event=>{event.preventDefault();setViewerScale(viewerScale+(event.deltaY<0?.22:-.22))},{passive:false});
imageViewer.querySelector('.image-viewer__stage').addEventListener('dblclick',()=>{if(viewerScale===1)setViewerScale(2);else{viewerScale=1;viewerX=0;viewerY=0;renderViewer()}});
imageViewer.querySelector('.image-viewer__stage').addEventListener('pointerdown',event=>{dragStart={x:event.clientX,y:event.clientY,offsetX:viewerX,offsetY:viewerY};event.currentTarget.setPointerCapture(event.pointerId)});
imageViewer.querySelector('.image-viewer__stage').addEventListener('pointermove',event=>{if(!dragStart)return;viewerX=dragStart.offsetX+event.clientX-dragStart.x;viewerY=dragStart.offsetY+event.clientY-dragStart.y;renderViewer()});
imageViewer.querySelector('.image-viewer__stage').addEventListener('pointerup',()=>{dragStart=null});
imageViewer.addEventListener('close',()=>document.body.classList.remove('is-viewing-image'));

const animatedGroups=['.cap-item','.operation-card','.timeline li','.project'];
animatedGroups.forEach(selector=>document.querySelectorAll(selector).forEach((el,index)=>{el.style.transitionDelay=`${Math.min(index%4,3)*85}ms`}));

const sportLinks={
  FOOTBALL:'https://dny.com.vn/ao-bong-da.html',
  BADMINTON:'https://dny.com.vn/ao-cau-long.html',
  PICKLEBALL:'https://dny.com.vn/ao-pickleball.html',
  BASKETBALL:'https://dny.com.vn/ao-bong-ro.html',
  RUNNING:'https://dny.com.vn/ao-chay-bo.html',
  CYCLING:'https://dny.com.vn/ao-cua-ro-xe-dap.html',
  TEAMWEAR:'https://dny.com.vn/phong-cach-football.html'
};
document.querySelectorAll('.sport-types span').forEach(item=>{
  const url=sportLinks[item.textContent.trim()];
  if(!url)return;
  const link=document.createElement('a');
  link.href=url;
  link.textContent=item.textContent;
  link.setAttribute('aria-label',`Xem ${item.textContent.trim()} trên website DNY`);
  item.replaceWith(link);
});

let ticking=false;
const updateScrollMotion=()=>{
  const offset=window.scrollY;
  header.classList.toggle('is-scrolled',offset>24);
  if(!prefersReducedMotion){
    const heroImage=document.querySelector('.hero-image');
    if(heroImage)heroImage.style.transform=`scale(1.035) translateY(${Math.min(offset*.12,58)}px)`;
  }
  ticking=false;
};
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScrollMotion);ticking=true}},{passive:true});
updateScrollMotion();

const contactSection=document.querySelector('.contact');
if(contactSection){
  contactSection.innerHTML=`
    <div class="contact-details reveal is-visible">
      <div class="contact-details__lead">
        <p class="eyebrow">LIÊN HỆ DNY SPORT</p>
        <h2>SẴN SÀNG<span>ĐỒNG HÀNH.</span></h2>
        <p>Trao đổi trực tiếp với DNY để được tư vấn về thiết kế, chất liệu và phương án sản xuất phù hợp cho đội của bạn.</p>
        <div class="contact-details__actions"><a href="tel:0909362079">GỌI 0909 362 079 <b>↗</b></a><a href="mailto:vanphong@dny.com.vn">GỬI EMAIL <b>↗</b></a></div>
      </div>
      <div class="contact-details__company">
        <p class="eyebrow">THÔNG TIN DOANH NGHIỆP</p>
        <h3>CÔNG TY TNHH<br>MAY MẶC ĐẠT NHƯ Ý</h3>
        <dl><div><dt>ĐỊA CHỈ</dt><dd>98/1A2 Đông Hưng Thuận 17, P. Đông Hưng Thuận, TP. Hồ Chí Minh</dd></div><div><dt>MST</dt><dd>0313393486 · Cấp ngày 11/08/2015</dd></div><div><dt>NƠI CẤP</dt><dd>Sở KH &amp; ĐT TP.HCM</dd></div><div><dt>HOTLINE</dt><dd><a href="tel:0909362079">0909 362 079</a></dd></div><div><dt>EMAIL</dt><dd><a href="mailto:vanphong@dny.com.vn">vanphong@dny.com.vn</a></dd></div></dl>
      </div>
      <aside class="contact-details__policies"><p class="eyebrow">CHÍNH SÁCH</p><a href="https://dny.com.vn/thanh-toan.html" target="_blank" rel="noopener">Thanh toán <b>↗</b></a><a href="https://dny.com.vn/van-chuyen.html" target="_blank" rel="noopener">Vận chuyển <b>↗</b></a><a href="https://dny.com.vn/chinh-sach-bao-hanh.html" target="_blank" rel="noopener">Chính sách bảo hành <b>↗</b></a><a href="https://dny.com.vn/chinh-sach-va-quy-dinh-chung.html" target="_blank" rel="noopener">Chính sách &amp; quy định <b>↗</b></a><a href="https://dny.com.vn/bao-mat-thong-tin.html" target="_blank" rel="noopener">Bảo mật thông tin <b>↗</b></a><span><a class="contact-website" href="https://dny.com.vn/" target="_blank" rel="noopener">www.dny.com.vn</a></span></aside>
    </div>`;
}

document.querySelector('.inquiry-form')?.addEventListener('submit',e=>{e.preventDefault();const message=e.currentTarget.querySelector('.form-message');message.textContent='Cảm ơn bạn. DNY đã nhận yêu cầu và sẽ liên hệ sớm nhất.';e.currentTarget.reset()});
