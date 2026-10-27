(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const root=document.documentElement,saved=store.get('theme',null);if(saved)root.dataset.theme=saved;
const tb=$('#theme');
if(tb)tb.addEventListener('click',()=>{const dark=(root.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))==='dark';const n=dark?'light':'dark';root.dataset.theme=n;store.set('theme',n);tb.setAttribute('aria-pressed',String(n==='dark'))});
const menu=$('#menu'),links=$('#links');
if(menu)menu.addEventListener('click',()=>{const o=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(o))});
// back to top
const top=document.createElement('button');top.id='top';top.textContent='Top';top.hidden=true;top.setAttribute('aria-label','Back to top');
top.onclick=()=>scrollTo({top:0});document.body.append(top);
addEventListener('scroll',()=>{top.hidden=scrollY<500},{passive:true});
// rotating role
const role=$('#role');
if(role&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const r=role.dataset.roles.split('|');let i=0;setInterval(()=>{i=(i+1)%r.length;role.textContent=r[i]},2600)}
// project filter
const fb=$$('.filters button');
fb.forEach(b=>b.addEventListener('click',()=>{fb.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const f=b.dataset.f;$$('[data-tags]').forEach(c=>c.hidden=f!=='all'&&!c.dataset.tags.split(' ').includes(f))}));
// contact form
const cf=$('#contact');
if(cf){const EMAIL='231144113@mycput.ac.za',st=$('#status'),er=$('#err');
cf.addEventListener('submit',e=>{e.preventDefault();const n=cf.name.value.trim(),m=cf.email.value.trim(),t=cf.message.value.trim();
if(!n||!/^\S+@\S+\.\S+$/.test(m)||t.length<10){er.textContent='Enter your name, a valid email and a message of at least 10 characters.';return}
er.textContent='';location.href=`mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio message from '+n)}&body=${encodeURIComponent(t+'\n\nFrom: '+n+' ('+m+')')}`;
st.textContent='Your email app should open with the message ready to send.'});
$('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(EMAIL);st.textContent='Email address copied.'}catch{st.textContent='Copy failed. Email me at '+EMAIL}})}
// sprint board
const bd=$('#board');
if(bd){const names={todo:'To do',doing:'In progress',done:'Done'},order=['todo','doing','done'];
let s=store.get('board',{todo:['Write the team charter','Write user stories and tasks'],doing:['Set up the Trello board'],done:[]});
const draw=()=>{store.set('board',s);bd.replaceChildren();order.forEach((c,ci)=>{const col=document.createElement('div');col.className='col';col.dataset.c=c;
const h=document.createElement('h3');h.textContent=names[c];const n=document.createElement('span');n.textContent=s[c].length;h.append(n);col.append(h);
s[c].forEach((t,ti)=>{const d=document.createElement('div');d.className='task';const p=document.createElement('span');p.textContent=t;const bar=document.createElement('div');
const mk=(l,lab,fn)=>{const b=document.createElement('button');b.textContent=l;b.className='ghost';b.setAttribute('aria-label',lab+': '+t);b.onclick=fn;bar.append(b)};
if(ci>0)mk('←','Move back',()=>{s[order[ci-1]].push(s[c].splice(ti,1)[0]);draw()});
if(ci<2)mk('→','Move forward',()=>{s[order[ci+1]].push(s[c].splice(ti,1)[0]);draw()});
mk('Delete','Delete',()=>{s[c].splice(ti,1);draw()});d.append(p,bar);col.append(d)});bd.append(col)})};
$('#addtask').addEventListener('submit',e=>{e.preventDefault();const i=e.target.task,v=i.value.trim();if(v){s.todo.push(v);i.value='';draw()}});draw()}
// logbook
const lg=$('#log');
if(lg){let L=store.get('logbook',[]);const list=$('#entries');
const draw=()=>{store.set('logbook',L);list.replaceChildren();if(!L.length){const p=document.createElement('p');p.textContent='No entries yet. Add your first stand-up, sprint plan or retrospective above.';list.append(p)}
L.forEach((x,i)=>{const d=document.createElement('div');d.className='entry';const sm=document.createElement('small');sm.textContent=x.date+' · '+x.type;const p=document.createElement('p');p.textContent=x.note;
const b=document.createElement('button');b.textContent='Delete';b.className='ghost';b.onclick=()=>{L.splice(i,1);draw()};d.append(sm,p,b);list.append(d)})};
lg.date.valueAsDate=new Date();
lg.addEventListener('submit',e=>{e.preventDefault();const n=lg.note.value.trim();if(!n||!lg.date.value)return;L.unshift({date:lg.date.value,type:lg.type.value,note:n});lg.note.value='';draw()});
$('#export').addEventListener('click',()=>{const t=L.map(x=>x.date+' | '+x.type+'\n'+x.note).join('\n\n')||'No entries yet.';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download='agile-logbook.txt';a.click();URL.revokeObjectURL(a.href)});draw()}

// extras: reveal, count-up, tabs, tilt
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
root.classList.add('js');
const items=$$('.panel,.tile,.pcard,.stat,.sprint,main h2');items.forEach(e=>e.classList.add('rv'));
const run=e=>{e.classList.add('in');const c=e.dataset.count;if(c&&!rm){const end=+c;let n=0;const t=setInterval(()=>{n++;e.textContent=n;if(n>=end)clearInterval(t)},Math.max(40,900/end))}else if(c)e.textContent=c};
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){run(x.target);io.unobserve(x.target)}}),{threshold:.15}):null;
items.forEach(e=>io?io.observe(e):run(e));
const cnt=$$('[data-count]');cnt.forEach(b=>{const p=b.closest('.stat');if(p){const f=new IntersectionObserver(es=>{if(es[0].isIntersecting){run(b);f.disconnect()}});f.observe(p)}});
const tabs=$$('.tabs button');
if(tabs.length){const show=id=>{tabs.forEach(b=>{const on=b.dataset.t===id;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});$$('.tp').forEach(p=>p.hidden=p.id!==id)};
tabs.forEach((b,i)=>{b.onclick=()=>{show(b.dataset.t);history.replaceState(null,'','#'+b.dataset.t)};b.onkeydown=e=>{const d={ArrowRight:1,ArrowLeft:-1}[e.key];if(d){const n=tabs[(i+d+tabs.length)%tabs.length];n.focus();n.click()}}});
const h=location.hash.slice(1);show(tabs.some(b=>b.dataset.t===h)?h:tabs[0].dataset.t)}
if(!rm)$$('.pcard').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(700px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
})();
