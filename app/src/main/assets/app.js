(()=>{
"use strict";

const QUOTES=[
  "Zorlandığın bir anda kendine kısa bir mola verebilirsin.",
  "Bugün sadece şu anı seçmek yeterli. Yarın kendi yolunu açar.",
  "Derin bir nefes al ve kendine nasıl hissettiğini fark edecek zaman ver.",
  "Ellerini ve zihnini küçük bir yürüyüşle ya da bir bardak suyla meşgul et.",
  "Her içilmeyen dal, kendine verdiğin sessiz bir sözdür.",
  "Bugün işine yarayan küçük bir adımı hatırla.",
  "Sigara içme isteği geldiğinde kısa bir ara verip dikkatini başka bir işe yöneltebilirsin.",
  "Yeni bir rutine alışırken kendine zaman tanı.",
  "Biriktirdiğin parayla kendine küçük bir ödül planlayabilirsin.",
  "Sabah kahveni farklı bir yerde içerek yeni bir rutin deneyebilirsin.",
  "Dumansız geçirdiğin bu saat de ilerlemenin bir parçası.",
  "Zorlandığın anlarda neden başladığını kısa bir cümleyle kendine hatırlat.",
  "Her zamanki sigara molasında kısa bir yürüyüş deneyebilirsin.",
  "Bugün dünden daha özgürsün; çünkü seçim artık senin elinde.",
  "Stresli bir anda neye ihtiyacın olduğunu anlamak için kendine zaman ver.",
  "Küçük adımlar küçük değildir; üst üste binince yeni bir yaşam kurarlar.",
  "Kendini ödüllendirmek için büyük günleri bekleme; bugünkü emeğini takdir et.",
  "Eski bir refleks kapıyı çaldığında açmak zorunda değilsin.",
  "Zaman zaten akıyor; onu kendine çalışır hale getirmek senin elinde.",
  "Bir bardak su içmek veya biraz esnemek, mola vermenin iki basit yolu.",
  "İlerlemeni kendi hızında takip et.",
  "Akşam olduğunda gün içinde sana iyi gelen bir anı hatırla.",
  "Zor bir gün geçirdiysen bir sonraki adımı küçük tutabilirsin.",
  "Yeni rutininde işine yarayan şeyleri fark etmek için kendine zaman ver.",
  "Bugünün sakinliği, gelecekteki kendin için bıraktığın en güzel mirastır.",
  "Dikkatini dağıtan her sağlıklı mola, yeni alışkanlığının temel taşıdır.",
  "Zorlandığında neden başladığını yeniden hatırlayabilirsin.",
  "Bugünkü molanı sana iyi gelen bir şeye ayır."
];

const MILESTONES=[
  {ms:3600000,t:"İlk Saat",d:"60 dakika dumansız."},
  {ms:43200000,t:"İlk Yarım Gün",d:"12 saat dumansız."},
  {ms:86400000,t:"İlk Tam Gün",d:"24 saat dumansız."},
  {ms:259200000,t:"İlk Üç Gün",d:"72 saat dumansız."},
  {ms:604800000,t:"İlk Hafta",d:"7 gün dumansız."},
  {ms:1209600000,t:"İki Hafta",d:"14 gün dumansız."},
  {ms:2592000000,t:"İlk Ay",d:"30 gün dumansız."},
  {ms:7776000000,t:"Üç Ay",d:"90 gün dumansız."},
  {ms:15552000000,t:"Yarım Yıl",d:"180 gün dumansız."},
  {ms:31536000000,t:"Bir Yıl",d:"365 gün dumansız."}
];

const HEALTH_STAGES=[
  {ms:20*60000,t:"Kalp atış hızı ve kan basıncı düşmeye başlar",d:"Son sigaradan dakikalar sonra nabız ve damar yükü normale doğru inmeye başlar.",span:"20 dk"},
  {ms:2*3600000,t:"Uç noktalarda kan dolaşımı iyileşmeye başlar",d:"El ve ayaklara giden kan akışı rahatlar; nikotin kaynaklı nabız sıçramaları yatışır.",span:"2 saat"},
  {ms:8*3600000,t:"Kandaki oksijen seviyesi normale döner",d:"Kandaki karbonmonoksit ve nikotin hızla azalarak oksijen taşınması rahatlar.",span:"8 saat"},
  {ms:12*3600000,t:"Karbonmonoksit düzeyi normale döner",d:"Kandaki karbonmonoksit sigara içmeyen birinin düzeyine iner; kalp daha rahat çalışır.",span:"12 saat"},
  {ms:24*3600000,t:"Kandaki nikotin sıfıra yaklaşır",d:"Akciğerler mukus ve kalıntıları temizlemeye başlar; akut kalp krizi riski düşmeye yönelir.",span:"24 saat"},
  {ms:48*3600000,t:"Nikotin atılır, tat ve koku duyusu güçlenir",d:"Vücuttaki nikotin tamamen temizlenir; sinir uçları yenilenmeye başlar, tat ve koku belirginleşir.",span:"48 saat"},
  {ms:72*3600000,t:"Bronşlar gevşer, nefes almak kolaylaşır",d:"Solunum yolları rahatlamaya başlar, nefes alışı açılır ve enerji düzeyi yükselmeye yönelir.",span:"72 saat"},
  {ms:7*86400000,t:"Akciğer temizleyici yapıları (silya) toparlanır",d:"Yoğun fiziksel yoksunluk gerilerken hava yollarındaki silya yapıları yeniden aktifleşir.",span:"1 hafta"},
  {ms:14*86400000,t:"Kan dolaşımı belirgin biçimde iyileşir",d:"Yürüyüş ve günlük fiziksel efor kolaylaşır; damar dolaşımı güçlenir.",span:"2 hafta"},
  {ms:30*86400000,t:"Öksürük ve sinüs tıkanıklığı azalmaya başlar",d:"Silya yapıları mukusu daha iyi temizler; yorgunluk ve akciğer enfeksiyonu riski düşer.",span:"1 ay"},
  {ms:90*86400000,t:"Akciğer fonksiyonları belirgin düzeyde artar",d:"Dolaşım ve solunum kapasitesi güçlenir; kalp krizi riski düşmeye başlar.",span:"3 ay"},
  {ms:180*86400000,t:"Solunum yolları daha sakin ve dirençli çalışır",d:"Günlük nefes konforu belirginleşir; efor sonrası toparlanma süresi kısalır.",span:"6 ay"},
  {ms:270*86400000,t:"Öksürük, hırıltı ve nefes darlığı belirgin azalır",d:"Akciğerlerin kendini temizleme kapasitesi toparlanır, solunum kapasitesi güçlenir.",span:"9 ay"},
  {ms:365*86400000,t:"Koroner kalp hastalığı ek riski yarıya iner",d:"Sigara içmeye devam eden birine kıyasla koroner kalp hastalığı ve kalp krizi riski yarıya düşer.",span:"1 yıl"},
  {ms:2*365*86400000,t:"Kalp krizi riski belirgin biçimde geriler",d:"Kardiyovasküler sistem üzerindeki uzun dönem yük ve damar sertleşmesi hızı azalır.",span:"2 yıl"},
  {ms:5*365*86400000,t:"İnme ve çeşitli kanser riskleri hızla düşer",d:"Ağız, boğaz, yemek borusu ve mesane kanseri riskleri yarıya iner; inme riski sigara içmeyen düzeye yaklaşır.",span:"5 yıl"},
  {ms:10*365*86400000,t:"Akciğer kanserinden ölüm riski yarıya iner",d:"Böbrek ve pankreas kanseri riskleri de belirgin biçimde azalmaya devam eder.",span:"10 yıl"},
  {ms:15*365*86400000,t:"Koroner kalp hastalığı riski normale döner",d:"Koroner kalp hastalığı riski hiç sigara içmemiş birinin düzeyine iner.",span:"15 yıl"},
  {ms:20*365*86400000,t:"Kanser riskleri hiç içmemiş düzeye yaklaşır",d:"Ağız, boğaz, gırtlak ve pankreas kanseri riskleri hiç sigara içmemiş düzeye yaklaşır; rahim ağzı kanseri ek riski yarıya iner.",span:"20 yıl"}
];

const LS_KEY="nefes_state_v1";
const LS_REM="nefes_rem_v1";
const DEFAULT_REMINDER_INTERVAL=120;
const $=id=>document.getElementById(id);

const DEFAULTS={
  setupDone:false,
  quitAt:"",
  cigsPerDay:15,
  packSize:20,
  packPrice:85,
  minPerCig:5,
  cupGoal:8,
  waterByDate:{}
};

let state=loadState();
let currentTab="bugun";
let sigaraStepsOpen=false;
let sigaraHealthOpen=false;
let lastDateKey=localDateKey();
let lastMinute=Math.floor(Date.now()/60000);

function localDateKey(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function toDatetimeLocal(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0"),
        hh=String(d.getHours()).padStart(2,"0"),mm=String(d.getMinutes()).padStart(2,"0");
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

function parseNum(v){
  if(typeof v==="number")return Number.isFinite(v)?v:NaN;
  const s=String(v==null?"":v).trim().replace(/\s+/g,"").replace(",",".");
  if(!s)return NaN;
  const n=Number(s);
  return Number.isFinite(n)?n:NaN;
}

function hasBridge(){return typeof window.Nefes==="object"&&window.Nefes!==null}

function loadState(){
  let raw="";
  try{
    raw=hasBridge()&&typeof window.Nefes.load==="function"?String(window.Nefes.load()||""):(localStorage.getItem(LS_KEY)||"");
  }catch(_){raw=""}
  if(!raw)return {...DEFAULTS,waterByDate:{}};
  try{
    const p=JSON.parse(raw);
    if(!p||typeof p!=="object")return {...DEFAULTS,waterByDate:{}};
    const goal=Math.min(20,Math.max(1,Math.round(parseNum(p.cupGoal)||8)));
    const w=(p.waterByDate&&typeof p.waterByDate==="object")?p.waterByDate:{};
    const cleanW={};
    for(const k of Object.keys(w)){
      if(/^\d{4}-\d{2}-\d{2}$/.test(k)){
        const c=Math.max(0,Math.floor(parseNum(w[k])||0));
        if(c>0)cleanW[k]=c;
      }
    }
    const quitMs=typeof p.quitAt==="string"?Date.parse(p.quitAt):NaN;
    const qOk=Number.isFinite(quitMs);
    return {
      setupDone:Boolean(p.setupDone&&qOk),
      quitAt:qOk?new Date(quitMs).toISOString():"",
      cigsPerDay:parseNum(p.cigsPerDay)>0?parseNum(p.cigsPerDay):15,
      packSize:parseNum(p.packSize)>=1?Math.round(parseNum(p.packSize)):20,
      packPrice:parseNum(p.packPrice)>=0?parseNum(p.packPrice):85,
      minPerCig:parseNum(p.minPerCig)>=0?parseNum(p.minPerCig):5,
      cupGoal:goal,
      waterByDate:cleanW
    };
  }catch(_){
    return {...DEFAULTS,waterByDate:{}};
  }
}

function saveState(){
  const json=JSON.stringify(state);
  try{
    if(hasBridge()&&typeof window.Nefes.save==="function")window.Nefes.save(json);
    else localStorage.setItem(LS_KEY,json);
  }catch(_){}
}

const TR_MONTHS=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const TR_WEEKDAYS_SHORT=["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"];

function pad2(n){return String(n).padStart(2,"0")}

function formatDateTR(d=new Date()){
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${TR_WEEKDAYS_SHORT[d.getDay()]}`;
}

function formatDateTimeTR(d=new Date()){
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function addYearsMonthsClamped(base,yearsToAdd,monthsToAdd){
  const targetMonthIndex=base.getMonth()+yearsToAdd*12+monthsToAdd;
  const targetYear=base.getFullYear()+Math.floor(targetMonthIndex/12);
  const targetMonth=((targetMonthIndex%12)+12)%12;
  const maxDay=new Date(targetYear,targetMonth+1,0).getDate();
  const day=Math.min(base.getDate(),maxDay);
  return new Date(targetYear,targetMonth,day,base.getHours(),base.getMinutes(),base.getSeconds(),base.getMilliseconds());
}

function calcElapsedParts(quitMs,nowMs){
  if(!Number.isFinite(quitMs)||!Number.isFinite(nowMs)||nowMs<=quitMs){
    return {years:0,months:0,weeks:0,days:0,hours:0,minutes:0,seconds:0};
  }
  const qDate=new Date(quitMs);
  const nDate=new Date(nowMs);
  let totalMonths=(nDate.getFullYear()-qDate.getFullYear())*12+(nDate.getMonth()-qDate.getMonth());
  if(totalMonths<0)totalMonths=0;
  let anchor=addYearsMonthsClamped(qDate,0,totalMonths);
  if(anchor.getTime()>nowMs&&totalMonths>0){
    totalMonths--;
    anchor=addYearsMonthsClamped(qDate,0,totalMonths);
  }
  const years=Math.floor(totalMonths/12);
  const months=totalMonths%12;
  const remMs=Math.max(0,nowMs-anchor.getTime());
  const totalSecs=Math.floor(remMs/1000);
  const daysTotal=Math.floor(totalSecs/86400);
  const weeks=Math.floor(daysTotal/7);
  const days=daysTotal%7;
  const hours=Math.floor((totalSecs%86400)/3600);
  const minutes=Math.floor((totalSecs%3600)/60);
  const seconds=totalSecs%60;
  return {years,months,weeks,days,hours,minutes,seconds};
}

function getNextMilestone(el){
  const total=MILESTONES.length;
  let doneCount=0;
  for(const m of MILESTONES){
    if(el>=m.ms)doneCount++;
  }
  const next=MILESTONES.find(m=>el<m.ms)||null;
  const pct=next?Math.min(99,Math.floor((el/next.ms)*100)):100;
  return {doneCount,total,next,pct};
}

function calcHealthProgress(el){
  const total=HEALTH_STAGES.length;
  if(el===null||el<=0){
    return {pct:0,doneCount:0,total,next:HEALTH_STAGES[0]||null};
  }
  let sum=0;
  let doneCount=0;
  let next=null;
  for(const stage of HEALTH_STAGES){
    const ratio=Math.min(1,el/stage.ms);
    sum+=ratio;
    if(el>=stage.ms)doneCount++;
    else if(!next)next=stage;
  }
  const pct=next?Math.min(99,Math.round((sum/total)*100)):100;
  return {pct,doneCount,total,next};
}

function getHealthPreviewStages(el){
  const idx=HEALTH_STAGES.findIndex(s=>el<s.ms);
  const start=idx===-1
    ?Math.max(0,HEALTH_STAGES.length-3)
    :Math.min(Math.max(0,idx-1),Math.max(0,HEALTH_STAGES.length-3));
  return HEALTH_STAGES.slice(start,start+3);
}

function buildHealthStagesHtml(stages,el){
  return stages.map(stage=>{
    const done=el>=stage.ms;
    const pct=done?100:Math.min(99,Math.floor((el/stage.ms)*100));
    const tag=done?"Tamamlandı":`${stage.span} · %${pct}`;
    return `<div class="health-stage${done?" done":""}">
      <div class="health-stage-top">
        <span class="health-mini-dot" aria-hidden="true">${done?"✓":"•"}</span>
        <span class="health-mini-title">${stage.t}</span>
        <span class="health-mini-time">${tag}</span>
      </div>
      <p class="health-stage-desc">${stage.d}</p>
      <div class="health-stage-prog"><div style="width:${pct}%"></div></div>
    </div>`;
  }).join("");
}

function buildMilestonesHtml(el){
  return MILESTONES.map(m=>{
    const done=el>=m.ms;
    const pct=done?100:Math.min(99,Math.floor((el/m.ms)*100));
    const rem=done?"Tamamlandı":`Kalan: ${formatRemaining(m.ms-el)}`;
    return `<article class="ms-item${done?" done":""}">
      <div class="ms-badge" aria-hidden="true">${done?"✓":"•"}</div>
      <div class="ms-body">
        <div class="ms-top"><span class="ms-name">${m.t}</span><span class="ms-tag">${rem}</span></div>
        <p class="ms-desc">${done?"":"Hedef · "}${m.d}</p>
        <div class="ms-prog"><div style="width:${pct}%"></div></div>
      </div>
    </article>`;
  }).join("");
}

function syncSigaraStepsToggle(){
  const body=$("sig-steps-collapse"),btn=$("btn-sigara-steps");
  if(!body||!btn)return;
  body.hidden=!sigaraStepsOpen;
  btn.setAttribute("aria-expanded",sigaraStepsOpen?"true":"false");
  btn.textContent=sigaraStepsOpen?"Adımları Gizle ▴":"Tüm Adımlar ▾";
}

function syncSigaraHealthToggle(){
  const body=$("sig-health-collapse"),btn=$("btn-sigara-health"),preview=$("sig-health-preview");
  if(!body||!btn)return;
  body.hidden=!sigaraHealthOpen;
  if(preview)preview.hidden=sigaraHealthOpen;
  btn.setAttribute("aria-expanded",sigaraHealthOpen?"true":"false");
  btn.textContent=sigaraHealthOpen?"Sağlık Aşamalarını Gizle ▴":`Tüm Sağlık Aşamalarını Gör (${HEALTH_STAGES.length}) ▾`;
}

function formatMoney(n){
  try{return "₺"+n.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})}
  catch(_){return "₺"+n.toFixed(2).replace(".",",")}
}

function formatMins(m){
  const tot=Math.floor(m);
  if(tot<60)return `${tot} dk`;
  const h=Math.floor(tot/60),r=tot%60;
  if(h<24)return r?`${h} sa ${r} dk`:`${h} sa`;
  const d=Math.floor(h/24),rh=h%24;
  return rh?`${d} gün ${rh} sa`:`${d} gün`;
}

function formatRemaining(ms){
  if(!Number.isFinite(ms)||ms<=0)return "0 dk";
  if(ms<60000)return "<1 dk";
  const tot=Math.floor(ms/60000);
  if(tot<60)return `${tot} dk`;
  const h=Math.floor(tot/60),r=tot%60;
  if(h<24)return r?`${h} sa ${r} dk`:`${h} sa`;
  const d=Math.floor(h/24),rh=h%24;
  if(d<365)return rh?`${d} gün ${rh} sa`:`${d} gün`;
  const y=Math.floor(d/365);
  const rm=Math.min(11,Math.floor((d%365)/30));
  return rm?`${y} yıl ${rm} ay`:`${y} yıl`;
}

function dayIndexFromKey(k){
  const [y,m,d]=k.split("-").map(Number);
  return Math.floor(Date.UTC(y,m-1,d)/86400000);
}

function renderQuote(key){
  const idx=((dayIndexFromKey(key)%QUOTES.length)+QUOTES.length)%QUOTES.length;
  $("quote-text").textContent="“"+QUOTES[idx]+"”";
}

function getElapsed(){
  if(!state.setupDone||!state.quitAt)return null;
  const q=Date.parse(state.quitAt);
  if(Number.isNaN(q))return null;
  return Math.max(0,Date.now()-q);
}

function renderHeroAndStats(){
  const now=new Date();
  $("today-date").textContent=formatDateTR(now);
  const el=getElapsed();
  const hb=$("hero-body");
  if(el===null){
    $("fresh-card").hidden=false;
    $("stats-wrap").hidden=true;
    hb.innerHTML=`<div class="hero-kicker">Sigaradan Kurtulma Takibi</div><h1 class="hero-title">Sigaradan Kurtuldum</h1><p class="hero-sub">Kurtulma zamanını kaydet; sigarasız geçen süreni, tasarrufunu ve sürecini anlık takip et.</p>`;
    return;
  }
  $("fresh-card").hidden=true;
  $("stats-wrap").hidden=false;
  hb.innerHTML=`<div class="hero-kicker">Sigarasız Geçen Süre</div><div class="timer-row"><span class="timer-big" id="timer-days"></span><span class="timer-hms" id="timer-hms"></span></div><p class="hero-sub">Kurtulma: ${formatDateTimeTR(new Date(state.quitAt))}</p>`;
  renderTimer(el);
  renderStats(el);
}

function renderTimer(el){
  const daysEl=$("timer-days"),timeEl=$("timer-hms");
  if(el===null||!daysEl||!timeEl)return;
  const sec=Math.floor(el/1000);
  const days=Math.floor(sec/86400);
  const hrs=String(Math.floor((sec%86400)/3600)).padStart(2,"0");
  const mins=String(Math.floor((sec%3600)/60)).padStart(2,"0");
  const secs=String(sec%60).padStart(2,"0");
  const daysText=`${days} gün`;
  if(daysEl.textContent!==daysText)daysEl.textContent=daysText;
  timeEl.textContent=`${hrs}:${mins}:${secs}`;
}

function renderStats(el){
  if(el===null)return;
  const skipped=(el/86400000)*state.cigsPerDay;
  const cash=(skipped/state.packSize)*state.packPrice;
  const minsSaved=skipped*state.minPerCig;

  $("val-cash").textContent=formatMoney(cash);
  $("val-cigs").textContent=Math.floor(skipped).toLocaleString("tr-TR");
  $("val-time").textContent=formatMins(minsSaved);

  const ms=getNextMilestone(el);
  if(ms.next){
    $("dash-next-lbl").textContent=`Sıradaki eşik: ${ms.next.t} (${formatRemaining(ms.next.ms-el)} kaldı)`;
  }else{
    $("dash-next-lbl").textContent="Tüm süreç eşikleri tamamlandı";
  }
  $("dash-next-pct").textContent=`%${ms.pct}`;
  $("dash-next-bar").style.width=ms.pct+"%";
}

function renderSigaraTimer(el){
  if(el===null||!state.quitAt)return;
  const qMs=Date.parse(state.quitAt);
  if(Number.isNaN(qMs))return;
  const p=calcElapsedParts(qMs,Date.now());
  $("sig-yr").textContent=String(p.years);
  $("sig-mo").textContent=String(p.months);
  $("sig-wk").textContent=String(p.weeks);
  $("sig-dy").textContent=String(p.days);
  $("sig-hr").textContent=String(p.hours).padStart(2,"0");
  $("sig-mn").textContent=String(p.minutes).padStart(2,"0");
  $("sig-sc").textContent=String(p.seconds).padStart(2,"0");
  let totalDays;
  try{totalDays=(el/86400000).toLocaleString("tr-TR",{minimumFractionDigits:1,maximumFractionDigits:1})}
  catch(_){totalDays=(el/86400000).toFixed(1).replace(".",",")}
  $("sig-total-days").textContent=`${totalDays} gün`;
}

function renderSigara(){
  const el=getElapsed();
  const empty=$("sigara-empty"),content=$("sigara-content");
  if(el===null){
    empty.hidden=false;
    content.hidden=true;
    return;
  }
  empty.hidden=true;
  content.hidden=false;
  renderSigaraTimer(el);

  $("sig-quit-date").textContent=`Kurtulma tarihi: ${formatDateTimeTR(new Date(state.quitAt))}`;

  const skipped=(el/86400000)*state.cigsPerDay;
  const packs=skipped/state.packSize;
  const cash=packs*state.packPrice;
  const dailyCash=(state.cigsPerDay/state.packSize)*state.packPrice;
  const minsSaved=skipped*state.minPerCig;
  const dailyMins=state.cigsPerDay*state.minPerCig;

  $("sig-cigs").textContent=`${Math.floor(skipped).toLocaleString("tr-TR")} dal`;
  $("sig-packs").textContent=`${packs.toLocaleString("tr-TR",{minimumFractionDigits:1,maximumFractionDigits:1})} paket`;
  $("sig-cash").textContent=formatMoney(cash);
  $("sig-daily-cash").textContent=`Günde ${formatMoney(dailyCash)}`;
  $("sig-time").textContent=formatMins(minsSaved);
  $("sig-daily-time").textContent=`Günde ${formatMins(dailyMins)}`;
  $("sig-daily-cigs").textContent=`${state.cigsPerDay.toLocaleString("tr-TR",{maximumFractionDigits:1})} dal / gün`;
  $("sig-pack-info").textContent=`${state.packSize} dal · ${formatMoney(state.packPrice)}`;

  $("sig-proj-month").textContent=formatMoney(dailyCash*30);
  $("sig-proj-6m").textContent=formatMoney(dailyCash*180);
  $("sig-proj-year").textContent=formatMoney(dailyCash*365);

  const health=calcHealthProgress(el);
  const fillHeight=(health.pct/100)*104;
  const fillY=129-fillHeight;
  $("sig-lungs-fill").setAttribute("y",fillY.toFixed(2));
  $("sig-lungs-fill").setAttribute("height",fillHeight.toFixed(2));
  $("sig-lungs-line").setAttribute("y1",fillY.toFixed(2));
  $("sig-lungs-line").setAttribute("y2",fillY.toFixed(2));
  $("sig-lungs-line").setAttribute("opacity",health.pct>0&&health.pct<100?"0.65":"0");
  $("sig-lungs-pct").textContent=`%${health.pct}`;
  $("sig-health-count").textContent=`${health.doneCount} / ${health.total} aşama`;
  $("sig-lungs-status").textContent=health.next
    ?`Sıradaki: ${health.next.t} (${formatRemaining(health.next.ms-el)} kaldı)`
    :"20 yıllık temel iyileşme aşamalarının tamamı tamamlandı.";

  $("sig-health-preview").innerHTML=buildHealthStagesHtml(getHealthPreviewStages(el),el);
  $("sig-health-all").innerHTML=buildHealthStagesHtml(HEALTH_STAGES,el);
  syncSigaraHealthToggle();

  const ms=getNextMilestone(el);
  const msPct=Math.round((ms.doneCount/ms.total)*100);
  $("sig-ms-count").textContent=`${ms.doneCount} / ${ms.total} eşik`;
  $("sig-ms-pct").textContent=`%${msPct}`;
  $("sig-ms-bar").style.width=msPct+"%";
  const box=$("sig-next-ms-box");
  if(ms.next){
    box.textContent=`Sıradaki eşik: ${ms.next.t} (${ms.next.d}) — Kalan: ${formatRemaining(ms.next.ms-el)}`;
  }else{
    box.textContent="Tüm davranışsal süreç eşikleri tamamlandı. Harika bir istikrar!";
  }

  $("sig-ms-list").innerHTML=buildMilestonesHtml(el);
  syncSigaraStepsToggle();
}

function renderWater(){
  const key=localDateKey();
  const count=state.waterByDate[key]||0;
  const goal=state.cupGoal;
  const pct=Math.min(100,Math.round((count/goal)*100));
  const txt=`${count} / ${goal} bardak`;

  $("dash-water-txt").textContent=txt;
  $("dash-water-pct").textContent=`%${pct}`;
  $("dash-water-bar").style.width=pct+"%";
  $("btn-dash-undo-water").disabled=count<=0;

  $("water-date-lbl").textContent=formatDateTR();
  $("water-main-txt").textContent=txt;
  $("water-main-pct").textContent=`%${pct}`;
  $("water-main-bar").style.width=pct+"%";
  $("btn-undo-water").disabled=count<=0;
  $("inp-cup-goal").value=goal;

  const grid=$("cups-grid");
  grid.innerHTML="";
  for(let i=1;i<=goal;i++){
    const d=document.createElement("div");
    d.className="cup-dot"+(i<=count?" filled":"");
    d.textContent=i<=count?"✓":"";
    grid.appendChild(d);
  }
}

function addWater(delta){
  const key=localDateKey();
  const cur=state.waterByDate[key]||0;
  const next=Math.max(0,cur+delta);
  if(next===0)delete state.waterByDate[key];
  else state.waterByDate[key]=next;
  saveState();
  renderWater();
}

function renderJourney(){
  const el=getElapsed();
  const empty=$("journey-empty"),list=$("ms-list");
  if(el===null){
    empty.hidden=false;
    list.innerHTML="";
    return;
  }
  empty.hidden=true;
  list.innerHTML=buildMilestonesHtml(el);
}

function daysInMonth(year,monthIndex){
  return new Date(year,monthIndex+1,0).getDate();
}

function formatQuitInputDisplay(year,month,day,hour,min){
  return `${pad2(day)}.${pad2(month+1)}.${year} ${pad2(hour)}:${pad2(min)}`;
}

function formatQuitIsoLocal(year,month,day,hour,min){
  return `${year}-${pad2(month+1)}-${pad2(day)}T${pad2(hour)}:${pad2(min)}`;
}

function parseQuitIsoLocal(val){
  if(typeof val!=="string")return null;
  const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(val.trim());
  if(!m)return null;
  const year=parseInt(m[1],10),month=parseInt(m[2],10)-1,day=parseInt(m[3],10),hour=parseInt(m[4],10),min=parseInt(m[5],10);
  if(month<0||month>11||hour<0||hour>23||min<0||min>59)return null;
  if(day<1||day>daysInMonth(year,month))return null;
  const d=new Date(year,month,day,hour,min,0,0);
  if(d.getFullYear()!==year||d.getMonth()!==month||d.getDate()!==day||d.getHours()!==hour||d.getMinutes()!==min)return null;
  return {year,month,day,hour,min,ms:d.getTime()};
}

function setQuitPickerDate(prefix,d){
  const el=$(`${prefix}-quit`);
  const year=d.getFullYear(),month=d.getMonth(),day=d.getDate(),hour=d.getHours(),min=d.getMinutes();
  el.dataset.value=formatQuitIsoLocal(year,month,day,hour,min);
  const txt=el.querySelector(".dt-input-text");
  if(txt)txt.textContent=formatQuitInputDisplay(year,month,day,hour,min);
}

function clearQuitPickerDate(prefix){
  const el=$(`${prefix}-quit`);
  el.dataset.value="";
  const txt=el.querySelector(".dt-input-text");
  if(txt)txt.textContent="Tarih ve saat seç";
}

function readQuitPickerMs(prefix){
  const parsed=parseQuitIsoLocal($(`${prefix}-quit`).dataset.value||"");
  return parsed?parsed.ms:NaN;
}

const TR_MONTHS_SHORT=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const DTP_ITEM_H=44;
const dtpState={
  prefix:null,
  year:2026,
  month:0,
  day:1,
  hour:0,
  min:0,
  minYear:1900,
  maxYear:2100
};

function updateWheelSelection(wheelEl,selectedIdx){
  const items=wheelEl.querySelectorAll(".dtp-wheel-item");
  items.forEach((item,idx)=>{
    const sel=idx===selectedIdx;
    item.classList.toggle("is-selected",sel);
    item.setAttribute("aria-selected",String(sel));
  });
}

function scrollWheelToIndex(wheelEl,idx,smooth){
  const target=Math.max(0,idx)*DTP_ITEM_H;
  wheelEl._dtpLock=true;
  clearTimeout(wheelEl._dtpLockTimer);
  if(smooth&&typeof wheelEl.scrollTo==="function"){
    wheelEl.scrollTo({top:target,behavior:"smooth"});
  }else{
    wheelEl.scrollTop=target;
  }
  wheelEl._dtpLockTimer=setTimeout(()=>{wheelEl._dtpLock=false},smooth?280:60);
}

function buildWheel(wheelEl,labels,selectedIdx,onSelect){
  wheelEl.innerHTML="";
  const topSp=document.createElement("div");
  topSp.className="dtp-wheel-spacer";
  wheelEl.appendChild(topSp);
  labels.forEach((lbl,idx)=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="dtp-wheel-item"+(idx===selectedIdx?" is-selected":"");
    btn.setAttribute("role","option");
    btn.setAttribute("aria-selected",String(idx===selectedIdx));
    btn.textContent=lbl;
    btn.addEventListener("click",()=>{
      updateWheelSelection(wheelEl,idx);
      scrollWheelToIndex(wheelEl,idx,true);
      onSelect(idx);
    });
    wheelEl.appendChild(btn);
  });
  const botSp=document.createElement("div");
  botSp.className="dtp-wheel-spacer";
  wheelEl.appendChild(botSp);
  wheelEl._dtpCount=labels.length;
  wheelEl._dtpOnSelect=onSelect;
  if(!wheelEl._dtpBound){
    wheelEl._dtpBound=true;
    let rafId=0;
    const commitScroll=()=>{
      if(wheelEl._dtpLock)return;
      const count=wheelEl._dtpCount||0;
      if(!count)return;
      const idx=Math.max(0,Math.min(count-1,Math.round(wheelEl.scrollTop/DTP_ITEM_H)));
      updateWheelSelection(wheelEl,idx);
      if(typeof wheelEl._dtpOnSelect==="function")wheelEl._dtpOnSelect(idx);
    };
    wheelEl.addEventListener("scroll",()=>{
      if(wheelEl._dtpLock)return;
      cancelAnimationFrame(rafId);
      rafId=requestAnimationFrame(commitScroll);
    },{passive:true});
  }
  scrollWheelToIndex(wheelEl,selectedIdx,false);
}

function syncDayWheel(){
  const maxDay=daysInMonth(dtpState.year,dtpState.month);
  if(dtpState.day>maxDay)dtpState.day=maxDay;
  const dayLabels=[];
  for(let d=1;d<=maxDay;d++)dayLabels.push(String(d));
  buildWheel($("dtp-wheel-day"),dayLabels,dtpState.day-1,idx=>{
    dtpState.day=idx+1;
  });
}

function renderDtpWheels(){
  dtpState.minYear=Math.min(1900,dtpState.year);
  dtpState.maxYear=Math.max(2100,dtpState.year);
  const years=[];
  for(let y=dtpState.minYear;y<=dtpState.maxYear;y++)years.push(String(y));
  const hours=[];
  for(let h=0;h<24;h++)hours.push(pad2(h));
  const mins=[];
  for(let m=0;m<60;m++)mins.push(pad2(m));

  buildWheel($("dtp-wheel-month"),TR_MONTHS_SHORT,dtpState.month,idx=>{
    if(dtpState.month!==idx){
      dtpState.month=idx;
      syncDayWheel();
    }
  });
  syncDayWheel();
  buildWheel($("dtp-wheel-year"),years,dtpState.year-dtpState.minYear,idx=>{
    const nextY=dtpState.minYear+idx;
    if(dtpState.year!==nextY){
      dtpState.year=nextY;
      syncDayWheel();
    }
  });
  buildWheel($("dtp-wheel-hour"),hours,dtpState.hour,idx=>{
    dtpState.hour=idx;
  });
  buildWheel($("dtp-wheel-min"),mins,dtpState.min,idx=>{
    dtpState.min=idx;
  });
}

function openDateTimePicker(prefix){
  dtpState.prefix=prefix;
  const parsed=parseQuitIsoLocal($(`${prefix}-quit`).dataset.value||"");
  const d=parsed?new Date(parsed.ms):new Date();
  dtpState.year=d.getFullYear();
  dtpState.month=d.getMonth();
  dtpState.day=d.getDate();
  dtpState.hour=d.getHours();
  dtpState.min=d.getMinutes();
  $("dlg-dt-picker").showModal();
  renderDtpWheels();
}

$("s-quit").addEventListener("click",()=>openDateTimePicker("s"));
$("d-quit").addEventListener("click",()=>openDateTimePicker("d"));
$("dtp-clear").addEventListener("click",()=>{
  if(dtpState.prefix)clearQuitPickerDate(dtpState.prefix);
  $("dlg-dt-picker").close();
});
$("dtp-cancel").addEventListener("click",()=>$("dlg-dt-picker").close());
$("dlg-dt-picker").addEventListener("click",e=>{if(e.target===$("dlg-dt-picker"))$("dlg-dt-picker").close()});
$("dtp-ok").addEventListener("click",()=>{
  if(dtpState.prefix){
    const maxDay=daysInMonth(dtpState.year,dtpState.month);
    const day=Math.min(dtpState.day,maxDay);
    const d=new Date(dtpState.year,dtpState.month,day,dtpState.hour,dtpState.min,0,0);
    setQuitPickerDate(dtpState.prefix,d);
  }
  $("dlg-dt-picker").close();
});

function fillProfileForm(prefix){
  const d=state.quitAt?new Date(state.quitAt):new Date();
  setQuitPickerDate(prefix,Number.isNaN(d.getTime())?new Date():d);
  $(`${prefix}-cigs`).value=String(state.cigsPerDay).replace(".",",");
  $(`${prefix}-pack`).value=String(state.packSize);
  $(`${prefix}-price`).value=String(state.packPrice).replace(".",",");
  $(`${prefix}-min`).value=String(state.minPerCig).replace(".",",");
  $(`${prefix}-err`).textContent="";
}

function submitProfile(prefix){
  const errEl=$(`${prefix}-err`);
  const qMs=readQuitPickerMs(prefix);
  if(Number.isNaN(qMs)){errEl.textContent="Lütfen geçerli bir kurtulma tarih ve saati seç.";return false}
  if(qMs>Date.now()){errEl.textContent="Kurtulma zamanı gelecekte olamaz.";return false}

  const cigs=parseNum($(`${prefix}-cigs`).value);
  const pack=parseNum($(`${prefix}-pack`).value);
  const price=parseNum($(`${prefix}-price`).value);
  const min=parseNum($(`${prefix}-min`).value);

  if(!(cigs>0&&cigs<=200)){errEl.textContent="Günlük sigara sayısı 0'dan büyük olmalı.";return false}
  if(!(pack>=1&&pack<=100&&Number.isInteger(pack))){errEl.textContent="Paketteki dal sayısı tam sayı olmalı (en az 1).";return false}
  if(!(price>=0&&price<=5000)){errEl.textContent="Paket fiyatı 0 veya daha büyük olmalı.";return false}
  if(!(min>=0&&min<=60)){errEl.textContent="Dal başına dakika 0 ile 60 arasında olmalı.";return false}

  errEl.textContent="";
  state.setupDone=true;
  state.quitAt=new Date(qMs).toISOString();
  state.cigsPerDay=cigs;
  state.packSize=pack;
  state.packPrice=price;
  state.minPerCig=min;
  saveState();
  renderAll();
  return true;
}

function readRemindersObj(){
  if(hasBridge()&&typeof window.Nefes.reminders==="function"){
    try{
      const r=JSON.parse(window.Nefes.reminders()||"{}");
      return {enabled:Boolean(r.enabled),interval:Number(r.interval)||DEFAULT_REMINDER_INTERVAL,permitted:Boolean(r.permitted),bridged:true};
    }catch(_){}
  }
  try{
    const r=JSON.parse(localStorage.getItem(LS_REM)||"{}");
    return {enabled:Boolean(r.enabled),interval:Number(r.interval)||DEFAULT_REMINDER_INTERVAL,permitted:false,bridged:false};
  }catch(_){
    return {enabled:false,interval:DEFAULT_REMINDER_INTERVAL,permitted:false,bridged:false};
  }
}

window.refreshReminders=function(){
  const r=readRemindersObj();
  const chk=$("chk-rem"),sel=$("sel-rem-int"),sub=$("rem-sub"),note=$("rem-notice");
  const validInts=[60,90,120,180];
  sel.value=String(validInts.includes(r.interval)?r.interval:DEFAULT_REMINDER_INTERVAL);

  if(!r.bridged){
    chk.checked=false;
    sub.textContent="Tarayıcı önizleme modu (bildirim yok)";
    note.className="notice warn";
    note.textContent="Android bildirim köprüsü bağlı değil; tarayıcıda bildirim gönderilemez. Tercihin Android uygulamasında etkinleşir.";
    return;
  }
  if(!r.permitted){
    chk.checked=false;
    sub.textContent="Bildirim izni verilmedi";
    note.className="notice warn";
    note.textContent="Bildirim izni kapalı olduğu için hatırlatıcı aktif değil. Açmak için sistem bildirim izni gerekir.";
    return;
  }
  chk.checked=r.enabled;
  sub.textContent=r.enabled?`Aktif • Her ${sel.value} dk (09:00–21:00)`:"Kapalı";
  note.className="notice";
  note.textContent=r.enabled?"Hatırlatıcılar yalnızca 09:00–21:00 saatleri arasında sessizce çalışır.":"İstediğinde 09:00–21:00 arası su hatırlatıcısını açabilirsin.";
};

function setReminder(enabled,interval){
  if(hasBridge()&&typeof window.Nefes.setReminder==="function"){
    try{window.Nefes.setReminder(enabled,interval)}catch(_){}
  }else{
    try{localStorage.setItem(LS_REM,JSON.stringify({enabled,interval}))}catch(_){}
  }
  if(!hasBridge())window.refreshReminders();
}

function sendReminderUpdate(){
  const enabled=$("chk-rem").checked;
  const interval=parseInt($("sel-rem-int").value,10)||DEFAULT_REMINDER_INTERVAL;
  setReminder(enabled,interval);
}

function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${tab}`));
  document.querySelectorAll(".nav-btn").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===tab?"page":"false"));
  if(tab==="bugun"){
    const el=getElapsed();
    if(el!==null){renderTimer(el);renderStats(el)}
  }
  if(tab==="sigara")renderSigara();
  if(tab==="ayarlar"){
    fillProfileForm("s");
    $("btn-settings-relapse").hidden=!state.setupDone;
  }
  if(tab==="yolculuk")renderJourney();
  if(tab==="su"){renderWater();window.refreshReminders()}
  window.scrollTo(0,0);
}

window.openWater=function(){
  for(const dialog of document.querySelectorAll("dialog[open]"))dialog.close();
  switchTab("su");
};

window.goBack=function(){
  const dtp=$("dlg-dt-picker"),d1=$("dlg-setup"),d2=$("dlg-reset"),d3=$("dlg-relapse");
  if(dtp&&dtp.open){dtp.close();return true}
  if(d1&&d1.open){d1.close();return true}
  if(d2&&d2.open){d2.close();return true}
  if(d3&&d3.open){d3.close();return true}
  if(currentTab!=="bugun"){switchTab("bugun");return true}
  return false;
};

function openSetupDialog(){
  $("dlg-title").textContent=state.setupDone?"Sigaradan Kurtulma Bilgilerini Düzenle":"Sigaradan Kurtulma Bilgileri";
  $("dlg-submit").textContent=state.setupDone?"Değişiklikleri Kaydet":"Kaydet ve Takibe Başla";
  fillProfileForm("d");
  $("dlg-setup").showModal();
}

function renderAll(){
  const key=localDateKey();
  lastDateKey=key;
  renderHeroAndStats();
  renderSigara();
  renderWater();
  renderQuote(key);
  $("btn-settings-relapse").hidden=!state.setupDone;
  if(currentTab==="yolculuk")renderJourney();
  if(currentTab==="ayarlar")fillProfileForm("s");
}

// Events
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
$("btn-start-setup").addEventListener("click",openSetupDialog);
$("btn-sigara-setup").addEventListener("click",openSetupDialog);
$("btn-sigara-edit").addEventListener("click",openSetupDialog);
$("btn-journey-setup").addEventListener("click",openSetupDialog);
$("btn-go-sigara").addEventListener("click",()=>switchTab("sigara"));
$("btn-sigara-steps").addEventListener("click",()=>{
  sigaraStepsOpen=!sigaraStepsOpen;
  syncSigaraStepsToggle();
});
$("btn-sigara-health").addEventListener("click",()=>{
  sigaraHealthOpen=!sigaraHealthOpen;
  syncSigaraHealthToggle();
});
$("btn-go-water").addEventListener("click",()=>window.openWater());
$("btn-dash-add-water").addEventListener("click",()=>addWater(1));
$("btn-dash-undo-water").addEventListener("click",()=>addWater(-1));
$("btn-add-water").addEventListener("click",()=>addWater(1));
$("btn-undo-water").addEventListener("click",()=>addWater(-1));

$("btn-save-goal").addEventListener("click",()=>{
  const g=Math.round(parseNum($("inp-cup-goal").value));
  if(g>=1&&g<=20){state.cupGoal=g;saveState();renderWater()}
  else $("inp-cup-goal").value=state.cupGoal;
});

$("chk-rem").addEventListener("change",sendReminderUpdate);
$("sel-rem-int").addEventListener("change",sendReminderUpdate);

$("dlg-close").addEventListener("click",()=>$("dlg-setup").close());
$("dlg-cancel").addEventListener("click",()=>$("dlg-setup").close());
$("dlg-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(submitProfile("d"))$("dlg-setup").close();
});

$("settings-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(submitProfile("s"))switchTab("bugun");
});

$("btn-sigara-relapse").addEventListener("click",()=>$("dlg-relapse").showModal());
$("btn-settings-relapse").addEventListener("click",()=>$("dlg-relapse").showModal());
$("rel-cancel").addEventListener("click",()=>$("dlg-relapse").close());
$("rel-confirm").addEventListener("click",()=>{
  state.setupDone=true;
  state.quitAt=new Date().toISOString();
  saveState();
  $("dlg-relapse").close();
  renderAll();
});

$("btn-ask-reset").addEventListener("click",()=>$("dlg-reset").showModal());
$("rst-cancel").addEventListener("click",()=>$("dlg-reset").close());
$("rst-confirm").addEventListener("click",()=>{
  state={...DEFAULTS,waterByDate:{}};
  sigaraStepsOpen=false;
  sigaraHealthOpen=false;
  syncSigaraStepsToggle();
  syncSigaraHealthToggle();
  saveState();
  setReminder(false,DEFAULT_REMINDER_INTERVAL);
  $("dlg-reset").close();
  switchTab("bugun");
  renderAll();
});

// Init & 1s ticker + local midnight refresh
renderAll();
if(state.setupDone)saveState();
window.refreshReminders();

setInterval(()=>{
  const k=localDateKey();
  if(k!==lastDateKey){
    lastDateKey=k;
    renderQuote(k);
    renderWater();
    $("today-date").textContent=formatDateTR();
  }
  const el=getElapsed();
  renderTimer(el);
  if(el!==null)renderSigaraTimer(el);
  const minute=Math.floor(Date.now()/60000);
  if(minute!==lastMinute){
    lastMinute=minute;
    renderStats(el);
    if(currentTab==="sigara")renderSigara();
    if(currentTab==="yolculuk")renderJourney();
  }
},1000);
})();
