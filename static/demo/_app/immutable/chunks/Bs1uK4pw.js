var ut=Object.defineProperty;var Re=r=>{throw TypeError(r)};var dt=(r,e,t)=>e in r?ut(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Ne=(r,e,t)=>dt(r,typeof e!="symbol"?e+"":e,t),_t=(r,e,t)=>e.has(r)||Re("Cannot "+t);var _=(r,e,t)=>(_t(r,e,"read from private field"),t?t.call(r):e.get(r)),L=(r,e,t)=>e.has(r)?Re("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t);import"./Bzak7iHL.js";import{p as h,f as d,j as k,a as m,c as V,r as z,n as E,t as q,g as o,i as re,s as g,h as N,aj as Le,u as ft,e as p,b3 as pt}from"./DRf2hNXU.js";import{c as v,a as i,f as C,t as F}from"./DX5cEFxE.js";import{s as P,a as Ze}from"./2Cr_4CmO.js";import{s as M,r as w,p as be,i as Te}from"./aDXV6Exz.js";import{I as T}from"./CI288gE-.js";import{s as b}from"./pFsZhDdW.js";import{c as $e,e as Ae,v as We,B as He}from"./DTjK8k01.js";import{b as Xe,c as Ce}from"./D1iuA4Ue.js";import{g as vt,i as ht}from"./C4u9_qBb.js";import{g as S}from"./CluvpHAZ.js";import{u as mt,j as yt,D as gt,m as $t,n as qt,o as bt,p as kt,q as Pt,r as wt,v as St,w as xt,x as It,S as Ot,y as Dt,z as Nt,A as Ct,E as Mt,l as Tt}from"./QVs9Bxxu.js";import{L as Me,I as Ke}from"./DKyZcWik.js";import{f as At,l as qe,h as Lt}from"./4RHrTr5V.js";function pa(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];T(r,M({name:"info"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}var Vt=C("<kbd><!></kbd>");function Ue(r,e){h(e,!0);let t=be(e,"ref",15,null),n=w(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Vt();Ze(a,s=>({"data-slot":"kbd",class:s,...n}),[()=>$e("bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none","[&_svg:not([class*='size-'])]:size-3","[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",e.class)]);var u=V(a);P(u,()=>e.children??k),z(a),Xe(a,s=>t(s),()=>t()),i(r,a),m()}var zt=C("<kbd><!></kbd>");function Et(r,e){h(e,!0);let t=be(e,"ref",15,null),n=w(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=zt();Ze(a,s=>({"data-slot":"kbd-group",class:s,...n}),[()=>$e("inline-flex items-center gap-1",e.class)]);var u=V(a);P(u,()=>e.children??k),z(a),Xe(a,s=>t(s),()=>t()),i(r,a),m()}var Ft=C('<span class="text-muted-foreground">+</span>'),Bt=C("<!> <!>",1);function va(r,e){h(e,!0);let t=be(e,"class",3,"");const n=vt(),a=re(()=>{const f=[];e.keys.mod&&f.push(n.mod),e.keys.ctrl&&f.push(n.ctrl),e.keys.alt&&f.push(n.alt),e.keys.shift&&f.push(n.shift);let c=e.keys.key;return c==="Enter"?c=n.enter:c==="Backspace"?c=n.backspace:c==="Delete"?c=n.delete:c==="Escape"?c=n.escape:c==="Tab"?c=n.tab:c.length===1&&(c=c.toUpperCase()),f.push(c),f});var u=v(),s=d(u);{var l=f=>{var c=v(),x=d(c);{let U=re(()=>$e(t()));Ce(x,()=>Ue,(A,W)=>{W(A,{get class(){return o(U)},children:(H,X)=>{E();var G=F();q(Y=>b(G,Y),[()=>o(a).join("")]),i(H,G)},$$slots:{default:!0}})})}i(f,c)},K=f=>{var c=v(),x=d(c);{let U=re(()=>$e(t()));Ce(x,()=>Et,(A,W)=>{W(A,{get class(){return o(U)},children:(H,X)=>{var G=v(),Y=d(G);Ae(Y,17,()=>o(a),We,(he,ke,Pe)=>{var me=Bt(),ye=d(me);{var I=y=>{var $=Ft();i(y,$)};Te(ye,y=>{Pe>0&&y(I)})}var B=g(ye,2);Ce(B,()=>Ue,(y,$)=>{$(y,{children:(J,Q)=>{E();var j=F();q(()=>b(j,o(ke))),i(J,j)},$$slots:{default:!0}})}),i(he,me)}),i(H,G)},$$slots:{default:!0}})})}i(f,c)};Te(s,f=>{ht()?f(l):f(K,!1)})}i(r,u),m()}function ha(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]];T(r,M({name:"activity"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function ma(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];T(r,M({name:"bot"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function ya(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335"}],["path",{d:"m9 11 3 3L22 4"}]];T(r,M({name:"circle-check-big"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function ga(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"m16 18 6-6-6-6"}],["path",{d:"m8 6-6 6 6 6"}]];T(r,M({name:"code"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function $a(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];T(r,M({name:"download"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function qa(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M10 12.5 8 15l2 2.5"}],["path",{d:"m14 12.5 2 2.5-2 2.5"}]];T(r,M({name:"file-code"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function ba(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"}],["path",{d:"m21 2-9.6 9.6"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5"}]];T(r,M({name:"key"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function ka(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M3 5h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 19h.01"}],["path",{d:"M8 5h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 19h13"}]];T(r,M({name:"list"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function Pa(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];T(r,M({name:"sparkles"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function wa(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"}]];T(r,M({name:"table-2"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}function Sa(r,e){h(e,!0);/**
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
 */let t=w(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:"12",cy:"7",r:"4"}]];T(r,M({name:"user"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=v(),l=d(s);P(l,()=>e.children??k),i(a,s)},$$slots:{default:!0}})),m()}const Qt=()=>"Failed to copy to clipboard",jt=()=>"Error al copiar al portapapeles",Rt=()=>"فشل النسخ إلى الحافظة",Ht=()=>"Kopieren in Zwischenablage fehlgeschlagen",Kt=()=>"클립보드에 복사 실패",Ut=()=>"Échec de la copie dans le presse-papiers",xa=(r={},e={})=>{const t=e.locale??S();return t==="en"?Qt():t==="es"?jt():t==="ar"?Rt():t==="de"?Ht():t==="ko"?Kt():Ut()},Gt=()=>"Error copied to clipboard",Jt=()=>"Error copiado al portapapeles",Zt=()=>"تم نسخ الخطأ إلى الحافظة",Wt=()=>"Fehler in Zwischenablage kopiert",Xt=()=>"오류가 클립보드에 복사되었습니다",Yt=()=>"Erreur copiée dans le presse-papiers",Ia=(r={},e={})=>{const t=e.locale??S();return t==="en"?Gt():t==="es"?Jt():t==="ar"?Zt():t==="de"?Wt():t==="ko"?Xt():Yt()},er=()=>"Save Query",tr=()=>"Guardar consulta",rr=()=>"حفظ الاستعلام",sr=()=>"Abfrage speichern",ar=()=>"쿼리 저장",nr=()=>"Enregistrer la requête",or=(r={},e={})=>{const t=e.locale??S();return t==="en"?er():t==="es"?tr():t==="ar"?rr():t==="de"?sr():t==="ko"?ar():nr()},ir=()=>"Give your query a name to save it for later use",cr=()=>"Dale un nombre a tu consulta para guardarla para uso posterior",lr=()=>"أعطِ استعلامك اسماً لحفظه للاستخدام لاحقاً",ur=()=>"Geben Sie Ihrer Abfrage einen Namen, um sie für später zu speichern",dr=()=>"나중에 사용할 수 있도록 쿼리에 이름을 지정하세요",_r=()=>"Donnez un nom à votre requête pour l'enregistrer pour une utilisation ultérieure",fr=(r={},e={})=>{const t=e.locale??S();return t==="en"?ir():t==="es"?cr():t==="ar"?lr():t==="de"?ur():t==="ko"?dr():_r()},pr=()=>"Query Name",vr=()=>"Nombre de consulta",hr=()=>"اسم الاستعلام",mr=()=>"Abfragename",yr=()=>"쿼리 이름",gr=()=>"Nom de la requête",$r=(r={},e={})=>{const t=e.locale??S();return t==="en"?pr():t==="es"?vr():t==="ar"?hr():t==="de"?mr():t==="ko"?yr():gr()},qr=()=>"e.g., Active Users Report",br=()=>"ej., Informe de usuarios activos",kr=()=>"مثال: تقرير المستخدمين النشطين",Pr=()=>"z.B. Aktive Benutzer Bericht",wr=()=>"예: 활성 사용자 보고서",Sr=()=>"ex. Rapport des utilisateurs actifs",xr=(r={},e={})=>{const t=e.locale??S();return t==="en"?qr():t==="es"?br():t==="ar"?kr():t==="de"?Pr():t==="ko"?wr():Sr()},Ir=()=>"Cancel",Or=()=>"Cancelar",Dr=()=>"إلغاء",Nr=()=>"Abbrechen",Cr=()=>"취소",Mr=()=>"Annuler",Tr=(r={},e={})=>{const t=e.locale??S();return t==="en"?Ir():t==="es"?Or():t==="ar"?Dr():t==="de"?Nr():t==="ko"?Cr():Mr()},Ar=()=>"Save Query",Lr=()=>"Guardar consulta",Vr=()=>"حفظ الاستعلام",zr=()=>"Abfrage speichern",Er=()=>"쿼리 저장",Fr=()=>"Enregistrer la requête",Br=(r={},e={})=>{const t=e.locale??S();return t==="en"?Ar():t==="es"?Lr():t==="ar"?Vr():t==="de"?zr():t==="ko"?Er():Fr()},Qr=()=>"Please enter a query name",jr=()=>"Por favor ingresa un nombre de consulta",Rr=()=>"يرجى إدخال اسم الاستعلام",Hr=()=>"Bitte geben Sie einen Abfragenamen ein",Kr=()=>"쿼리 이름을 입력하세요",Ur=()=>"Veuillez entrer un nom de requête",Gr=(r={},e={})=>{const t=e.locale??S();return t==="en"?Qr():t==="es"?jr():t==="ar"?Rr():t==="de"?Hr():t==="ko"?Kr():Ur()},Jr=()=>"Query saved successfully",Zr=()=>"Consulta guardada exitosamente",Wr=()=>"تم حفظ الاستعلام بنجاح",Xr=()=>"Abfrage erfolgreich gespeichert",Yr=()=>"쿼리가 성공적으로 저장되었습니다",es=()=>"Requête enregistrée avec succès",ts=(r={},e={})=>{const t=e.locale??S();return t==="en"?Jr():t==="es"?Zr():t==="ar"?Wr():t==="de"?Xr():t==="ko"?Yr():es()},rs=()=>"Query Parameters",ss=()=>"Parámetros de consulta",as=()=>"معاملات الاستعلام",ns=()=>"Abfrageparameter",os=()=>"쿼리 매개변수",is=()=>"Paramètres de requête",cs=(r={},e={})=>{const t=e.locale??S();return t==="en"?rs():t==="es"?ss():t==="ar"?as():t==="de"?ns():t==="ko"?os():is()},ls=()=>"Configure types and defaults for detected parameters",us=()=>"Configura tipos y valores predeterminados para los parámetros detectados",ds=()=>"تكوين الأنواع والقيم الافتراضية للمعاملات المكتشفة",_s=()=>"Typen und Standardwerte für erkannte Parameter konfigurieren",fs=()=>"감지된 매개변수의 유형과 기본값을 설정하세요",ps=()=>"Configurer les types et valeurs par défaut pour les paramètres détectés",vs=(r={},e={})=>{const t=e.locale??S();return t==="en"?ls():t==="es"?us():t==="ar"?ds():t==="de"?_s():t==="ko"?fs():ps()},hs=()=>"Type",ms=()=>"Tipo",ys=()=>"النوع",gs=()=>"Typ",$s=()=>"유형",qs=()=>"Type",bs=(r={},e={})=>{const t=e.locale??S();return t==="en"?hs():t==="es"?ms():t==="ar"?ys():t==="de"?gs():t==="ko"?$s():qs()},ks=()=>"Default",Ps=()=>"Predeterminado",ws=()=>"افتراضي",Ss=()=>"Standard",xs=()=>"기본값",Is=()=>"Défaut",Os=(r={},e={})=>{const t=e.locale??S();return t==="en"?ks():t==="es"?Ps():t==="ar"?ws():t==="de"?Ss():t==="ko"?xs():Is()};function Oa(r){return r}function Da(r){return r<.5?4*r*r*r:.5*Math.pow(2*r-2,3)+1}function Na(r){return r*r*r}function Ca(r){const e=r-1;return e*e*e+1}var Ds=C("<!> <!>",1),Ns=C("<!> ",1),Cs=C("<!> <!>",1),Ms=C('<div class="rounded-lg border p-3 space-y-3"><div class="font-medium text-sm"> </div> <div class="grid grid-cols-2 gap-3"><div class="space-y-1"><!> <!></div> <div class="space-y-1"><!> <!></div></div></div>'),Ts=C('<p class="text-xs text-muted-foreground"> </p> <!>',1),As=C("<!> <!>",1),Ls=C("<!> <!>",1),Vs=C('<!> <div class="overflow-y-auto flex-1 py-4"><div class="grid gap-4"><div class="grid gap-2"><!> <!></div> <!></div></div> <!>',1);function Ma(r,e){h(e,!0);let t=be(e,"open",15,!1);const n=mt();let a=N(""),u=N(!1),s=N(Le([]));ft(()=>{if(t()){const c=e.tabId?n.state.queryTabs.find(A=>A.id===e.tabId):null,x=c!=null&&c.savedQueryId?n.state.activeConnectionSavedQueries.find(A=>A.id===c.savedQueryId):null;x?p(a,x.name,!0):c&&p(a,c.name,!0);const U=yt(e.query);U.length>0?(p(s,U.map(A=>{var H;return((H=x==null?void 0:x.parameters)==null?void 0:H.find(X=>X.name===A))??{name:A,type:"text",defaultValue:void 0,description:void 0}}),!0),p(u,!0)):(p(s,[],!0),p(u,!1))}});const l=()=>{var x;if(!o(a).trim()){Mt(Gr());return}const c=o(s).length>0?o(s):void 0;n.savedQueries.saveQuery(o(a).trim(),e.query,e.tabId,c),Tt.success(ts()),t(!1),p(a,""),(x=e.onSaveComplete)==null||x.call(e)},K=c=>{c.key==="Enter"&&!c.shiftKey&&l()},f={text:"Text",number:"Number",date:"Date",datetime:"DateTime",boolean:"Boolean"};gt(r,{get open(){return t()},set open(c){t(c)},children:(c,x)=>{$t(c,{class:"max-w-lg max-h-[80vh] overflow-hidden flex flex-col",children:(U,A)=>{var W=Vs(),H=d(W);qt(H,{children:(I,B)=>{var y=Ds(),$=d(y);bt($,{children:(Q,j)=>{E();var O=F();q(D=>b(O,D),[()=>or()]),i(Q,O)},$$slots:{default:!0}});var J=g($,2);kt(J,{children:(Q,j)=>{E();var O=F();q(D=>b(O,D),[()=>fr()]),i(Q,O)},$$slots:{default:!0}}),i(I,y)},$$slots:{default:!0}});var X=g(H,2),G=V(X),Y=V(G),he=V(Y);Me(he,{for:"query-name",children:(I,B)=>{E();var y=F();q($=>b(y,$),[()=>$r()]),i(I,y)},$$slots:{default:!0}});var ke=g(he,2);{let I=re(()=>xr());Ke(ke,{id:"query-name",get placeholder(){return o(I)},onkeydown:K,get value(){return o(a)},set value(B){p(a,B,!0)}})}z(Y);var Pe=g(Y,2);{var me=I=>{wt(I,{class:"space-y-2",get open(){return o(u)},set open(B){p(u,B,!0)},children:(B,y)=>{var $=As(),J=d($);St(J,{class:"flex items-center gap-2 text-sm font-medium w-full",children:(j,O)=>{var D=Ns(),ee=d(D);{let se=re(()=>o(u)?"rotate-0":"-rotate-90");xt(ee,{get class(){return`size-4 transition-transform duration-200 ${o(se)??""}`}})}var we=g(ee);q(se=>b(we,` ${se??""} (${o(s).length??""})`),[()=>cs()]),i(j,D)},$$slots:{default:!0}});var Q=g(J,2);It(Q,{class:"space-y-3 pt-2",children:(j,O)=>{var D=Ts(),ee=d(D),we=V(ee,!0);z(ee);var se=g(ee,2);Ae(se,19,()=>o(s),ae=>ae.name,(ae,ge,Se)=>{var xe=Ms(),Ie=V(xe),Ye=V(Ie,!0);z(Ie);var Ve=g(Ie,2),Oe=V(Ve),ze=V(Oe);Me(ze,{class:"text-xs text-muted-foreground",children:(R,Be)=>{E();var Z=F();q(te=>b(Z,te),[()=>bs()]),i(R,Z)},$$slots:{default:!0}});var et=g(ze,2);Ot(et,{type:"single",get value(){return o(ge).type},onValueChange:R=>{R&&(o(s)[o(Se)]={...o(ge),type:R})},children:(R,Be)=>{var Z=Cs(),te=d(Z);Dt(te,{class:"h-8",children:(De,st)=>{E();var ne=F();q(()=>b(ne,f[o(ge).type])),i(De,ne)},$$slots:{default:!0}});var rt=g(te,2);Nt(rt,{children:(De,st)=>{var ne=v(),at=d(ne);Ae(at,17,()=>Object.entries(f),We,(nt,ot)=>{var Qe=re(()=>pt(o(ot),2));let it=()=>o(Qe)[0],ct=()=>o(Qe)[1];Ct(nt,{get value(){return it()},children:(lt,Xs)=>{E();var je=F();q(()=>b(je,ct())),i(lt,je)},$$slots:{default:!0}})}),i(De,ne)},$$slots:{default:!0}}),i(R,Z)},$$slots:{default:!0}}),z(Oe);var Ee=g(Oe,2),Fe=V(Ee);Me(Fe,{class:"text-xs text-muted-foreground",children:(R,Be)=>{E();var Z=F();q(te=>b(Z,te),[()=>Os()]),i(R,Z)},$$slots:{default:!0}});var tt=g(Fe,2);Ke(tt,{class:"h-8",placeholder:"Optional",get value(){return o(s)[o(Se)].defaultValue},set value(R){o(s)[o(Se)].defaultValue=R}}),z(Ee),z(Ve),z(xe),q(()=>b(Ye,o(ge).name)),i(ae,xe)}),q(ae=>b(we,ae),[()=>vs()]),i(j,D)},$$slots:{default:!0}}),i(B,$)},$$slots:{default:!0}})};Te(Pe,I=>{o(s).length>0&&I(me)})}z(G),z(X);var ye=g(X,2);Pt(ye,{children:(I,B)=>{var y=Ls(),$=d(y);He($,{variant:"outline",onclick:()=>t(!1),children:(Q,j)=>{E();var O=F();q(D=>b(O,D),[()=>Tr()]),i(Q,O)},$$slots:{default:!0}});var J=g($,2);He(J,{onclick:l,children:(Q,j)=>{E();var O=F();q(D=>b(O,D),[()=>Br()]),i(Q,O)},$$slots:{default:!0}}),i(I,y)},$$slots:{default:!0}}),i(U,W)},$$slots:{default:!0}})},$$slots:{default:!0}}),m()}const zs={"app-info":"general",license:"general",theme:"appearance",themes:"appearance",learn:"features"},Ta={general:["app-info","license"],appearance:["theme","themes"],features:["learn"]};var oe,ie;class Es{constructor(){L(this,oe,N(!1));L(this,ie,N("general"))}get isOpen(){return o(_(this,oe))}set isOpen(e){p(_(this,oe),e,!0)}get activeView(){return o(_(this,ie))}set activeView(e){p(_(this,ie),e,!0)}open(e){this.activeView=e??"general",this.isOpen=!0}close(){this.isOpen=!1}setView(e){this.activeView=e}isGroupView(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"}getActiveGroup(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"?this.activeView:zs[this.activeView]}}oe=new WeakMap,ie=new WeakMap;const Aa=new Es,Fs={postgresql:"postgres",postgres:"postgres",mysql:"mysql",mariadb:"mariadb",sqlite:"sqlite",mssql:"mssql",sqlserver:"mssql",duckdb:"duckdb"},Bs={postgres:5432,mysql:3306,mariadb:3306,sqlite:0,mssql:1433,duckdb:0};async function Qs(){try{const r=await At();if(!r)return[];const e=JSON.parse(r);return e.connections?Object.entries(e.connections).map(([t,n])=>({...n,id:t})):[]}catch(r){return console.error("Failed to read DBeaver config:",r),[]}}function js(r,e){var c;const t=Fs[(c=r.provider)==null?void 0:c.toLowerCase()];if(!t)return null;const n=r.configuration||{},a=n.host||"localhost",u=parseInt(n.port||String(Bs[t]),10),s=n.database||"",l=n.user||"",K=t==="sqlite"?`conn-sqlite-${s}`:`conn-${a}-${u}`,f=e.includes(K);return{original:r,name:r.name,type:t,host:a,port:u,databaseName:s,username:l,isDuplicate:f,selected:!f}}async function Rs(r){return(await Qs()).map(t=>js(t,r)).filter(t=>t!==null)}const Ge="dbeaver_import_state.json";var ce,le,ue,de;class Hs{constructor(){L(this,ce,N(!1));L(this,le,N(!1));L(this,ue,N(Le([])));L(this,de,N(!1));Ne(this,"initialized",!1)}get isOpen(){return o(_(this,ce))}set isOpen(e){p(_(this,ce),e,!0)}get isLoading(){return o(_(this,le))}set isLoading(e){p(_(this,le),e,!0)}get connections(){return o(_(this,ue))}set connections(e){p(_(this,ue),e,!0)}get hasOfferedImport(){return o(_(this,de))}set hasOfferedImport(e){p(_(this,de),e,!0)}async initialize(){if(!this.initialized){this.initialized=!0;try{const t=await(await qe(Ge,{autoSave:!1,defaults:{state:null}})).get("state");t&&(this.hasOfferedImport=t.hasOfferedImport)}catch(e){console.error("Failed to load DBeaver import state:",e)}}}async checkAndShowDialog(e){this.isLoading=!0;try{const t=await Rs(e);t.length>0&&(this.connections=t,this.isOpen=!0)}catch(t){console.error("Failed to check DBeaver connections:",t)}finally{this.isLoading=!1}}toggleConnection(e){this.connections[e]&&!this.connections[e].isDuplicate&&(this.connections[e].selected=!this.connections[e].selected,this.connections=[...this.connections])}selectAll(){this.connections=this.connections.map(e=>({...e,selected:!e.isDuplicate}))}deselectAll(){this.connections=this.connections.map(e=>({...e,selected:!1}))}getSelectedConnections(){return this.connections.filter(e=>e.selected)}async dismiss(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async completeImport(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async persist(){try{const e=await qe(Ge,{autoSave:!0,defaults:{state:null}}),t={hasOfferedImport:this.hasOfferedImport,lastCheckTimestamp:new Date().toISOString()};await e.set("state",t),await e.save()}catch(e){console.error("Failed to persist DBeaver import state:",e)}}}ce=new WeakMap,le=new WeakMap,ue=new WeakMap,de=new WeakMap;const La=new Hs,Ks={PostgreSQL:"postgres",MySQL:"mysql",MariaDB:"mariadb",SQLite:"sqlite","SQL Server":"mssql"},Us={postgres:5432,mysql:3306,mariadb:3306,sqlite:0,mssql:1433,duckdb:0};async function Gs(){try{const r=await Lt();if(!r)return[];const e=JSON.parse(r);return Array.isArray(e)?e.filter(t=>typeof t=="object"&&t!==null&&"ID"in t).map(t=>({id:String(t.ID||""),connectionName:String(t.ConnectionName||""),driver:String(t.Driver||""),databaseHost:String(t.DatabaseHost||""),databasePort:String(t.DatabasePort||""),databaseName:String(t.DatabaseName||""),databaseUser:String(t.DatabaseUser||"")})):[]}catch(r){return console.error("Failed to read TablePlus config:",r),[]}}function Js(r,e){const t=Ks[r.driver];if(!t)return null;const n=r.databaseHost||"localhost",a=parseInt(r.databasePort||String(Us[t]),10),u=r.databaseName||"",s=r.databaseUser||"",l=t==="sqlite"?`conn-sqlite-${u}`:`conn-${n}-${a}`,K=e.includes(l);return{original:r,name:r.connectionName||`${n}:${a}`,type:t,host:n,port:a,databaseName:u,username:s,isDuplicate:K,selected:!K}}async function Zs(r){return(await Gs()).map(t=>Js(t,r)).filter(t=>t!==null)}const Je="tableplus_import_state.json";var _e,fe,pe,ve;class Ws{constructor(){L(this,_e,N(!1));L(this,fe,N(!1));L(this,pe,N(Le([])));L(this,ve,N(!1));Ne(this,"initialized",!1)}get isOpen(){return o(_(this,_e))}set isOpen(e){p(_(this,_e),e,!0)}get isLoading(){return o(_(this,fe))}set isLoading(e){p(_(this,fe),e,!0)}get connections(){return o(_(this,pe))}set connections(e){p(_(this,pe),e,!0)}get hasOfferedImport(){return o(_(this,ve))}set hasOfferedImport(e){p(_(this,ve),e,!0)}async initialize(){if(!this.initialized){this.initialized=!0;try{const t=await(await qe(Je,{autoSave:!1,defaults:{state:null}})).get("state");t&&(this.hasOfferedImport=t.hasOfferedImport)}catch(e){console.error("Failed to load TablePlus import state:",e)}}}async checkAndShowDialog(e){this.isLoading=!0;try{const t=await Zs(e);t.length>0&&(this.connections=t,this.isOpen=!0)}catch(t){console.error("Failed to check TablePlus connections:",t)}finally{this.isLoading=!1}}toggleConnection(e){this.connections[e]&&!this.connections[e].isDuplicate&&(this.connections[e].selected=!this.connections[e].selected,this.connections=[...this.connections])}selectAll(){this.connections=this.connections.map(e=>({...e,selected:!e.isDuplicate}))}deselectAll(){this.connections=this.connections.map(e=>({...e,selected:!1}))}getSelectedConnections(){return this.connections.filter(e=>e.selected)}async dismiss(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async completeImport(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async persist(){try{const e=await qe(Je,{autoSave:!0,defaults:{state:null}}),t={hasOfferedImport:this.hasOfferedImport,lastCheckTimestamp:new Date().toISOString()};await e.set("state",t),await e.save()}catch(e){console.error("Failed to persist TablePlus import state:",e)}}}_e=new WeakMap,fe=new WeakMap,pe=new WeakMap,ve=new WeakMap;const Va=new Ws;export{ha as A,ma as B,ya as C,$a as D,qa as F,pa as I,ba as K,ka as L,Ma as S,wa as T,Sa as U,xa as a,va as b,Ca as c,Pa as d,ga as e,La as f,Ta as g,Na as h,Da as i,Oa as l,Ia as q,Aa as s,Va as t};
