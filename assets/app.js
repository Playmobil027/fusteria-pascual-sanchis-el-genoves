(function(){
  // aparición suave al hacer scroll
  var rv=[].slice.call(document.querySelectorAll('.rv'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(x){io.observe(x)});
  }else rv.forEach(function(x){x.classList.add('in')});
  // menú móvil
  var bg=document.getElementById('burger'),mm=document.getElementById('menu-m');
  if(bg){bg.addEventListener('click',function(){var on=mm.classList.toggle('on');bg.setAttribute('aria-expanded',on)});
    mm.addEventListener('click',function(e){if(e.target.tagName==='A')mm.classList.remove('on')})}
  // galerías (filtros + "ver más")
  var gal=document.getElementById('gal');
  var figs=gal?[].slice.call(gal.querySelectorAll('figure')):[];
  var btns=[].slice.call(document.querySelectorAll('.filtros button'));
  var mas=document.getElementById('mas');
  var lote=gal?parseInt(gal.dataset.lote||'0',10):0;
  var f='todos',lim=lote;
  function pintar(){
    var n=0,rest=0;
    figs.forEach(function(x){
      var ok=(f==='todos'||x.dataset.c===f);
      if(!ok){x.hidden=true;return}
      n++;
      if(lote&&n>lim){x.hidden=true;rest++}else x.hidden=false;
    });
    if(mas){mas.hidden=!(lote&&rest>0);if(rest)mas.textContent='Ver más trabajos ('+rest+')'}
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===f?'true':'false')});
  }
  btns.forEach(function(b){b.addEventListener('click',function(){f=b.dataset.f;lim=lote;pintar()})});
  if(mas)mas.addEventListener('click',function(){lim+=lote;pintar()});
  if(gal){
    var h=(location.hash||'').replace('#','');
    if(h&&btns.some(function(b){return b.dataset.f===h}))f=h;
    pintar();
  }
  // lightbox
  var lb=document.getElementById('lb');
  if(lb){
    var im=lb.querySelector('img'),cur=0,vis=[];
    function src(x){var b=x.querySelector('button');return b.dataset.full||x.querySelector('img').src}
    function show(){im.src=src(vis[cur]);im.alt=vis[cur].querySelector('img').alt}
    function abrir(x){vis=figs.filter(function(y){return !y.hidden});cur=vis.indexOf(x);show();lb.classList.add('on')}
    function mover(d){cur=(cur+d+vis.length)%vis.length;show()}
    figs.forEach(function(x){x.querySelector('button').addEventListener('click',function(){abrir(x)})});
    lb.querySelector('.x').addEventListener('click',function(){lb.classList.remove('on')});
    lb.querySelector('.p').addEventListener('click',function(){mover(-1)});
    lb.querySelector('.s').addEventListener('click',function(){mover(1)});
    lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('on')});
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('on'))return;
      if(e.key==='Escape')lb.classList.remove('on');
      if(e.key==='ArrowLeft')mover(-1);
      if(e.key==='ArrowRight')mover(1);
    });
  }
  // formulario -> WhatsApp
  var fm=document.getElementById('form');
  if(fm)fm.addEventListener('submit',function(e){
    e.preventDefault();
    var t='Hola, soy '+fm.nombre.value+'. Quiero presupuesto de: '+fm.tipo.value+'.'+(fm.msg.value?' '+fm.msg.value:'')+(fm.tel.value?' Mi teléfono: '+fm.tel.value+'.':'');
    window.open('https://wa.me/34661518443?text='+encodeURIComponent(t),'_blank','noopener');
  });
  // horario (Europe/Madrid)
  var H={1:[[480,810],[900,1080]],2:[[480,810],[900,1080]],3:[[480,810],[900,1080]],4:[[480,810],[900,1080]],5:[[480,810],[900,1080]],6:[],0:[]};
  var N=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  function fmt(m){var h=Math.floor(m/60),mm=m%60;return h+(mm?':'+(mm<10?'0':'')+mm:':00')}
  function ahora(){
    var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()),o={};
    p.forEach(function(x){o[x.type]=x.value});
    return {d:{Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[o.weekday],m:(+o.hour%24)*60+(+o.minute)};
  }
  var el=document.getElementById('estado');
  function estado(){
    var t=ahora(),tr=H[t.d]||[],txt='';
    for(var i=0;i<tr.length;i++){
      if(t.m>=tr[i][0]&&t.m<tr[i][1]){txt='Ahora abierto, hasta las '+fmt(tr[i][1]);break}
      if(t.m<tr[i][0]){txt='Ahora cerrado, abrimos a las '+fmt(tr[i][0]);break}
    }
    if(!txt){for(var k=1;k<=7;k++){var d=(t.d+k)%7;if(H[d].length){txt='Ahora cerrado, abrimos '+(k===1?'mañana':'el '+N[d])+' a las '+fmt(H[d][0][0]);break}}}
    el.textContent=txt;
    var li=document.querySelector('#horas li[data-d="'+t.d+'"]');if(li)li.classList.add('hoy');
  }
  if(el){estado();setInterval(estado,60000)}
  var rs=document.getElementById('resaltar');
  if(rs)rs.addEventListener('click',function(){document.body.classList.toggle('ver-editables')});
})();
