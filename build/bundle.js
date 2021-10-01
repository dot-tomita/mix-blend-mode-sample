var app=function(){"use strict";function t(){}const e=t=>t;function n(t,e){for(const n in e)t[n]=e[n];return t}function o(t){return t()}function r(){return Object.create(null)}function s(t){t.forEach(o)}function l(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let i;function c(t,e){return i||(i=document.createElement("a")),i.href=e,t===i.href}function u(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function f(e){return e&&l(e.destroy)?e.destroy:t}const d="undefined"!=typeof window;let h=d?()=>window.performance.now():()=>Date.now(),v=d?t=>requestAnimationFrame(t):t;const p=new Set;function m(t){p.forEach((e=>{e.c(t)||(p.delete(e),e.f())})),0!==p.size&&v(m)}function $(t){let e;return 0===p.size&&v(m),{promise:new Promise((n=>{p.add(e={c:t,f:n})})),abort(){p.delete(e)}}}function g(t,e){t.appendChild(e)}function _(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function b(t){const e=x("style");return function(t,e){g(t.head||t,e)}(_(t),e),e}function w(t,e,n){t.insertBefore(e,n||null)}function y(t){t.parentNode.removeChild(t)}function x(t){return document.createElement(t)}function k(t){return document.createTextNode(t)}function q(){return k(" ")}function C(){return k("")}function E(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function j(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function A(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function S(t,e){t.value=null==e?"":e}function O(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function R(t,e){for(let n=0;n<t.options.length;n+=1){const o=t.options[n];if(o.__value===e)return void(o.selected=!0)}t.selectedIndex=-1}function T(t,e,n=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,n,!1,e),o}const L=new Set;let N,D=0;function I(t,e,n,o,r,s,l,a=0){const i=16.666/o;let c="{\n";for(let t=0;t<=1;t+=i){const o=e+(n-e)*s(t);c+=100*t+`%{${l(o,1-o)}}\n`}const u=c+`100% {${l(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${a}`,d=_(t);L.add(d);const h=d.__svelte_stylesheet||(d.__svelte_stylesheet=b(t).sheet),v=d.__svelte_rules||(d.__svelte_rules={});v[f]||(v[f]=!0,h.insertRule(`@keyframes ${f} ${u}`,h.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${f} ${o}ms linear ${r}ms 1 both`,D+=1,f}function P(t,e){const n=(t.style.animation||"").split(", "),o=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),r=n.length-o.length;r&&(t.style.animation=o.join(", "),D-=r,D||v((()=>{D||(L.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),L.clear())})))}function X(t){N=t}function z(){if(!N)throw new Error("Function called outside component initialization");return N}function F(){const t=z();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const r=T(e,n);o.slice().forEach((e=>{e.call(t,r)}))}}}function Y(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const B=[],M=[],U=[],W=[],G=Promise.resolve();let H=!1;function J(){H||(H=!0,G.then(Z))}function K(t){U.push(t)}let Q=!1;const V=new Set;function Z(){if(!Q){Q=!0;do{for(let t=0;t<B.length;t+=1){const e=B[t];X(e),tt(e.$$)}for(X(null),B.length=0;M.length;)M.pop()();for(let t=0;t<U.length;t+=1){const e=U[t];V.has(e)||(V.add(e),e())}U.length=0}while(B.length);for(;W.length;)W.pop()();H=!1,Q=!1,V.clear()}}function tt(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(K)}}let et;function nt(){return et||(et=Promise.resolve(),et.then((()=>{et=null}))),et}function ot(t,e,n){t.dispatchEvent(T(`${e?"intro":"outro"}${n}`))}const rt=new Set;let st;function lt(){st={r:0,c:[],p:st}}function at(){st.r||s(st.c),st=st.p}function it(t,e){t&&t.i&&(rt.delete(t),t.i(e))}function ct(t,e,n,o){if(t&&t.o){if(rt.has(t))return;rt.add(t),st.c.push((()=>{rt.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}const ut={duration:0};function ft(n,o,r){let s,a,i=o(n,r),c=!1,u=0;function f(){s&&P(n,s)}function d(){const{delay:o=0,duration:r=300,easing:l=e,tick:d=t,css:v}=i||ut;v&&(s=I(n,0,1,r,o,l,v,u++)),d(0,1);const p=h()+o,m=p+r;a&&a.abort(),c=!0,K((()=>ot(n,!0,"start"))),a=$((t=>{if(c){if(t>=m)return d(1,0),ot(n,!0,"end"),f(),c=!1;if(t>=p){const e=l((t-p)/r);d(e,1-e)}}return c}))}let v=!1;return{start(){v||(v=!0,P(n),l(i)?(i=i(),nt().then(d)):d())},invalidate(){v=!1},end(){c&&(f(),c=!1)}}}function dt(n,o,r){let a,i=o(n,r),c=!0;const u=st;function f(){const{delay:o=0,duration:r=300,easing:l=e,tick:f=t,css:d}=i||ut;d&&(a=I(n,1,0,r,o,l,d));const v=h()+o,p=v+r;K((()=>ot(n,!1,"start"))),$((t=>{if(c){if(t>=p)return f(0,1),ot(n,!1,"end"),--u.r||s(u.c),!1;if(t>=v){const e=l((t-v)/r);f(1-e,e)}}return c}))}return u.r+=1,l(i)?nt().then((()=>{i=i(),f()})):f(),{end(t){t&&i.tick&&i.tick(1,0),c&&(a&&P(n,a),c=!1)}}}function ht(t,e){const n={},o={},r={$$scope:1};let s=t.length;for(;s--;){const l=t[s],a=e[s];if(a){for(const t in l)t in a||(o[t]=1);for(const t in a)r[t]||(n[t]=a[t],r[t]=1);t[s]=a}else for(const t in l)r[t]=1}for(const t in o)t in n||(n[t]=void 0);return n}function vt(t){return"object"==typeof t&&null!==t?t:{}}function pt(t){t&&t.c()}function mt(t,e,n,r){const{fragment:a,on_mount:i,on_destroy:c,after_update:u}=t.$$;a&&a.m(e,n),r||K((()=>{const e=i.map(o).filter(l);c?c.push(...e):s(e),t.$$.on_mount=[]})),u.forEach(K)}function $t(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function gt(e,n,o,l,a,i,c,u=[-1]){const f=N;X(e);const d=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:a,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(f?f.$$.context:[])),callbacks:r(),dirty:u,skip_bound:!1,root:n.target||f.$$.root};c&&c(d.root);let h=!1;if(d.ctx=o?o(e,n.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return d.ctx&&a(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),h&&function(t,e){-1===t.$$.dirty[0]&&(B.push(t),J(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}(e,t)),n})):[],d.update(),h=!0,s(d.before_update),d.fragment=!!l&&l(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(y)}else d.fragment&&d.fragment.c();n.intro&&it(e.$$.fragment),mt(e,n.target,n.anchor,n.customElement),Z()}X(f)}class _t{$destroy(){$t(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const bt=[];function wt(t,e){return{subscribe:yt(t,e).subscribe}}function yt(e,n=t){let o;const r=new Set;function s(t){if(a(e,t)&&(e=t,o)){const t=!bt.length;for(const t of r)t[1](),bt.push(t,e);if(t){for(let t=0;t<bt.length;t+=2)bt[t][0](bt[t+1]);bt.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(l,a=t){const i=[l,a];return r.add(i),1===r.size&&(o=n(s)||t),l(e),()=>{r.delete(i),0===r.size&&(o(),o=null)}}}}function xt(e,n,o){const r=!Array.isArray(e),a=r?[e]:e,i=n.length<2;return wt(o,(e=>{let o=!1;const c=[];let f=0,d=t;const h=()=>{if(f)return;d();const o=n(r?c[0]:c,e);i?e(o):d=l(o)?o:t},v=a.map(((t,e)=>u(t,(t=>{c[e]=t,f&=~(1<<e),o&&h()}),(()=>{f|=1<<e}))));return o=!0,h(),function(){s(v),d()}}))}function kt(t){let e,o,r;const s=[t[2]];var l=t[0];function a(t){let e={};for(let t=0;t<s.length;t+=1)e=n(e,s[t]);return{props:e}}return l&&(e=new l(a()),e.$on("routeEvent",t[7])),{c(){e&&pt(e.$$.fragment),o=C()},m(t,n){e&&mt(e,t,n),w(t,o,n),r=!0},p(t,n){const r=4&n?ht(s,[vt(t[2])]):{};if(l!==(l=t[0])){if(e){lt();const t=e;ct(t.$$.fragment,1,0,(()=>{$t(t,1)})),at()}l?(e=new l(a()),e.$on("routeEvent",t[7]),pt(e.$$.fragment),it(e.$$.fragment,1),mt(e,o.parentNode,o)):e=null}else l&&e.$set(r)},i(t){r||(e&&it(e.$$.fragment,t),r=!0)},o(t){e&&ct(e.$$.fragment,t),r=!1},d(t){t&&y(o),e&&$t(e,t)}}}function qt(t){let e,o,r;const s=[{params:t[1]},t[2]];var l=t[0];function a(t){let e={};for(let t=0;t<s.length;t+=1)e=n(e,s[t]);return{props:e}}return l&&(e=new l(a()),e.$on("routeEvent",t[6])),{c(){e&&pt(e.$$.fragment),o=C()},m(t,n){e&&mt(e,t,n),w(t,o,n),r=!0},p(t,n){const r=6&n?ht(s,[2&n&&{params:t[1]},4&n&&vt(t[2])]):{};if(l!==(l=t[0])){if(e){lt();const t=e;ct(t.$$.fragment,1,0,(()=>{$t(t,1)})),at()}l?(e=new l(a()),e.$on("routeEvent",t[6]),pt(e.$$.fragment),it(e.$$.fragment,1),mt(e,o.parentNode,o)):e=null}else l&&e.$set(r)},i(t){r||(e&&it(e.$$.fragment,t),r=!0)},o(t){e&&ct(e.$$.fragment,t),r=!1},d(t){t&&y(o),e&&$t(e,t)}}}function Ct(t){let e,n,o,r;const s=[qt,kt],l=[];function a(t,e){return t[1]?0:1}return e=a(t),n=l[e]=s[e](t),{c(){n.c(),o=C()},m(t,n){l[e].m(t,n),w(t,o,n),r=!0},p(t,[r]){let i=e;e=a(t),e===i?l[e].p(t,r):(lt(),ct(l[i],1,1,(()=>{l[i]=null})),at(),n=l[e],n?n.p(t,r):(n=l[e]=s[e](t),n.c()),it(n,1),n.m(o.parentNode,o))},i(t){r||(it(n),r=!0)},o(t){ct(n),r=!1},d(t){l[e].d(t),t&&y(o)}}}function Et(){const t=window.location.href.indexOf("#/");let e=t>-1?window.location.href.substr(t+1):"/";const n=e.indexOf("?");let o="";return n>-1&&(o=e.substr(n+1),e=e.substr(0,n)),{location:e,querystring:o}}const jt=wt(null,(function(t){t(Et());const e=()=>{t(Et())};return window.addEventListener("hashchange",e,!1),function(){window.removeEventListener("hashchange",e,!1)}})),At=xt(jt,(t=>t.location));xt(jt,(t=>t.querystring));const St=yt(void 0);function Ot(t,e){if(e=Tt(e),!t||!t.tagName||"a"!=t.tagName.toLowerCase())throw Error('Action "link" can only be used with <a> tags');return Rt(t,e),{update(e){e=Tt(e),Rt(t,e)}}}function Rt(t,e){let n=e.href||t.getAttribute("href");if(n&&"/"==n.charAt(0))n="#"+n;else if(!n||n.length<2||"#/"!=n.slice(0,2))throw Error('Invalid value for "href" attribute: '+n);t.setAttribute("href",n),t.addEventListener("click",(t=>{t.preventDefault(),e.disabled||function(t){history.replaceState({...history.state,__svelte_spa_router_scrollX:window.scrollX,__svelte_spa_router_scrollY:window.scrollY},void 0,void 0),window.location.hash=t}(t.currentTarget.getAttribute("href"))}))}function Tt(t){return t&&"string"==typeof t?{href:t}:t||{}}function Lt(t,e,n){let{routes:o={}}=e,{prefix:r=""}=e,{restoreScrollState:s=!1}=e;class l{constructor(t,e){if(!e||"function"!=typeof e&&("object"!=typeof e||!0!==e._sveltesparouter))throw Error("Invalid component object");if(!t||"string"==typeof t&&(t.length<1||"/"!=t.charAt(0)&&"*"!=t.charAt(0))||"object"==typeof t&&!(t instanceof RegExp))throw Error('Invalid value for "path" argument - strings must start with / or *');const{pattern:n,keys:o}=function(t,e){if(t instanceof RegExp)return{keys:!1,pattern:t};var n,o,r,s,l=[],a="",i=t.split("/");for(i[0]||i.shift();r=i.shift();)"*"===(n=r[0])?(l.push("wild"),a+="/(.*)"):":"===n?(o=r.indexOf("?",1),s=r.indexOf(".",1),l.push(r.substring(1,~o?o:~s?s:r.length)),a+=~o&&!~s?"(?:/([^/]+?))?":"/([^/]+?)",~s&&(a+=(~o?"?":"")+"\\"+r.substring(s))):a+="/"+r;return{keys:l,pattern:new RegExp("^"+a+(e?"(?=$|/)":"/?$"),"i")}}(t);this.path=t,"object"==typeof e&&!0===e._sveltesparouter?(this.component=e.component,this.conditions=e.conditions||[],this.userData=e.userData,this.props=e.props||{}):(this.component=()=>Promise.resolve(e),this.conditions=[],this.props={}),this._pattern=n,this._keys=o}match(t){if(r)if("string"==typeof r){if(!t.startsWith(r))return null;t=t.substr(r.length)||"/"}else if(r instanceof RegExp){const e=t.match(r);if(!e||!e[0])return null;t=t.substr(e[0].length)||"/"}const e=this._pattern.exec(t);if(null===e)return null;if(!1===this._keys)return e;const n={};let o=0;for(;o<this._keys.length;){try{n[this._keys[o]]=decodeURIComponent(e[o+1]||"")||null}catch(t){n[this._keys[o]]=null}o++}return n}async checkConditions(t){for(let e=0;e<this.conditions.length;e++)if(!await this.conditions[e](t))return!1;return!0}}const a=[];o instanceof Map?o.forEach(((t,e)=>{a.push(new l(e,t))})):Object.keys(o).forEach((t=>{a.push(new l(t,o[t]))}));let i=null,c=null,u={};const f=F();async function d(t,e){await(J(),G),f(t,e)}let h=null,v=null;var p;s&&(v=t=>{h=t.state&&t.state.__svelte_spa_router_scrollY?t.state:null},window.addEventListener("popstate",v),p=()=>{h?window.scrollTo(h.__svelte_spa_router_scrollX,h.__svelte_spa_router_scrollY):window.scrollTo(0,0)},z().$$.after_update.push(p));let m=null,$=null;const g=jt.subscribe((async t=>{m=t;let e=0;for(;e<a.length;){const o=a[e].match(t.location);if(!o){e++;continue}const r={route:a[e].path,location:t.location,querystring:t.querystring,userData:a[e].userData,params:o&&"object"==typeof o&&Object.keys(o).length?o:null};if(!await a[e].checkConditions(r))return n(0,i=null),$=null,void d("conditionsFailed",r);d("routeLoading",Object.assign({},r));const s=a[e].component;if($!=s){s.loading?(n(0,i=s.loading),$=s,n(1,c=s.loadingParams),n(2,u={}),d("routeLoaded",Object.assign({},r,{component:i,name:i.name,params:c}))):(n(0,i=null),$=null);const e=await s();if(t!=m)return;n(0,i=e&&e.default||e),$=s}return o&&"object"==typeof o&&Object.keys(o).length?n(1,c=o):n(1,c=null),n(2,u=a[e].props),void d("routeLoaded",Object.assign({},r,{component:i,name:i.name,params:c})).then((()=>{St.set(c)}))}n(0,i=null),$=null,St.set(void 0)}));return function(t){z().$$.on_destroy.push(t)}((()=>{g(),v&&window.removeEventListener("popstate",v)})),t.$$set=t=>{"routes"in t&&n(3,o=t.routes),"prefix"in t&&n(4,r=t.prefix),"restoreScrollState"in t&&n(5,s=t.restoreScrollState)},t.$$.update=()=>{32&t.$$.dirty&&(history.scrollRestoration=s?"manual":"auto")},[i,c,u,o,r,s,function(e){Y.call(this,t,e)},function(e){Y.call(this,t,e)}]}class Nt extends _t{constructor(t){super(),gt(this,t,Lt,Ct,a,{routes:3,prefix:4,restoreScrollState:5})}}function Dt(t,{delay:n=0,duration:o=400,easing:r=e}={}){const s=+getComputedStyle(t).opacity;return{delay:n,duration:o,easing:r,css:t=>"opacity: "+t*s}}function It(e){let n,o,r,l,a,i,c,u,f,d,h,v,p,m,$,_,b,k,q;return{c(){n=x("select"),o=x("option"),o.textContent="通常（normal）",r=x("option"),r.textContent="比較（暗）（darken）",l=x("option"),l.textContent="乗算（multiply）",a=x("option"),a.textContent="焼き込み（color-burn）",i=x("option"),i.textContent="比較（明）（lighten）",c=x("option"),c.textContent="スクリーン（screen）",u=x("option"),u.textContent="覆い焼き（color-dodge）",f=x("option"),f.textContent="オーバーレイ（overlay）",d=x("option"),d.textContent="ソフトライト（soft-light）",h=x("option"),h.textContent="ハードライト（hard-light）",v=x("option"),v.textContent="差の絶対値（difference）",p=x("option"),p.textContent="除外（exclusion）",m=x("option"),m.textContent="色相（hue）",$=x("option"),$.textContent="彩度（saturation）",_=x("option"),_.textContent="カラー（color）",b=x("option"),b.textContent="輝度（luminosity）",o.__value="normal",o.value=o.__value,r.__value="darken",r.value=r.__value,l.__value="multiply",l.value=l.__value,a.__value="color-burn",a.value=a.__value,i.__value="lighten",i.value=i.__value,c.__value="screen",c.value=c.__value,u.__value="color-dodge",u.value=u.__value,f.__value="overlay",f.value=f.__value,d.__value="soft-light",d.value=d.__value,h.__value="hard-light",h.value=h.__value,v.__value="difference",v.value=v.__value,p.__value="exclusion",p.value=p.__value,m.__value="hue",m.value=m.__value,$.__value="saturation",$.value=$.__value,_.__value="color",_.value=_.__value,b.__value="luminosity",b.value=b.__value,j(n,"class","svelte-1osu7gw"),void 0===e[0]&&K((()=>e[2].call(n)))},m(t,s){w(t,n,s),g(n,o),g(n,r),g(n,l),g(n,a),g(n,i),g(n,c),g(n,u),g(n,f),g(n,d),g(n,h),g(n,v),g(n,p),g(n,m),g(n,$),g(n,_),g(n,b),R(n,e[0]),k||(q=[E(n,"change",e[2]),E(n,"change",e[1])],k=!0)},p(t,[e]){1&e&&R(n,t[0])},i:t,o:t,d(t){t&&y(n),k=!1,s(q)}}}function Pt(t,e,n){let{value:o}=e;const r=F();return t.$$set=t=>{"value"in t&&n(0,o=t.value)},[o,()=>{r("value",{name:o})},function(){o=function(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}(this),n(0,o)}]}class Xt extends _t{constructor(t){super(),gt(this,t,Pt,It,a,{value:0})}}function zt(e){let n,o,r,l,a,i;return{c(){n=x("label"),o=x("input"),r=q(),l=k(e[0]),j(o,"type","color"),j(o,"name","bgcolor"),j(o,"class","svelte-q1ocbv"),j(n,"for","bgcolor"),j(n,"class","svelte-q1ocbv")},m(t,s){w(t,n,s),g(n,o),S(o,e[0]),g(n,r),g(n,l),a||(i=[E(o,"input",e[2]),E(o,"change",e[1])],a=!0)},p(t,[e]){1&e&&S(o,t[0]),1&e&&A(l,t[0])},i:t,o:t,d(t){t&&y(n),a=!1,s(i)}}}function Ft(t,e,n){let{value:o}=e;const r=F();return t.$$set=t=>{"value"in t&&n(0,o=t.value)},[o,()=>{r("value",{name:o})},function(){o=this.value,n(0,o)}]}class Yt extends _t{constructor(t){super(),gt(this,t,Ft,zt,a,{value:0})}}function Bt(e){let n,o,r,s;return{c(){n=x("label"),o=x("input"),j(o,"type","file"),j(o,"accept","image/*"),j(o,"class","svelte-1n6p6dj"),j(n,"for","bgcolor"),j(n,"class","svelte-1n6p6dj")},m(t,l){w(t,n,l),g(n,o),r||(s=E(o,"change",e[0]),r=!0)},p:t,i:t,o:t,d(t){t&&y(n),r=!1,s()}}}function Mt(t){const e=F(),n=new FileReader;return[t=>{const o=t.target.files[0];o.type.match("image.*")&&(n.readAsDataURL(o),n.onload=()=>{e("value",{src:n.result})})}]}class Ut extends _t{constructor(t){super(),gt(this,t,Mt,Bt,a,{})}}function Wt(t){let e,n,o,r,s,l,a,i,c,u,f,d,h,v,p,m,$,_,b,k,C,A,S,R,T,L,N,D,I,P,X,z,F;return h=new Xt({props:{value:t[1]}}),h.$on("value",t[4]),_=new Yt({props:{value:t[2]}}),_.$on("value",t[5]),S=new Ut({}),S.$on("value",t[6]),{c(){e=x("main"),n=x("h1"),n.textContent="background blend mode sample",o=q(),r=x("div"),s=x("div"),l=x("div"),i=q(),c=x("div"),u=x("div"),f=x("h2"),f.textContent="描画モード",d=q(),pt(h.$$.fragment),v=q(),p=x("div"),m=x("h2"),m.textContent="背景色",$=q(),pt(_.$$.fragment),b=q(),k=x("div"),C=x("h2"),C.textContent="背景画像",A=q(),pt(S.$$.fragment),R=q(),T=x("div"),L=x("h2"),L.textContent="アニメーション",N=q(),D=x("button"),D.textContent="フェードイン",j(n,"class","title"),j(l,"class",a="bg "+(t[0]?"fadein":"hide")+" svelte-1kqho3i"),O(l,"background-blend-mode",t[1]),O(l,"background-color",t[2]),O(l,"background-image","url("+t[3]+")"),j(s,"class","img svelte-1kqho3i"),j(f,"class","row__title svelte-1kqho3i"),j(u,"class","row svelte-1kqho3i"),j(m,"class","row__title svelte-1kqho3i"),j(p,"class","row svelte-1kqho3i"),j(C,"class","row__title svelte-1kqho3i"),j(k,"class","row svelte-1kqho3i"),j(L,"class","row__title svelte-1kqho3i"),j(T,"class","row svelte-1kqho3i"),j(c,"class","dashbord"),j(r,"class","wrap svelte-1kqho3i")},m(a,y){w(a,e,y),g(e,n),g(e,o),g(e,r),g(r,s),g(s,l),g(r,i),g(r,c),g(c,u),g(u,f),g(u,d),mt(h,u,null),g(c,v),g(c,p),g(p,m),g(p,$),mt(_,p,null),g(c,b),g(c,k),g(k,C),g(k,A),mt(S,k,null),g(c,R),g(c,T),g(T,L),g(T,N),g(T,D),X=!0,z||(F=E(D,"click",t[7]),z=!0)},p(t,[e]){(!X||1&e&&a!==(a="bg "+(t[0]?"fadein":"hide")+" svelte-1kqho3i"))&&j(l,"class",a),(!X||2&e)&&O(l,"background-blend-mode",t[1]),(!X||4&e)&&O(l,"background-color",t[2]),(!X||8&e)&&O(l,"background-image","url("+t[3]+")");const n={};2&e&&(n.value=t[1]),h.$set(n);const o={};4&e&&(o.value=t[2]),_.$set(o)},i(t){X||(it(h.$$.fragment,t),it(_.$$.fragment,t),it(S.$$.fragment,t),K((()=>{P&&P.end(1),I=ft(e,Dt,{delay:500,duration:500}),I.start()})),X=!0)},o(t){ct(h.$$.fragment,t),ct(_.$$.fragment,t),ct(S.$$.fragment,t),I&&I.invalidate(),P=dt(e,Dt,{duration:500}),X=!1},d(t){t&&y(e),$t(h),$t(_),$t(S),t&&P&&P.end(),z=!1,F()}}}function Gt(t,e,n){let o=!0,r="multiply",s="#ff0000",l="/img/sample_img01.jpg";return[o,r,s,l,t=>{n(1,r=t.detail.name)},t=>{n(2,s=t.detail.name)},t=>{n(3,l=t.detail.src)},()=>{n(0,o=!1),setTimeout((()=>{n(0,o=!0)}),700)}]}class Ht extends _t{constructor(t){super(),gt(this,t,Gt,Wt,a,{})}}function Jt(e){let n,o,r,l;return{c(){n=x("label"),o=x("input"),j(o,"type","text"),j(o,"name","text"),j(o,"class","svelte-q1ocbv"),j(n,"for","text"),j(n,"class","svelte-q1ocbv")},m(t,s){w(t,n,s),g(n,o),S(o,e[0]),r||(l=[E(o,"input",e[2]),E(o,"change",e[1])],r=!0)},p(t,[e]){1&e&&o.value!==t[0]&&S(o,t[0])},i:t,o:t,d(t){t&&y(n),r=!1,s(l)}}}function Kt(t,e,n){let{value:o}=e;const r=F();return t.$$set=t=>{"value"in t&&n(0,o=t.value)},[o,()=>{r("value",{name:o})},function(){o=this.value,n(0,o)}]}class Qt extends _t{constructor(t){super(),gt(this,t,Kt,Jt,a,{value:0})}}function Vt(t){let e,n,o,r,l,a,i,u,f,d,h,v,p,m,$,_,b,C,S,R,T,L,N,D,I,P,X,z,F,Y,B,M,U,W,G,H,J,Q,V,Z,tt,et,nt,ot,rt,st,lt,at,ut,ht,vt,gt,_t,bt,wt,yt,xt,kt,qt;return S=new Xt({props:{value:t[2]}}),S.$on("value",t[8]),D=new Yt({props:{value:t[4]}}),D.$on("value",t[10]),F=new Yt({props:{value:t[5]}}),F.$on("value",t[11]),W=new Qt({props:{value:t[6]}}),W.$on("value",t[12]),V=new Yt({props:{value:t[3]}}),V.$on("value",t[9]),ot=new Ut({}),ot.$on("value",t[13]),{c(){e=x("main"),n=x("h1"),n.textContent="mix blend mode sample",o=q(),r=x("div"),l=x("div"),a=x("div"),i=x("span"),u=k(t[6]),d=q(),h=x("img"),m=q(),$=x("div"),_=x("div"),b=x("h2"),b.textContent="描画モード",C=q(),pt(S.$$.fragment),R=q(),T=x("div"),L=x("h2"),L.textContent="テキスト背景色",N=q(),pt(D.$$.fragment),I=q(),P=x("div"),X=x("h2"),X.textContent="テキスト色",z=q(),pt(F.$$.fragment),Y=q(),B=x("div"),M=x("h2"),M.textContent="テキスト",U=q(),pt(W.$$.fragment),G=q(),H=x("div"),J=x("h2"),J.textContent="背景色",Q=q(),pt(V.$$.fragment),Z=q(),tt=x("div"),et=x("h2"),et.textContent="背景画像",nt=q(),pt(ot.$$.fragment),rt=q(),st=x("div"),lt=x("h2"),lt.textContent="全体アニメーション",at=q(),ut=x("button"),ut.textContent="フェードイン",ht=q(),vt=x("div"),gt=x("h2"),gt.textContent="文字だけアニメーション",_t=q(),bt=x("button"),bt.textContent="フェードイン",j(n,"class","title"),j(i,"class",f="overtxt "+(t[1]?"fadein":"hide")+" svelte-12c1qho"),O(i,"color",t[5]),O(i,"background-color",t[4]),O(i,"mix-blend-mode",t[2]),c(h.src,v=t[7])||j(h,"src",v),j(h,"alt",""),j(h,"class","svelte-12c1qho"),j(a,"class",p="inner "+(t[0]?"fadein":"hide")+" svelte-12c1qho"),O(a,"background-color",t[3]),j(l,"class","img svelte-12c1qho"),j(b,"class","row__title svelte-12c1qho"),j(_,"class","row svelte-12c1qho"),j(L,"class","row__title svelte-12c1qho"),j(T,"class","row svelte-12c1qho"),j(X,"class","row__title svelte-12c1qho"),j(P,"class","row svelte-12c1qho"),j(B,"class","row svelte-12c1qho"),j(J,"class","row__title svelte-12c1qho"),j(H,"class","row svelte-12c1qho"),j(et,"class","row__title svelte-12c1qho"),j(tt,"class","row svelte-12c1qho"),j(lt,"class","row__title svelte-12c1qho"),j(st,"class","row svelte-12c1qho"),j(gt,"class","row__title svelte-12c1qho"),j(vt,"class","row svelte-12c1qho"),j($,"class","dashbord"),j(r,"class","wrap svelte-12c1qho")},m(s,c){w(s,e,c),g(e,n),g(e,o),g(e,r),g(r,l),g(l,a),g(a,i),g(i,u),g(a,d),g(a,h),g(r,m),g(r,$),g($,_),g(_,b),g(_,C),mt(S,_,null),g($,R),g($,T),g(T,L),g(T,N),mt(D,T,null),g($,I),g($,P),g(P,X),g(P,z),mt(F,P,null),g($,Y),g($,B),g(B,M),g(B,U),mt(W,B,null),g($,G),g($,H),g(H,J),g(H,Q),mt(V,H,null),g($,Z),g($,tt),g(tt,et),g(tt,nt),mt(ot,tt,null),g($,rt),g($,st),g(st,lt),g(st,at),g(st,ut),g($,ht),g($,vt),g(vt,gt),g(vt,_t),g(vt,bt),xt=!0,kt||(qt=[E(ut,"click",t[14]),E(bt,"click",t[15])],kt=!0)},p(t,[e]){(!xt||64&e)&&A(u,t[6]),(!xt||2&e&&f!==(f="overtxt "+(t[1]?"fadein":"hide")+" svelte-12c1qho"))&&j(i,"class",f),(!xt||32&e)&&O(i,"color",t[5]),(!xt||16&e)&&O(i,"background-color",t[4]),(!xt||4&e)&&O(i,"mix-blend-mode",t[2]),(!xt||128&e&&!c(h.src,v=t[7]))&&j(h,"src",v),(!xt||1&e&&p!==(p="inner "+(t[0]?"fadein":"hide")+" svelte-12c1qho"))&&j(a,"class",p),(!xt||8&e)&&O(a,"background-color",t[3]);const n={};4&e&&(n.value=t[2]),S.$set(n);const o={};16&e&&(o.value=t[4]),D.$set(o);const r={};32&e&&(r.value=t[5]),F.$set(r);const s={};64&e&&(s.value=t[6]),W.$set(s);const l={};8&e&&(l.value=t[3]),V.$set(l)},i(t){xt||(it(S.$$.fragment,t),it(D.$$.fragment,t),it(F.$$.fragment,t),it(W.$$.fragment,t),it(V.$$.fragment,t),it(ot.$$.fragment,t),K((()=>{yt&&yt.end(1),wt=ft(e,Dt,{delay:500,duration:500}),wt.start()})),xt=!0)},o(t){ct(S.$$.fragment,t),ct(D.$$.fragment,t),ct(F.$$.fragment,t),ct(W.$$.fragment,t),ct(V.$$.fragment,t),ct(ot.$$.fragment,t),wt&&wt.invalidate(),yt=dt(e,Dt,{duration:500}),xt=!1},d(t){t&&y(e),$t(S),$t(D),$t(F),$t(W),$t(V),$t(ot),t&&yt&&yt.end(),kt=!1,s(qt)}}}function Zt(t,e,n){let o=!0,r=!0,s="multiply",l="#ffffff",a="#ff0000",i="#ffffff",c="TEXTTEXTTEXT",u="/img/sample_img01.jpg";return[o,r,s,l,a,i,c,u,t=>{n(2,s=t.detail.name)},t=>{n(3,l=t.detail.name)},t=>{n(4,a=t.detail.name)},t=>{n(5,i=t.detail.name)},t=>{n(6,c=t.detail.name)},t=>{n(7,u=t.detail.src)},()=>{n(0,o=!1),setTimeout((()=>{n(0,o=!0)}),700)},()=>{n(1,r=!1),setTimeout((()=>{n(1,r=!0)}),700)}]}class te extends _t{constructor(t){super(),gt(this,t,Zt,Vt,a,{})}}function ee(t){let e,n,o,r,l,a,i,c,u,d,h,v,p,m;return h=new Nt({props:{routes:t[1]}}),{c(){e=x("div"),n=x("div"),o=x("a"),r=k("mix-blend-mode sample"),a=q(),i=x("a"),c=k("background-blend-mode sample"),d=q(),pt(h.$$.fragment),j(o,"data-current",l="/"===t[0]?"true":"false"),j(o,"class","svelte-1p7yv5h"),j(i,"data-current",u="/bg/"===t[0]?"true":"false"),j(i,"class","svelte-1p7yv5h"),j(n,"class","nav svelte-1p7yv5h"),j(e,"class","wrap")},m(t,s){w(t,e,s),g(e,n),g(n,o),g(o,r),g(n,a),g(n,i),g(i,c),g(e,d),mt(h,e,null),v=!0,p||(m=[f(Ot.call(null,o,{href:"/",disabled:!1})),f(Ot.call(null,i,{href:"/bg/",disabled:!1}))],p=!0)},p(t,[e]){(!v||1&e&&l!==(l="/"===t[0]?"true":"false"))&&j(o,"data-current",l),(!v||1&e&&u!==(u="/bg/"===t[0]?"true":"false"))&&j(i,"data-current",u)},i(t){v||(it(h.$$.fragment,t),v=!0)},o(t){ct(h.$$.fragment,t),v=!1},d(t){t&&y(e),$t(h),p=!1,s(m)}}}function ne(t,e,n){let o;var r,s;r=At,s=t=>n(0,o=t),t.$$.on_destroy.push(u(r,s));return[o,{"/":te,"/bg/":Ht}]}return new class extends _t{constructor(t){super(),gt(this,t,ne,ee,a,{})}}({target:document.getElementById("app")})}();
//# sourceMappingURL=bundle.js.map
