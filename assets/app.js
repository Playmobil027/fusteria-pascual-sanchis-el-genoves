(function(){
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var OUT='cubic-bezier(.22,1,.36,1)',INOUT='cubic-bezier(.65,0,.35,1)',IN='cubic-bezier(.4,0,1,1)',SPRING='cubic-bezier(.34,1.56,.64,1)';
  function anim(el,kf,o){
    if(RM||!el.animate){var f={onfinish:null,cancel:function(){}};setTimeout(function(){f.onfinish&&f.onfinish()},0);return f}
    return el.animate(kf,o);
  }
  // escalonado: cada fila entra 30 ms después de la anterior
  var rv=[].slice.call(document.querySelectorAll('.rv'));
  rv.forEach(function(x){
    var n=0,p=x.previousElementSibling;
    while(p&&p.classList.contains('rv')){n++;p=p.previousElementSibling}
    x.style.setProperty('--i',n);
  });
  [].slice.call(document.querySelectorAll('.hero .wrap>*')).forEach(function(x,i){x.style.setProperty('--k',i)});
  [].slice.call(document.querySelectorAll('.ddm a,.menu-m a')).forEach(function(x,i){x.style.setProperty('--i',x.parentNode.classList.contains('ddm')?[].indexOf.call(x.parentNode.children,x):i)});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(x){io.observe(x)});
  }else rv.forEach(function(x){x.classList.add('in')});
  // misma imagen = mismo nombre de transición entre la portada y cada servicio
  var slug=(location.pathname.split('/')[1]||'');
  var hi=document.querySelector('.phero>img');
  if(hi&&slug)hi.style.viewTransitionName='h-'+slug;
  [].slice.call(document.querySelectorAll('.card a.mas[href],.rel a[href]')).forEach(function(a){
    var m=(a.getAttribute('href')||'').match(/^\/([a-z-]+)\/$/),im2=a.closest('.card,.rel>*')&&a.closest('.card,.rel>*').querySelector('img');
    if(m&&im2&&m[1]!==slug)im2.style.viewTransitionName='h-'+m[1];
  });
  // menú móvil con iconos que se cambian (escala + desenfoque)
  var bg=document.getElementById('burger'),mm=document.getElementById('menu-m');
  if(bg){
    bg.innerHTML='<span class="ic2 a"><i></i></span><span class="ic2 b"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15"/></svg></span>';
    bg.addEventListener('click',function(){var on=mm.classList.toggle('on');bg.setAttribute('aria-expanded',on)});
    mm.addEventListener('click',function(e){if(e.target.tagName==='A'){mm.classList.remove('on');bg.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mm.classList.contains('on')){mm.classList.remove('on');bg.setAttribute('aria-expanded','false')}});
  }
  // preguntas: + y − se cambian con escala + desenfoque
  [].slice.call(document.querySelectorAll('.faq summary')).forEach(function(s){
    var ic=document.createElement('span');ic.className='ic';ic.setAttribute('aria-hidden','true');ic.innerHTML='<b>+</b><b>−</b>';s.appendChild(ic);
  });
  // pies de foto
  var CAP={
    cocinas:['Cocina a medida','Fabricada en nuestro taller con las medidas tomadas en tu casa. Eliges frentes, encimera y distribución.','Se diseña antes en 3D para que veas el resultado. Después se fabrica y la montamos nosotros.','Muebles de cocina hechos a la medida del espacio, con los herrajes y acabados que prefieras.'],
    armarios:['Armario empotrado','Armario hecho a la medida de la pared, con puertas abatibles o correderas y el interior que necesites.','Aprovecha cada hueco: baldas, cajones y barras repartidos según lo que quieras guardar.','Fabricado y montado por nuestro equipo, con el acabado que mejor combine con la estancia.'],
    vestidores:['Vestidor a medida','Zona de ropa organizada en barras, baldas y cajones, pensada para tu espacio.','Un vestidor distribuido según tu forma de vestir, con módulos hechos en el taller.','Se adapta a la habitación que tengas, con o sin puertas y con el acabado que elijas.'],
    puertas:['Puertas de interior','Puertas hechas a medida del hueco, en el modelo, la madera y el acabado que prefieras.','Carpintería de puertas con medición, fabricación y colocación por el mismo equipo.','Puertas de paso y de entrada ajustadas al milímetro para que cierren bien.'],
    portones:['Portón y exterior','Portones y cerramientos de madera hechos para soportar el uso diario.','Carpintería exterior a medida, con el acabado adecuado para madera en la intemperie.','Fabricado en el taller y colocado en obra, adaptado al hueco que tengas.'],
    escaleras:['Escalera de madera','Peldaños, zancas y barandilla hechos a medida del espacio de tu casa.','Escaleras de madera fabricadas y montadas por nuestro equipo.','Tramos rectos o con giro, con la madera y el acabado que elijas.'],
    aseos:['Mueble de baño','Muebles de baño hechos a la medida del espacio, con el acabado que prefieras.','Carpintería para aseos y baños, con materiales pensados para la humedad.','Mueble bajo lavabo y almacenaje fabricados en el taller.'],
    banos:['Mueble de baño','Muebles de baño hechos a la medida del espacio, con el acabado que prefieras.','Carpintería para aseos y baños, con materiales pensados para la humedad.','Mueble bajo lavabo y almacenaje fabricados en el taller.'],
    habitaciones:['Habitación a medida','Cabeceros, armarios y mobiliario de dormitorio hechos a la medida de la estancia.','Habitaciones completas, desde las infantiles hasta las de matrimonio, con mobiliario del taller.','Muebles pensados para aprovechar el espacio y que la habitación quede ordenada.'],
    muebles:['Mueble a medida','Piezas únicas fabricadas en el taller según tus medidas y el estilo que busques.','Muebles de salón, entrada u oficina hechos para el hueco que tengas.','Eliges la madera y el acabado; nosotros lo diseñamos, fabricamos y montamos.'],
    varios:['Trabajo de carpintería','Trabajos de carpintería a medida: restauración, reformas y encargos especiales.','Soluciones de madera para lo que no encuentras hecho, fabricadas en nuestro taller.','Del arreglo pequeño al encargo grande: cuéntanos qué necesitas y lo presupuestamos.']
  };
  var gal=document.getElementById('gal');
  var figs=gal?[].slice.call(gal.querySelectorAll('figure')):[];
  figs.forEach(function(x,i){
    var im0=x.querySelector('img'),b=x.querySelector('button'),cat=x.dataset.c;
    if(!cat){var m=((b&&b.dataset.full)||im0.getAttribute('src')||'').match(/\/g\/([a-z]+)\//);cat=m?m[1]:'varios'}
    var c=CAP[cat]||CAP.varios,ds=c.slice(1);
    var n=((b&&b.dataset.full)||im0.getAttribute('src')||'').match(/(\d+)\.jpg/);
    x._t=im0.alt||c[0];
    x._d=ds[((n?+n[1]:i))%ds.length];
    var fc=document.createElement('figcaption');fc.innerHTML='<b></b><span></span>';
    fc.firstChild.textContent=x._t;fc.lastChild.textContent=x._d;x.appendChild(fc);
  });
  // galerías (filtros + "ver más")
  var btns=[].slice.call(document.querySelectorAll('.filtros button'));
  var mas=document.getElementById('mas');
  var lote=gal?parseInt(gal.dataset.lote||'0',10):0;
  var f='todos',lim=lote,primera=true;
  function pintar(){
    var n=0,rest=0,nuevas=0;
    figs.forEach(function(x){
      var ok=(f==='todos'||x.dataset.c===f);
      if(!ok){x.hidden=true;x._v=false;return}
      n++;
      if(lote&&n>lim){x.hidden=true;x._v=false;rest++}
      else{
        x.hidden=false;
        if(!x._v&&!primera){x.classList.remove('ent');void x.offsetWidth;x.style.setProperty('--i',nuevas++);x.classList.add('ent')}
        x._v=true;
      }
    });
    if(mas){mas.hidden=!(lote&&rest>0);if(rest)mas.textContent='Ver más trabajos ('+rest+')'}
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===f?'true':'false')});
  }
  btns.forEach(function(b){b.addEventListener('click',function(){f=b.dataset.f;lim=lote;pintar()})});
  if(mas)mas.addEventListener('click',function(){lim+=lote;pintar()});
  if(gal){
    var h=(location.hash||'').replace('#','');
    if(h&&btns.some(function(b){return b.dataset.f===h}))f=h;
    pintar();primera=false;
  }
  // visor de fotos: nace de la miniatura, vuelve a ella, y se arrastra con goma elástica
  var lb=document.getElementById('lb');
  if(lb){
    var im=lb.querySelector('img'),cur=0,vis=[],orig=null,cap=document.createElement('div');
    cap.className='cap';cap.innerHTML='<b></b><span></span>';lb.appendChild(cap);
    function thumb(x){return x.querySelector('img')}
    function full(x){var b=x.querySelector('button');return b.dataset.full||thumb(x).src}
    function pon(x){
      var t=thumb(x).currentSrc||thumb(x).src,F=full(x);
      im.src=t;im.alt=x._t||thumb(x).alt;
      if(F!==t){var g=new Image();g.src=F;(g.decode?g.decode():Promise.resolve()).then(function(){if(vis[cur]===x)im.src=F}).catch(function(){if(vis[cur]===x)im.src=F})}
      cap.firstChild.textContent=x._t||thumb(x).alt;cap.lastChild.textContent=x._d||'';
      [].slice.call(cap.children).forEach(function(c,i){anim(c,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:260,delay:200+i*30,easing:OUT,fill:'backwards'})});
    }
    function oculta(x){if(orig)orig.style.opacity='';orig=x?thumb(x):null;if(orig)orig.style.opacity='0'}
    // trayectoria en arco entre dos rectángulos (curva cuadrática, sube un poco por el camino)
    function arco(a,b,inv){
      var ax=a.left+a.width/2,ay=a.top+a.height/2,bx=b.left+b.width/2,by=b.top+b.height/2;
      var d=Math.hypot(bx-ax,by-ay),cx=(ax+bx)/2,cy=(ay+by)/2-Math.min(90,d*.22);
      var kf=[],s0=a.width/b.width,N=10;
      for(var i=0;i<=N;i++){
        var t=i/N,u=1-t,x=u*u*ax+2*u*t*cx+t*t*bx,y=u*u*ay+2*u*t*cy+t*t*by,sc=s0+(1-s0)*t;
        kf.push({offset:t,transform:'translate('+(x-bx)+'px,'+(y-by)+'px) scale('+sc+')'});
      }
      return inv?kf.reverse().map(function(k,i){k.offset=i/N;return k}):kf;
    }
    function dentro(r){return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&r.width>0}
    function abrir(x){
      vis=figs.filter(function(y){return !y.hidden});cur=vis.indexOf(x);
      var r0=thumb(x).getBoundingClientRect();
      lb.classList.add('on');pon(x);
      var r1=im.getBoundingClientRect();
      oculta(x);
      anim(im,arco(r0,r1,false),{duration:340,easing:OUT,fill:'backwards'});
      lb.querySelector('.x').focus({preventScroll:true});
    }
    function cerrar(){
      if(!lb.classList.contains('on'))return;
      var x=vis[cur],o=orig;
      lb.classList.remove('on');
      var r0=im.getBoundingClientRect(),r1=o?o.getBoundingClientRect():null;
      var a;
      if(r1&&dentro(r1))a=anim(im,arco(r1,r0,true),{duration:270,easing:INOUT,fill:'forwards'});
      else a=anim(im,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(12px) scale(.96)'}],{duration:200,easing:IN,fill:'forwards'});
      a.onfinish=function(){if(o)o.style.opacity='';orig=null;if(a.cancel)a.cancel();if(x){var bb=x.querySelector('button');if(bb)bb.focus({preventScroll:true})}};
    }
    function mover(d){
      if(vis.length<2)return;
      var r=im.getBoundingClientRect(),g=im.cloneNode();
      g.className='ghost';g.style.left=r.left+'px';g.style.top=r.top+'px';g.style.width=r.width+'px';g.style.height=r.height+'px';
      g.style.translate=im.style.translate;
      lb.insertBefore(g,im);
      var ga=anim(g,[{transform:'none',opacity:1},{transform:'translateX('+(-d*56)+'px)',opacity:0}],{duration:200,easing:IN,fill:'forwards'});
      ga.onfinish=function(){g.remove()};
      cur=(cur+d+vis.length)%vis.length;
      im.style.translate='';
      pon(vis[cur]);oculta(vis[cur]);
      anim(im,[{transform:'translateX('+(d*56)+'px)',opacity:0},{transform:'none',opacity:1}],{duration:250,easing:OUT});
    }
    figs.forEach(function(x){x.querySelector('button').addEventListener('click',function(){abrir(x)})});
    lb.querySelector('.x').addEventListener('click',cerrar);
    lb.querySelector('.p').addEventListener('click',function(){mover(-1)});
    lb.querySelector('.s').addEventListener('click',function(){mover(1)});
    lb.addEventListener('click',function(e){if(e.target===lb)cerrar()});
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('on'))return;
      if(e.key==='Escape')cerrar();
      if(e.key==='ArrowLeft')mover(-1);
      if(e.key==='ArrowRight')mover(1);
    });
    // arrastre con elasticidad: cuanto más tiras, más cuesta; si no llega al umbral, vuelve rebotando
    var x0=null,dx=0;
    function goma(v){return v/(1+Math.abs(v)/280)}
    im.addEventListener('pointerdown',function(e){x0=e.clientX;dx=0;im.setPointerCapture(e.pointerId);im.style.cursor='grabbing'});
    im.addEventListener('pointermove',function(e){if(x0===null)return;dx=e.clientX-x0;im.style.translate=goma(dx)+'px 0'});
    function suelta(){
      if(x0===null)return;x0=null;im.style.cursor='';
      if(Math.abs(dx)>80){var d=dx<0?1:-1;im.style.translate='';dx=0;mover(d);return}
      var from=goma(dx);dx=0;im.style.translate='';
      anim(im,[{translate:from+'px 0'},{translate:'0 0'}],{duration:420,easing:SPRING});
    }
    im.addEventListener('pointerup',suelta);im.addEventListener('pointercancel',suelta);
  }
  // formulario -> WhatsApp
  var fm=document.getElementById('form');
  if(fm)fm.addEventListener('submit',function(e){
    e.preventDefault();
    var t='Hola, soy '+fm.nombre.value+'. Quiero presupuesto de: '+fm.tipo.value+'.'+(fm.msg.value?' '+fm.msg.value:'')+(fm.tel.value?' Mi teléfono: '+fm.tel.value+'.':'');
    var bt=fm.querySelector('button[type=submit]');
    if(bt){var tx=bt.textContent;bt.classList.remove('ok');void bt.offsetWidth;bt.classList.add('ok');bt.textContent='Abriendo WhatsApp\u2026';setTimeout(function(){bt.textContent=tx;bt.classList.remove('ok')},2200)}
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
