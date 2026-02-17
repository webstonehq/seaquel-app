var be=Object.defineProperty;var ae=t=>{throw TypeError(t)};var ge=(t,e,r)=>e in t?be(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var P=(t,e,r)=>ge(t,typeof e!="symbol"?e+"":e,r),ce=(t,e,r)=>e.has(t)||ae("Cannot "+r);var o=(t,e,r)=>(ce(t,e,"read from private field"),r?r.call(t):e.get(t)),k=(t,e,r)=>e.has(t)?ae("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r);var U=(t,e,r)=>(ce(t,e,"access private method"),r);import{aN as ye,aO as ve,aP as Ce,w as xe,y as _e,x as Re,aw as we,aQ as qe,i as p,g as l,e as v,p as B,f as w,a as H,s as De,c as he,j as se,r as le}from"./DRf2hNXU.js";import"./Bzak7iHL.js";import{c as D,a as C,p as Ne,f as ne}from"./DX5cEFxE.js";import{s as F,a as Pe}from"./2Cr_4CmO.js";import{i as K,s as X,p as f,r as Y}from"./aDXV6Exz.js";import{I as fe}from"./CI288gE-.js";import{c as Se}from"./D1iuA4Ue.js";import{C as pe,a as Me,w as ee,E as Ee,S as Ae,b as ue,d as de,g as Oe,f as Te,i as Ie,h as je,j as b,m as ze,c as Be}from"./DTjK8k01.js";import{i as He}from"./DV1rtAfS.js";import{H as Le}from"./DKyZcWik.js";import{e as Ge}from"./QVs9Bxxu.js";const Je=[];function Qe(t,e=!1,r=!1){return V(t,new Map,"",Je,null,r)}function V(t,e,r,s,n=null,a=!1){if(typeof t=="object"&&t!==null){var i=e.get(t);if(i!==void 0)return i;if(t instanceof Map)return new Map(t);if(t instanceof Set)return new Set(t);if(ye(t)){var c=Array(t.length);e.set(t,c),n!==null&&e.set(n,c);for(var h=0;h<t.length;h+=1){var N=t[h];h in t&&(c[h]=V(N,e,r,s,null,a))}return c}if(ve(t)===Ce){c={},e.set(t,c),n!==null&&e.set(n,c);for(var g in t)c[g]=V(t[g],e,r,s,null,a);return c}if(t instanceof Date)return structuredClone(t);if(typeof t.toJSON=="function"&&!a)return V(t.toJSON(),e,r,s,t)}if(t instanceof EventTarget)return t;try{return structuredClone(t)}catch{return t}}function lt(t,e,r){xe(()=>{var s=_e(()=>e(t,r==null?void 0:r())||{});if(r&&(s!=null&&s.update)){var n=!1,a={};Re(()=>{var i=r();we(i),n&&qe(a,i)&&(a=i,s.update(i))}),n=!0}if(s!=null&&s.destroy)return()=>s.destroy()})}const Ue=Te({component:"checkbox",parts:["root","group","group-label","input"]}),Ve=new pe("Checkbox.Group"),me=new pe("Checkbox.Root");var S,M,E,A,q,W,O,T;const ie=class ie{constructor(e,r){k(this,q);P(this,"opts");P(this,"group");k(this,S,p(()=>this.group&&this.group.opts.name.current?this.group.opts.name.current:this.opts.name.current));k(this,M,p(()=>this.group&&this.group.opts.required.current?!0:this.opts.required.current));k(this,E,p(()=>this.group&&this.group.opts.disabled.current?!0:this.opts.disabled.current));k(this,A,p(()=>this.group&&this.group.opts.readonly.current?!0:this.opts.readonly.current));P(this,"attachment");k(this,O,p(()=>({checked:this.opts.checked.current,indeterminate:this.opts.indeterminate.current})));k(this,T,p(()=>({id:this.opts.id.current,role:"checkbox",type:this.opts.type.current,disabled:this.trueDisabled,"aria-checked":Oe(this.opts.checked.current,this.opts.indeterminate.current),"aria-required":de(this.trueRequired),"aria-readonly":de(this.trueReadonly),"data-disabled":ue(this.trueDisabled),"data-readonly":ue(this.trueReadonly),"data-state":We(this.opts.checked.current,this.opts.indeterminate.current),[Ue.root]:"",onclick:this.onclick,onkeydown:this.onkeydown,...this.attachment})));this.opts=e,this.group=r,this.attachment=Me(this.opts.ref),this.onkeydown=this.onkeydown.bind(this),this.onclick=this.onclick.bind(this),ee.pre([()=>{var s;return Qe((s=this.group)==null?void 0:s.opts.value.current)},()=>this.opts.value.current],([s,n])=>{!s||!n||(this.opts.checked.current=s.includes(n))}),ee.pre(()=>this.opts.checked.current,s=>{var n,a;this.group&&(s?(n=this.group)==null||n.addValue(this.opts.value.current):(a=this.group)==null||a.removeValue(this.opts.value.current))})}static create(e,r=null){return me.set(new ie(e,r))}get trueName(){return l(o(this,S))}set trueName(e){v(o(this,S),e)}get trueRequired(){return l(o(this,M))}set trueRequired(e){v(o(this,M),e)}get trueDisabled(){return l(o(this,E))}set trueDisabled(e){v(o(this,E),e)}get trueReadonly(){return l(o(this,A))}set trueReadonly(e){v(o(this,A),e)}onkeydown(e){this.trueDisabled||this.trueReadonly||(e.key===Ee&&e.preventDefault(),e.key===Ae&&(e.preventDefault(),U(this,q,W).call(this)))}onclick(e){if(!(this.trueDisabled||this.trueReadonly)){if(this.opts.type.current==="submit"){U(this,q,W).call(this);return}e.preventDefault(),U(this,q,W).call(this)}}get snippetProps(){return l(o(this,O))}set snippetProps(e){v(o(this,O),e)}get props(){return l(o(this,T))}set props(e){v(o(this,T),e)}};S=new WeakMap,M=new WeakMap,E=new WeakMap,A=new WeakMap,q=new WeakSet,W=function(){this.opts.indeterminate.current?(this.opts.indeterminate.current=!1,this.opts.checked.current=!0):this.opts.checked.current=!this.opts.checked.current},O=new WeakMap,T=new WeakMap;let te=ie;var I,j,z;const oe=class oe{constructor(e){P(this,"root");k(this,I,p(()=>this.root.group?!!(this.root.opts.value.current!==void 0&&this.root.group.opts.value.current.includes(this.root.opts.value.current)):this.root.opts.checked.current));k(this,j,p(()=>!!this.root.trueName));k(this,z,p(()=>({type:"checkbox",checked:this.root.opts.checked.current===!0,disabled:this.root.trueDisabled,required:this.root.trueRequired,name:this.root.trueName,value:this.root.opts.value.current,readonly:this.root.trueReadonly,onfocus:this.onfocus})));this.root=e,this.onfocus=this.onfocus.bind(this)}static create(){return new oe(me.get())}get trueChecked(){return l(o(this,I))}set trueChecked(e){v(o(this,I),e)}get shouldRender(){return l(o(this,j))}set shouldRender(e){v(o(this,j),e)}onfocus(e){Ie(this.root.opts.ref.current)&&this.root.opts.ref.current.focus()}get props(){return l(o(this,z))}set props(e){v(o(this,z),e)}};I=new WeakMap,j=new WeakMap,z=new WeakMap;let re=oe;function We(t,e){return e?"indeterminate":t?"checked":"unchecked"}function Fe(t,e){B(e,!1);const r=re.create();He();var s=D(),n=w(s);{var a=i=>{Le(i,X(()=>r.props))};K(n,i=>{r.shouldRender&&i(a)})}C(t,s),H()}var Ke=ne("<button><!></button>"),Xe=ne("<!> <!>",1);function Ye(t,e){const r=Ne();B(e,!0);let s=f(e,"checked",15,!1),n=f(e,"ref",15,null),a=f(e,"disabled",3,!1),i=f(e,"required",3,!1),c=f(e,"name",3,void 0),h=f(e,"value",3,"on"),N=f(e,"id",19,()=>je(r)),g=f(e,"indeterminate",15,!1),m=f(e,"type",3,"button"),y=Y(e,["$$slots","$$events","$$legacy","checked","ref","onCheckedChange","children","disabled","required","name","value","id","indeterminate","onIndeterminateChange","child","type","readonly"]);const _=Ve.getOr(null);_&&h()&&(_.opts.value.current.includes(h())?s(!0):s(!1)),ee.pre(()=>h(),()=>{_&&h()&&(_.opts.value.current.includes(h())?s(!0):s(!1))});const R=te.create({checked:b(()=>s(),d=>{var u;s(d),(u=e.onCheckedChange)==null||u.call(e,d)}),disabled:b(()=>a()??!1),required:b(()=>i()),name:b(()=>c()),value:b(()=>h()),id:b(()=>N()),ref:b(()=>n(),d=>n(d)),indeterminate:b(()=>g(),d=>{var u;g(d),(u=e.onIndeterminateChange)==null||u.call(e,d)}),type:b(()=>m()),readonly:b(()=>!!e.readonly)},_),L=p(()=>ze({...y},R.props));var G=Xe(),J=w(G);{var x=d=>{var u=D(),$=w(u);{let ke=p(()=>({props:l(L),...R.snippetProps}));F($,()=>e.child,()=>l(ke))}C(d,u)},Q=d=>{var u=Ke();Pe(u,()=>({...l(L)}));var $=he(u);F($,()=>e.children??se,()=>R.snippetProps),le(u),C(d,u)};K(J,d=>{e.child?d(x):d(Q,!1)})}var Z=De(J,2);Fe(Z,{}),C(t,G),H()}function Ze(t,e){B(e,!0);/**
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
 */let r=Y(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"M5 12h14"}]];fe(t,X({name:"minus"},()=>r,{get iconNode(){return s},children:(n,a)=>{var i=D(),c=w(i);F(c,()=>e.children??se),C(n,i)},$$slots:{default:!0}})),H()}function ft(t,e){B(e,!0);/**
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
 */let r=Y(e,["$$slots","$$events","$$legacy"]);const s=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]];fe(t,X({name:"link"},()=>r,{get iconNode(){return s},children:(n,a)=>{var i=D(),c=w(i);F(c,()=>e.children??se),C(n,i)},$$slots:{default:!0}})),H()}var $e=ne('<div data-slot="checkbox-indicator" class="text-current transition-none"><!></div>');function pt(t,e){B(e,!0);let r=f(e,"ref",15,null),s=f(e,"checked",15,!1),n=f(e,"indeterminate",15,!1),a=Y(e,["$$slots","$$events","$$legacy","ref","checked","indeterminate","class"]);var i=D(),c=w(i);{const h=(g,m)=>{let y=()=>m==null?void 0:m().checked,_=()=>m==null?void 0:m().indeterminate;var R=$e(),L=he(R);{var G=x=>{Ge(x,{class:"size-3.5"})},J=x=>{var Q=D(),Z=w(Q);{var d=u=>{Ze(u,{class:"size-3.5"})};K(Z,u=>{_()&&u(d)},!0)}C(x,Q)};K(L,x=>{y()?x(G):x(J,!1)})}le(R),C(g,R)};let N=p(()=>Be("border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e.class));Se(c,()=>Ye,(g,m)=>{m(g,X({"data-slot":"checkbox",get class(){return l(N)}},()=>a,{get ref(){return r()},set ref(y){r(y)},get checked(){return s()},set checked(y){s(y)},get indeterminate(){return n()},set indeterminate(y){n(y)},children:h,$$slots:{default:!0}}))})}C(t,i),H()}export{pt as C,ft as L,lt as a,Qe as s};
