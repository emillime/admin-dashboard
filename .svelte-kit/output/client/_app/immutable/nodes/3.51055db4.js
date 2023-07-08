import{s as ht,f as vt}from"../chunks/scheduler.a70eca57.js";import{S as bt,i as gt,g as c,s as S,m as Q,r as lt,h as d,j as h,f as u,c as C,n as W,u as ot,x as _t,k as t,a as pt,y as e,v as nt,d as it,t as ct,w as dt,o as wt}from"../chunks/index.fec47d3a.js";import{F as ut}from"../chunks/fa.28829ef6.js";import{c as xt,d as yt}from"../chunks/index.f1d07f17.js";import{p as Et}from"../chunks/parse.bee59afc.js";import{j as Lt,k as $t}from"../chunks/singletons.4d12ce3b.js";const Dt=Lt("invalidate_all");function It(a){return $t.apply_action(a)}function At(a){const r=JSON.parse(a);return r.data&&(r.data=Et(r.data)),r}function ft(a){return HTMLElement.prototype.cloneNode.call(a)}function kt(a,r=()=>{}){const i=async({action:s,result:v,reset:l})=>{v.type==="success"&&(l!==!1&&HTMLFormElement.prototype.reset.call(a),await Dt()),(location.origin+location.pathname===s.origin+s.pathname||v.type==="redirect"||v.type==="error")&&It(v)};async function f(s){var y,V,_,M;if(((y=s.submitter)!=null&&y.hasAttribute("formmethod")?s.submitter.formMethod:ft(a).method)!=="post")return;s.preventDefault();const l=new URL((V=s.submitter)!=null&&V.hasAttribute("formaction")?s.submitter.formAction:ft(a).action),o=new FormData(a),b=(_=s.submitter)==null?void 0:_.getAttribute("name");b&&o.append(b,((M=s.submitter)==null?void 0:M.getAttribute("value"))??"");const E=new AbortController;let g=!1;const w=await r({action:l,cancel:()=>g=!0,controller:E,get data(){return o},formData:o,get form(){return a},formElement:a,submitter:s.submitter})??i;if(g)return;let x;try{const n=await fetch(l,{method:"POST",headers:{accept:"application/json","x-sveltekit-action":"true"},cache:"no-store",body:o,signal:E.signal});x=At(await n.text()),x.type==="error"&&(x.status=n.status)}catch(n){if((n==null?void 0:n.name)==="AbortError")return;x={type:"error",error:n}}w({action:l,get data(){return o},formData:o,get form(){return a},formElement:a,update:n=>i({action:l,result:x,reset:n==null?void 0:n.reset}),result:x})}return HTMLFormElement.prototype.addEventListener.call(a,"submit",f),{destroy(){HTMLFormElement.prototype.removeEventListener.call(a,"submit",f)}}}function mt(a){var v;let r,i,f=((v=a[0])==null?void 0:v.error)+"",s;return{c(){r=c("div"),i=c("small"),s=Q(f),this.h()},l(l){r=d(l,"DIV",{class:!0});var o=h(r);i=d(o,"SMALL",{});var b=h(i);s=W(b,f),b.forEach(u),o.forEach(u),this.h()},h(){t(r,"class","text-sm text-red-500")},m(l,o){pt(l,r,o),e(r,i),e(i,s)},p(l,o){var b;o&1&&f!==(f=((b=l[0])==null?void 0:b.error)+"")&&wt(s,f)},d(l){l&&u(r)}}}function Tt(a){var Z,tt;let r,i,f,s,v,l,o,b,E,g,L,w,x,y,V,_,M,n,D,B,k,R,I,q,$,A,X="Logga in",z,P,J,Y;y=new ut({props:{icon:xt,fw:!0,class:"inline text-center ml-1"}}),k=new ut({props:{icon:yt,fw:!0,class:"inline text-center ml-1"}});let m=((Z=a[0])==null?void 0:Z.error)&&((tt=a[0])==null?void 0:tt.error)!==""&&mt(a);return{c(){r=c("main"),i=c("section"),f=c("div"),s=S(),v=c("div"),l=c("div"),o=c("div"),b=c("div"),E=c("div"),g=c("form"),L=c("div"),w=c("label"),x=Q("E-post "),lt(y.$$.fragment),V=S(),_=c("input"),M=S(),n=c("div"),D=c("label"),B=Q(`Lösenord
										`),lt(k.$$.fragment),R=S(),I=c("input"),q=S(),$=c("div"),A=c("button"),A.textContent=X,z=S(),m&&m.c(),this.h()},l(p){r=d(p,"MAIN",{});var F=h(r);i=d(F,"SECTION",{class:!0});var T=h(i);f=d(T,"DIV",{class:!0}),h(f).forEach(u),s=C(T),v=d(T,"DIV",{class:!0});var O=h(v);l=d(O,"DIV",{class:!0});var et=h(l);o=d(et,"DIV",{class:!0});var at=h(o);b=d(at,"DIV",{class:!0});var rt=h(b);E=d(rt,"DIV",{class:!0});var st=h(E);g=d(st,"FORM",{method:!0});var N=h(g);L=d(N,"DIV",{class:!0});var U=h(L);w=d(U,"LABEL",{class:!0,for:!0});var G=h(w);x=W(G,"E-post "),ot(y.$$.fragment,G),G.forEach(u),V=C(U),_=d(U,"INPUT",{id:!0,name:!0,type:!0,class:!0,placeholder:!0}),U.forEach(u),M=C(N),n=d(N,"DIV",{class:!0});var j=h(n);D=d(j,"LABEL",{class:!0,for:!0});var K=h(D);B=W(K,`Lösenord
										`),ot(k.$$.fragment,K),K.forEach(u),R=C(j),I=d(j,"INPUT",{id:!0,name:!0,type:!0,class:!0,placeholder:!0}),j.forEach(u),q=C(N),$=d(N,"DIV",{class:!0});var H=h($);A=d(H,"BUTTON",{class:!0,type:!0,["data-svelte-h"]:!0}),_t(A)!=="svelte-16ks9pf"&&(A.textContent=X),z=C(H),m&&m.l(H),H.forEach(u),N.forEach(u),st.forEach(u),rt.forEach(u),at.forEach(u),et.forEach(u),O.forEach(u),T.forEach(u),F.forEach(u),this.h()},h(){t(f,"class","absolute top-0 w-full h-full bg-slate-100 bg-no-repeat bg-full"),t(w,"class","inline align-middle uppercase text-slate-600 text-xs font-bold mb-2"),t(w,"for","grid-email"),t(_,"id","grid-email"),t(_,"name","email"),t(_,"type","email"),t(_,"class","border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"),t(_,"placeholder","E-post"),t(L,"class","relative w-full mb-3"),t(D,"class","inline uppercase text-slate-600 text-xs font-bold mb-2"),t(D,"for","grid-password"),t(I,"id","grid-password"),t(I,"name","password"),t(I,"type","password"),t(I,"class","border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"),t(I,"placeholder","Lösenord"),t(n,"class","relative w-full mb-3"),t(A,"class","bg-sky-600 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"),t(A,"type","submit"),t($,"class","text-center mt-6"),t(g,"method","POST"),t(E,"class","flex-auto px-4 lg:px-10 py-10"),t(b,"class","relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg bg-slate-200 border-0"),t(o,"class","w-full lg:w-4/12 px-4"),t(l,"class","flex content-center items-center justify-center h-full"),t(v,"class","container mx-auto px-4 h-full"),t(i,"class","relative w-full h-full py-40 min-h-screen")},m(p,F){pt(p,r,F),e(r,i),e(i,f),e(i,s),e(i,v),e(v,l),e(l,o),e(o,b),e(b,E),e(E,g),e(g,L),e(L,w),e(w,x),nt(y,w,null),e(L,V),e(L,_),e(g,M),e(g,n),e(n,D),e(D,B),nt(k,D,null),e(n,R),e(n,I),e(g,q),e(g,$),e($,A),e($,z),m&&m.m($,null),P=!0,J||(Y=vt(kt.call(null,g)),J=!0)},p(p,[F]){var T,O;(T=p[0])!=null&&T.error&&((O=p[0])==null?void 0:O.error)!==""?m?m.p(p,F):(m=mt(p),m.c(),m.m($,null)):m&&(m.d(1),m=null)},i(p){P||(it(y.$$.fragment,p),it(k.$$.fragment,p),P=!0)},o(p){ct(y.$$.fragment,p),ct(k.$$.fragment,p),P=!1},d(p){p&&u(r),dt(y),dt(k),m&&m.d(),J=!1,Y()}}}function Vt(a,r,i){let{form:f}=r;return a.$$set=s=>{"form"in s&&i(0,f=s.form)},[f]}class Pt extends bt{constructor(r){super(),gt(this,r,Vt,Tt,ht,{form:0})}}export{Pt as component};
