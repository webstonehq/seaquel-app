var ge=Object.defineProperty;var ae=t=>{throw TypeError(t)};var be=(t,e,r)=>e in t?ge(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var P=(t,e,r)=>be(t,typeof e!="symbol"?e+"":e,r),ue=(t,e,r)=>e.has(t)||ae("Cannot "+r);var i=(t,e,r)=>(ue(t,e,"read from private field"),r?r.call(t):e.get(t)),k=(t,e,r)=>e.has(t)?ae("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r);var V=(t,e,r)=>(ue(t,e,"access private method"),r);import"./Bzak7iHL.js";import{aN as ve,aO as ye,aP as Ce,e as p,g as l,i as y,p as B,f as w,a as H,s as xe,c as he,j as se,r as le}from"./BxxYrwFR.js";import{c as D,a as C,p as _e,f as ne}from"./DY2YC4jf.js";import{s as K,a as Re}from"./WuvbgBPC.js";import{i as Q,s as X,p as f,r as Y}from"./B2MWjQ7Q.js";import{I as fe}from"./FiK77Txc.js";import{c as we}from"./DWAeFBRz.js";import{C as pe,a as qe,w as ee,E as De,S as Ne,b as ce,d as de,g as Pe,f as Se,i as Me,h as Ee,j as g,m as Ae,c as Oe}from"./CjpTkMXu.js";import{i as Te}from"./BJoTzpVv.js";import{H as Ie}from"./DDDYxoq7.js";import{d as je}from"./oFyp6dom.js";const ze=[];function Be(t,e=!1,r=!1){return W(t,new Map,"",ze,null,r)}function W(t,e,r,s,n=null,d=!1){if(typeof t=="object"&&t!==null){var o=e.get(t);if(o!==void 0)return o;if(t instanceof Map)return new Map(t);if(t instanceof Set)return new Set(t);if(ve(t)){var a=Array(t.length);e.set(t,a),n!==null&&e.set(n,a);for(var h=0;h<t.length;h+=1){var N=t[h];h in t&&(a[h]=W(N,e,r,s,null,d))}return a}if(ye(t)===Ce){a={},e.set(t,a),n!==null&&e.set(n,a);for(var b in t)a[b]=W(t[b],e,r,s,null,d);return a}if(t instanceof Date)return structuredClone(t);if(typeof t.toJSON=="function"&&!d)return W(t.toJSON(),e,r,s,t)}if(t instanceof EventTarget)return t;try{return structuredClone(t)}catch{return t}}const He=Se({component:"checkbox",parts:["root","group","group-label","input"]}),Le=new pe("Checkbox.Group"),me=new pe("Checkbox.Root");var S,M,E,A,q,F,O,T;const ie=class ie{constructor(e,r){k(this,q);P(this,"opts");P(this,"group");k(this,S,p(()=>this.group&&this.group.opts.name.current?this.group.opts.name.current:this.opts.name.current));k(this,M,p(()=>this.group&&this.group.opts.required.current?!0:this.opts.required.current));k(this,E,p(()=>this.group&&this.group.opts.disabled.current?!0:this.opts.disabled.current));k(this,A,p(()=>this.group&&this.group.opts.readonly.current?!0:this.opts.readonly.current));P(this,"attachment");k(this,O,p(()=>({checked:this.opts.checked.current,indeterminate:this.opts.indeterminate.current})));k(this,T,p(()=>({id:this.opts.id.current,role:"checkbox",type:this.opts.type.current,disabled:this.trueDisabled,"aria-checked":Pe(this.opts.checked.current,this.opts.indeterminate.current),"aria-required":de(this.trueRequired),"aria-readonly":de(this.trueReadonly),"data-disabled":ce(this.trueDisabled),"data-readonly":ce(this.trueReadonly),"data-state":Ge(this.opts.checked.current,this.opts.indeterminate.current),[He.root]:"",onclick:this.onclick,onkeydown:this.onkeydown,...this.attachment})));this.opts=e,this.group=r,this.attachment=qe(this.opts.ref),this.onkeydown=this.onkeydown.bind(this),this.onclick=this.onclick.bind(this),ee.pre([()=>{var s;return Be((s=this.group)==null?void 0:s.opts.value.current)},()=>this.opts.value.current],([s,n])=>{!s||!n||(this.opts.checked.current=s.includes(n))}),ee.pre(()=>this.opts.checked.current,s=>{var n,d;this.group&&(s?(n=this.group)==null||n.addValue(this.opts.value.current):(d=this.group)==null||d.removeValue(this.opts.value.current))})}static create(e,r=null){return me.set(new ie(e,r))}get trueName(){return l(i(this,S))}set trueName(e){y(i(this,S),e)}get trueRequired(){return l(i(this,M))}set trueRequired(e){y(i(this,M),e)}get trueDisabled(){return l(i(this,E))}set trueDisabled(e){y(i(this,E),e)}get trueReadonly(){return l(i(this,A))}set trueReadonly(e){y(i(this,A),e)}onkeydown(e){this.trueDisabled||this.trueReadonly||(e.key===De&&e.preventDefault(),e.key===Ne&&(e.preventDefault(),V(this,q,F).call(this)))}onclick(e){if(!(this.trueDisabled||this.trueReadonly)){if(this.opts.type.current==="submit"){V(this,q,F).call(this);return}e.preventDefault(),V(this,q,F).call(this)}}get snippetProps(){return l(i(this,O))}set snippetProps(e){y(i(this,O),e)}get props(){return l(i(this,T))}set props(e){y(i(this,T),e)}};S=new WeakMap,M=new WeakMap,E=new WeakMap,A=new WeakMap,q=new WeakSet,F=function(){this.opts.indeterminate.current?(this.opts.indeterminate.current=!1,this.opts.checked.current=!0):this.opts.checked.current=!this.opts.checked.current},O=new WeakMap,T=new WeakMap;let te=ie;var I,j,z;const oe=class oe{constructor(e){P(this,"root");k(this,I,p(()=>this.root.group?!!(this.root.opts.value.current!==void 0&&this.root.group.opts.value.current.includes(this.root.opts.value.current)):this.root.opts.checked.current));k(this,j,p(()=>!!this.root.trueName));k(this,z,p(()=>({type:"checkbox",checked:this.root.opts.checked.current===!0,disabled:this.root.trueDisabled,required:this.root.trueRequired,name:this.root.trueName,value:this.root.opts.value.current,readonly:this.root.trueReadonly,onfocus:this.onfocus})));this.root=e,this.onfocus=this.onfocus.bind(this)}static create(){return new oe(me.get())}get trueChecked(){return l(i(this,I))}set trueChecked(e){y(i(this,I),e)}get shouldRender(){return l(i(this,j))}set shouldRender(e){y(i(this,j),e)}onfocus(e){Me(this.root.opts.ref.current)&&this.root.opts.ref.current.focus()}get props(){return l(i(this,z))}set props(e){y(i(this,z),e)}};I=new WeakMap,j=new WeakMap,z=new WeakMap;let re=oe;function Ge(t,e){return e?"indeterminate":t?"checked":"unchecked"}function Je(t,e){B(e,!1);const r=re.create();Te();var s=D(),n=w(s);{var d=o=>{Ie(o,X(()=>r.props))};Q(n,o=>{r.shouldRender&&o(d)})}C(t,s),H()}var Ue=ne("<button><!></button>"),Ve=ne("<!> <!>",1);function We(t,e){const r=_e();B(e,!0);let s=f(e,"checked",15,!1),n=f(e,"ref",15,null),d=f(e,"disabled",3,!1),o=f(e,"required",3,!1),a=f(e,"name",3,void 0),h=f(e,"value",3,"on"),N=f(e,"id",19,()=>Ee(r)),b=f(e,"indeterminate",15,!1),m=f(e,"type",3,"button"),v=Y(e,["$$slots","$$events","$$legacy","checked","ref","onCheckedChange","children","disabled","required","name","value","id","indeterminate","onIndeterminateChange","child","type","readonly"]);const _=Le.getOr(null);_&&h()&&(_.opts.value.current.includes(h())?s(!0):s(!1)),ee.pre(()=>h(),()=>{_&&h()&&(_.opts.value.current.includes(h())?s(!0):s(!1))});const R=te.create({checked:g(()=>s(),c=>{var u;s(c),(u=e.onCheckedChange)==null||u.call(e,c)}),disabled:g(()=>d()??!1),required:g(()=>o()),name:g(()=>a()),value:g(()=>h()),id:g(()=>N()),ref:g(()=>n(),c=>n(c)),indeterminate:g(()=>b(),c=>{var u;b(c),(u=e.onIndeterminateChange)==null||u.call(e,c)}),type:g(()=>m()),readonly:g(()=>!!e.readonly)},_),L=p(()=>Ae({...v},R.props));var G=Ve(),J=w(G);{var x=c=>{var u=D(),$=w(u);{let ke=p(()=>({props:l(L),...R.snippetProps}));K($,()=>e.child,()=>l(ke))}C(c,u)},U=c=>{var u=Ue();Re(u,()=>({...l(L)}));var $=he(u);K($,()=>e.children??se,()=>R.snippetProps),le(u),C(c,u)};Q(J,c=>{e.child?c(x):c(U,!1)})}var Z=xe(J,2);Je(Z,{}),C(t,G),H()}function Fe(t,e){B(e,!0);/**
 * @license @lucide/svelte v0.561.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=Y(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"M5 12h14"}]];fe(t,X({name:"minus"},()=>r,{get iconNode(){return s},children:(n,d)=>{var o=D(),a=w(o);K(a,()=>e.children??se),C(n,o)},$$slots:{default:!0}})),H()}function at(t,e){B(e,!0);/**
 * @license @lucide/svelte v0.561.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=Y(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]];fe(t,X({name:"link"},()=>r,{get iconNode(){return s},children:(n,d)=>{var o=D(),a=w(o);K(a,()=>e.children??se),C(n,o)},$$slots:{default:!0}})),H()}var Ke=ne('<div data-slot="checkbox-indicator" class="text-current transition-none"><!></div>');function ut(t,e){B(e,!0);let r=f(e,"ref",15,null),s=f(e,"checked",15,!1),n=f(e,"indeterminate",15,!1),d=Y(e,["$$slots","$$events","$$legacy","ref","checked","indeterminate","class"]);var o=D(),a=w(o);{const h=(b,m)=>{let v=()=>m==null?void 0:m().checked,_=()=>m==null?void 0:m().indeterminate;var R=Ke(),L=he(R);{var G=x=>{je(x,{class:"size-3.5"})},J=x=>{var U=D(),Z=w(U);{var c=u=>{Fe(u,{class:"size-3.5"})};Q(Z,u=>{_()&&u(c)},!0)}C(x,U)};Q(L,x=>{v()?x(G):x(J,!1)})}le(R),C(b,R)};let N=p(()=>Oe("border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e.class));we(a,()=>We,(b,m)=>{m(b,X({"data-slot":"checkbox",get class(){return l(N)}},()=>d,{get ref(){return r()},set ref(v){r(v)},get checked(){return s()},set checked(v){s(v)},get indeterminate(){return n()},set indeterminate(v){n(v)},children:h,$$slots:{default:!0}}))})}C(t,o),H()}export{ut as C,at as L,Be as s};
