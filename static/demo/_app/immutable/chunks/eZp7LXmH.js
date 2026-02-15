var nt=Object.defineProperty;var Le=r=>{throw TypeError(r)};var ot=(r,e,t)=>e in r?nt(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var ze=(r,e,t)=>ot(r,typeof e!="symbol"?e+"":e,t),it=(r,e,t)=>e.has(r)||Le("Cannot "+t);var I=(r,e,t)=>(it(r,e,"read from private field"),t?t.call(r):e.get(r)),X=(r,e,t)=>e.has(r)?Le("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t);import"./Bzak7iHL.js";import{p as v,f as d,j as b,a as p,c as A,r as T,n as L,t as $,g as c,i as te,s as h,h as j,ao as je,u as ct,e as y,b3 as lt}from"./s46vk8Jw.js";import{c as f,a as o,f as O,t as z}from"./DN3X4kc0.js";import{s as k,a as Ge}from"./CUB-rzCD.js";import{s as M,r as x,p as he,i as De}from"./2OVp_Qab.js";import{I as V}from"./BmHSYkZA.js";import{s as q}from"./DtPKuzlZ.js";import{c as me,e as Ne,o as Re,B as Be}from"./Cancu-m9.js";import{b as He,c as Pe}from"./De42ds-N.js";import{g as ut,i as dt}from"./CobKncCj.js";import{g as w}from"./CluvpHAZ.js";import{u as _t,j as ft,D as vt,m as pt,n as mt,o as ht,p as yt,q as gt,r as $t,v as qt,w as bt,x as kt,S as xt,y as wt,z as Pt,A as St,E as Dt,l as Nt}from"./Drk8VXU9.js";import{L as Se,I as Ee}from"./BIp1fOdr.js";import{f as It,l as Fe}from"./CEaEN-3c.js";function ra(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];V(r,M({name:"info"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}var Ot=O("<kbd><!></kbd>");function Ke(r,e){v(e,!0);let t=he(e,"ref",15,null),n=x(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Ot();Ge(a,s=>({"data-slot":"kbd",class:s,...n}),[()=>me("bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none","[&_svg:not([class*='size-'])]:size-3","[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",e.class)]);var u=A(a);k(u,()=>e.children??b),T(a),He(a,s=>t(s),()=>t()),o(r,a),p()}var Mt=O("<kbd><!></kbd>");function Vt(r,e){v(e,!0);let t=he(e,"ref",15,null),n=x(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Mt();Ge(a,s=>({"data-slot":"kbd-group",class:s,...n}),[()=>me("inline-flex items-center gap-1",e.class)]);var u=A(a);k(u,()=>e.children??b),T(a),He(a,s=>t(s),()=>t()),o(r,a),p()}var Ct=O('<span class="text-muted-foreground">+</span>'),At=O("<!> <!>",1);function sa(r,e){v(e,!0);let t=he(e,"class",3,"");const n=ut(),a=te(()=>{const _=[];e.keys.mod&&_.push(n.mod),e.keys.ctrl&&_.push(n.ctrl),e.keys.alt&&_.push(n.alt),e.keys.shift&&_.push(n.shift);let i=e.keys.key;return i==="Enter"?i=n.enter:i==="Backspace"?i=n.backspace:i==="Delete"?i=n.delete:i==="Escape"?i=n.escape:i==="Tab"?i=n.tab:i.length===1&&(i=i.toUpperCase()),_.push(i),_});var u=f(),s=d(u);{var l=_=>{var i=f(),P=d(i);{let G=te(()=>me(t()));Pe(P,()=>Ke,(C,Z)=>{Z(C,{get class(){return c(G)},children:(Q,J)=>{L();var R=z();$(W=>q(R,W),[()=>c(a).join("")]),o(Q,R)},$$slots:{default:!0}})})}o(_,i)},re=_=>{var i=f(),P=d(i);{let G=te(()=>me(t()));Pe(P,()=>Vt,(C,Z)=>{Z(C,{get class(){return c(G)},children:(Q,J)=>{var R=f(),W=d(R);Ne(W,17,()=>c(a),Re,(_e,ye,ge)=>{var fe=At(),ve=d(fe);{var S=m=>{var g=Ct();o(m,g)};De(ve,m=>{ge>0&&m(S)})}var B=h(ve,2);Pe(B,()=>Ke,(m,g)=>{g(m,{children:(H,E)=>{L();var F=z();$(()=>q(F,c(ye))),o(H,F)},$$slots:{default:!0}})}),o(_e,fe)}),o(Q,R)},$$slots:{default:!0}})})}o(_,i)};De(s,_=>{dt()?_(l):_(re,!1)})}o(r,u),p()}function aa(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]];V(r,M({name:"activity"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function na(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];V(r,M({name:"bot"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function oa(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335"}],["path",{d:"m9 11 3 3L22 4"}]];V(r,M({name:"circle-check-big"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function ia(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"m16 18 6-6-6-6"}],["path",{d:"m8 6-6 6 6 6"}]];V(r,M({name:"code"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function ca(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];V(r,M({name:"download"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function la(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M10 12.5 8 15l2 2.5"}],["path",{d:"m14 12.5 2 2.5-2 2.5"}]];V(r,M({name:"file-code"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function ua(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"}],["path",{d:"m21 2-9.6 9.6"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5"}]];V(r,M({name:"key"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function da(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M3 5h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 19h.01"}],["path",{d:"M8 5h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 19h13"}]];V(r,M({name:"list"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function _a(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];V(r,M({name:"sparkles"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function fa(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"}]];V(r,M({name:"table-2"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}function va(r,e){v(e,!0);/**
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
 */let t=x(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:"12",cy:"7",r:"4"}]];V(r,M({name:"user"},()=>t,{get iconNode(){return n},children:(a,u)=>{var s=f(),l=d(s);k(l,()=>e.children??b),o(a,s)},$$slots:{default:!0}})),p()}const Tt=()=>"Failed to copy to clipboard",Lt=()=>"Error al copiar al portapapeles",zt=()=>"فشل النسخ إلى الحافظة",Bt=()=>"Kopieren in Zwischenablage fehlgeschlagen",Et=()=>"클립보드에 복사 실패",Ft=()=>"Échec de la copie dans le presse-papiers",pa=(r={},e={})=>{const t=e.locale??w();return t==="en"?Tt():t==="es"?Lt():t==="ar"?zt():t==="de"?Bt():t==="ko"?Et():Ft()},Kt=()=>"Error copied to clipboard",Qt=()=>"Error copiado al portapapeles",jt=()=>"تم نسخ الخطأ إلى الحافظة",Gt=()=>"Fehler in Zwischenablage kopiert",Rt=()=>"오류가 클립보드에 복사되었습니다",Ht=()=>"Erreur copiée dans le presse-papiers",ma=(r={},e={})=>{const t=e.locale??w();return t==="en"?Kt():t==="es"?Qt():t==="ar"?jt():t==="de"?Gt():t==="ko"?Rt():Ht()},Ut=()=>"Save Query",Zt=()=>"Guardar consulta",Jt=()=>"حفظ الاستعلام",Wt=()=>"Abfrage speichern",Xt=()=>"쿼리 저장",Yt=()=>"Enregistrer la requête",er=(r={},e={})=>{const t=e.locale??w();return t==="en"?Ut():t==="es"?Zt():t==="ar"?Jt():t==="de"?Wt():t==="ko"?Xt():Yt()},tr=()=>"Give your query a name to save it for later use",rr=()=>"Dale un nombre a tu consulta para guardarla para uso posterior",sr=()=>"أعطِ استعلامك اسماً لحفظه للاستخدام لاحقاً",ar=()=>"Geben Sie Ihrer Abfrage einen Namen, um sie für später zu speichern",nr=()=>"나중에 사용할 수 있도록 쿼리에 이름을 지정하세요",or=()=>"Donnez un nom à votre requête pour l'enregistrer pour une utilisation ultérieure",ir=(r={},e={})=>{const t=e.locale??w();return t==="en"?tr():t==="es"?rr():t==="ar"?sr():t==="de"?ar():t==="ko"?nr():or()},cr=()=>"Query Name",lr=()=>"Nombre de consulta",ur=()=>"اسم الاستعلام",dr=()=>"Abfragename",_r=()=>"쿼리 이름",fr=()=>"Nom de la requête",vr=(r={},e={})=>{const t=e.locale??w();return t==="en"?cr():t==="es"?lr():t==="ar"?ur():t==="de"?dr():t==="ko"?_r():fr()},pr=()=>"e.g., Active Users Report",mr=()=>"ej., Informe de usuarios activos",hr=()=>"مثال: تقرير المستخدمين النشطين",yr=()=>"z.B. Aktive Benutzer Bericht",gr=()=>"예: 활성 사용자 보고서",$r=()=>"ex. Rapport des utilisateurs actifs",qr=(r={},e={})=>{const t=e.locale??w();return t==="en"?pr():t==="es"?mr():t==="ar"?hr():t==="de"?yr():t==="ko"?gr():$r()},br=()=>"Cancel",kr=()=>"Cancelar",xr=()=>"إلغاء",wr=()=>"Abbrechen",Pr=()=>"취소",Sr=()=>"Annuler",Dr=(r={},e={})=>{const t=e.locale??w();return t==="en"?br():t==="es"?kr():t==="ar"?xr():t==="de"?wr():t==="ko"?Pr():Sr()},Nr=()=>"Save Query",Ir=()=>"Guardar consulta",Or=()=>"حفظ الاستعلام",Mr=()=>"Abfrage speichern",Vr=()=>"쿼리 저장",Cr=()=>"Enregistrer la requête",Ar=(r={},e={})=>{const t=e.locale??w();return t==="en"?Nr():t==="es"?Ir():t==="ar"?Or():t==="de"?Mr():t==="ko"?Vr():Cr()},Tr=()=>"Please enter a query name",Lr=()=>"Por favor ingresa un nombre de consulta",zr=()=>"يرجى إدخال اسم الاستعلام",Br=()=>"Bitte geben Sie einen Abfragenamen ein",Er=()=>"쿼리 이름을 입력하세요",Fr=()=>"Veuillez entrer un nom de requête",Kr=(r={},e={})=>{const t=e.locale??w();return t==="en"?Tr():t==="es"?Lr():t==="ar"?zr():t==="de"?Br():t==="ko"?Er():Fr()},Qr=()=>"Query saved successfully",jr=()=>"Consulta guardada exitosamente",Gr=()=>"تم حفظ الاستعلام بنجاح",Rr=()=>"Abfrage erfolgreich gespeichert",Hr=()=>"쿼리가 성공적으로 저장되었습니다",Ur=()=>"Requête enregistrée avec succès",Zr=(r={},e={})=>{const t=e.locale??w();return t==="en"?Qr():t==="es"?jr():t==="ar"?Gr():t==="de"?Rr():t==="ko"?Hr():Ur()},Jr=()=>"Query Parameters",Wr=()=>"Parámetros de consulta",Xr=()=>"معاملات الاستعلام",Yr=()=>"Abfrageparameter",es=()=>"쿼리 매개변수",ts=()=>"Paramètres de requête",rs=(r={},e={})=>{const t=e.locale??w();return t==="en"?Jr():t==="es"?Wr():t==="ar"?Xr():t==="de"?Yr():t==="ko"?es():ts()},ss=()=>"Configure types and defaults for detected parameters",as=()=>"Configura tipos y valores predeterminados para los parámetros detectados",ns=()=>"تكوين الأنواع والقيم الافتراضية للمعاملات المكتشفة",os=()=>"Typen und Standardwerte für erkannte Parameter konfigurieren",is=()=>"감지된 매개변수의 유형과 기본값을 설정하세요",cs=()=>"Configurer les types et valeurs par défaut pour les paramètres détectés",ls=(r={},e={})=>{const t=e.locale??w();return t==="en"?ss():t==="es"?as():t==="ar"?ns():t==="de"?os():t==="ko"?is():cs()},us=()=>"Type",ds=()=>"Tipo",_s=()=>"النوع",fs=()=>"Typ",vs=()=>"유형",ps=()=>"Type",ms=(r={},e={})=>{const t=e.locale??w();return t==="en"?us():t==="es"?ds():t==="ar"?_s():t==="de"?fs():t==="ko"?vs():ps()},hs=()=>"Default",ys=()=>"Predeterminado",gs=()=>"افتراضي",$s=()=>"Standard",qs=()=>"기본값",bs=()=>"Défaut",ks=(r={},e={})=>{const t=e.locale??w();return t==="en"?hs():t==="es"?ys():t==="ar"?gs():t==="de"?$s():t==="ko"?qs():bs()};function ha(r){return r}function ya(r){return r<.5?4*r*r*r:.5*Math.pow(2*r-2,3)+1}function ga(r){return r*r*r}function $a(r){const e=r-1;return e*e*e+1}var xs=O("<!> <!>",1),ws=O("<!> ",1),Ps=O("<!> <!>",1),Ss=O('<div class="rounded-lg border p-3 space-y-3"><div class="font-medium text-sm"> </div> <div class="grid grid-cols-2 gap-3"><div class="space-y-1"><!> <!></div> <div class="space-y-1"><!> <!></div></div></div>'),Ds=O('<p class="text-xs text-muted-foreground"> </p> <!>',1),Ns=O("<!> <!>",1),Is=O("<!> <!>",1),Os=O('<!> <div class="overflow-y-auto flex-1 py-4"><div class="grid gap-4"><div class="grid gap-2"><!> <!></div> <!></div></div> <!>',1);function qa(r,e){v(e,!0);let t=he(e,"open",15,!1);const n=_t();let a=j(""),u=j(!1),s=j(je([]));ct(()=>{if(t()){const i=e.tabId?n.state.queryTabs.find(C=>C.id===e.tabId):null,P=i!=null&&i.savedQueryId?n.state.activeConnectionSavedQueries.find(C=>C.id===i.savedQueryId):null;P?y(a,P.name,!0):i&&y(a,i.name,!0);const G=ft(e.query);G.length>0?(y(s,G.map(C=>{var Q;return((Q=P==null?void 0:P.parameters)==null?void 0:Q.find(J=>J.name===C))??{name:C,type:"text",defaultValue:void 0,description:void 0}}),!0),y(u,!0)):(y(s,[],!0),y(u,!1))}});const l=()=>{var P;if(!c(a).trim()){Dt(Kr());return}const i=c(s).length>0?c(s):void 0;n.savedQueries.saveQuery(c(a).trim(),e.query,e.tabId,i),Nt.success(Zr()),t(!1),y(a,""),(P=e.onSaveComplete)==null||P.call(e)},re=i=>{i.key==="Enter"&&!i.shiftKey&&l()},_={text:"Text",number:"Number",date:"Date",datetime:"DateTime",boolean:"Boolean"};vt(r,{get open(){return t()},set open(i){t(i)},children:(i,P)=>{pt(i,{class:"max-w-lg max-h-[80vh] overflow-hidden flex flex-col",children:(G,C)=>{var Z=Os(),Q=d(Z);mt(Q,{children:(S,B)=>{var m=xs(),g=d(m);ht(g,{children:(E,F)=>{L();var D=z();$(N=>q(D,N),[()=>er()]),o(E,D)},$$slots:{default:!0}});var H=h(g,2);yt(H,{children:(E,F)=>{L();var D=z();$(N=>q(D,N),[()=>ir()]),o(E,D)},$$slots:{default:!0}}),o(S,m)},$$slots:{default:!0}});var J=h(Q,2),R=A(J),W=A(R),_e=A(W);Se(_e,{for:"query-name",children:(S,B)=>{L();var m=z();$(g=>q(m,g),[()=>vr()]),o(S,m)},$$slots:{default:!0}});var ye=h(_e,2);{let S=te(()=>qr());Ee(ye,{id:"query-name",get placeholder(){return c(S)},onkeydown:re,get value(){return c(a)},set value(B){y(a,B,!0)}})}T(W);var ge=h(W,2);{var fe=S=>{$t(S,{class:"space-y-2",get open(){return c(u)},set open(B){y(u,B,!0)},children:(B,m)=>{var g=Ns(),H=d(g);qt(H,{class:"flex items-center gap-2 text-sm font-medium w-full",children:(F,D)=>{var N=ws(),Y=d(N);{let se=te(()=>c(u)?"rotate-0":"-rotate-90");bt(Y,{get class(){return`size-4 transition-transform duration-200 ${c(se)??""}`}})}var $e=h(Y);$(se=>q($e,` ${se??""} (${c(s).length??""})`),[()=>rs()]),o(F,N)},$$slots:{default:!0}});var E=h(H,2);kt(E,{class:"space-y-3 pt-2",children:(F,D)=>{var N=Ds(),Y=d(N),$e=A(Y,!0);T(Y);var se=h(Y,2);Ne(se,19,()=>c(s),ae=>ae.name,(ae,pe,qe)=>{var be=Ss(),ke=A(be),Ue=A(ke,!0);T(ke);var Ie=h(ke,2),xe=A(Ie),Oe=A(xe);Se(Oe,{class:"text-xs text-muted-foreground",children:(K,Ce)=>{L();var U=z();$(ee=>q(U,ee),[()=>ms()]),o(K,U)},$$slots:{default:!0}});var Ze=h(Oe,2);xt(Ze,{type:"single",get value(){return c(pe).type},onValueChange:K=>{K&&(c(s)[c(qe)]={...c(pe),type:K})},children:(K,Ce)=>{var U=Ps(),ee=d(U);wt(ee,{class:"h-8",children:(we,Xe)=>{L();var ne=z();$(()=>q(ne,_[c(pe).type])),o(we,ne)},$$slots:{default:!0}});var We=h(ee,2);Pt(We,{children:(we,Xe)=>{var ne=f(),Ye=d(ne);Ne(Ye,17,()=>Object.entries(_),Re,(et,tt)=>{var Ae=te(()=>lt(c(tt),2));let rt=()=>c(Ae)[0],st=()=>c(Ae)[1];St(et,{get value(){return rt()},children:(at,Es)=>{L();var Te=z();$(()=>q(Te,st())),o(at,Te)},$$slots:{default:!0}})}),o(we,ne)},$$slots:{default:!0}}),o(K,U)},$$slots:{default:!0}}),T(xe);var Me=h(xe,2),Ve=A(Me);Se(Ve,{class:"text-xs text-muted-foreground",children:(K,Ce)=>{L();var U=z();$(ee=>q(U,ee),[()=>ks()]),o(K,U)},$$slots:{default:!0}});var Je=h(Ve,2);Ee(Je,{class:"h-8",placeholder:"Optional",get value(){return c(s)[c(qe)].defaultValue},set value(K){c(s)[c(qe)].defaultValue=K}}),T(Me),T(Ie),T(be),$(()=>q(Ue,c(pe).name)),o(ae,be)}),$(ae=>q($e,ae),[()=>ls()]),o(F,N)},$$slots:{default:!0}}),o(B,g)},$$slots:{default:!0}})};De(ge,S=>{c(s).length>0&&S(fe)})}T(R),T(J);var ve=h(J,2);gt(ve,{children:(S,B)=>{var m=Is(),g=d(m);Be(g,{variant:"outline",onclick:()=>t(!1),children:(E,F)=>{L();var D=z();$(N=>q(D,N),[()=>Dr()]),o(E,D)},$$slots:{default:!0}});var H=h(g,2);Be(H,{onclick:l,children:(E,F)=>{L();var D=z();$(N=>q(D,N),[()=>Ar()]),o(E,D)},$$slots:{default:!0}}),o(S,m)},$$slots:{default:!0}}),o(G,Z)},$$slots:{default:!0}})},$$slots:{default:!0}}),p()}const Ms={"app-info":"general",license:"general",theme:"appearance",themes:"appearance",learn:"features"},ba={general:["app-info","license"],appearance:["theme","themes"],features:["learn"]};var oe,ie;class Vs{constructor(){X(this,oe,j(!1));X(this,ie,j("general"))}get isOpen(){return c(I(this,oe))}set isOpen(e){y(I(this,oe),e,!0)}get activeView(){return c(I(this,ie))}set activeView(e){y(I(this,ie),e,!0)}open(e){this.activeView=e??"general",this.isOpen=!0}close(){this.isOpen=!1}setView(e){this.activeView=e}isGroupView(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"}getActiveGroup(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"?this.activeView:Ms[this.activeView]}}oe=new WeakMap,ie=new WeakMap;const ka=new Vs,Cs={postgresql:"postgres",postgres:"postgres",mysql:"mysql",mariadb:"mariadb",sqlite:"sqlite",mssql:"mssql",sqlserver:"mssql",duckdb:"duckdb"},As={postgres:5432,mysql:3306,mariadb:3306,sqlite:0,mssql:1433,duckdb:0};async function Ts(){try{const r=await It();if(!r)return[];const e=JSON.parse(r);return e.connections?Object.entries(e.connections).map(([t,n])=>({...n,id:t})):[]}catch(r){return console.error("Failed to read DBeaver config:",r),[]}}function Ls(r,e){var i;const t=Cs[(i=r.provider)==null?void 0:i.toLowerCase()];if(!t)return null;const n=r.configuration||{},a=n.host||"localhost",u=parseInt(n.port||String(As[t]),10),s=n.database||"",l=n.user||"",re=t==="sqlite"?`conn-sqlite-${s}`:`conn-${a}-${u}`,_=e.includes(re);return{original:r,name:r.name,type:t,host:a,port:u,databaseName:s,username:l,isDuplicate:_,selected:!_}}async function zs(r){return(await Ts()).map(t=>Ls(t,r)).filter(t=>t!==null)}const Qe="dbeaver_import_state.json";var ce,le,ue,de;class Bs{constructor(){X(this,ce,j(!1));X(this,le,j(!1));X(this,ue,j(je([])));X(this,de,j(!1));ze(this,"initialized",!1)}get isOpen(){return c(I(this,ce))}set isOpen(e){y(I(this,ce),e,!0)}get isLoading(){return c(I(this,le))}set isLoading(e){y(I(this,le),e,!0)}get connections(){return c(I(this,ue))}set connections(e){y(I(this,ue),e,!0)}get hasOfferedImport(){return c(I(this,de))}set hasOfferedImport(e){y(I(this,de),e,!0)}async initialize(){if(!this.initialized){this.initialized=!0;try{const t=await(await Fe(Qe,{autoSave:!1,defaults:{state:null}})).get("state");t&&(this.hasOfferedImport=t.hasOfferedImport)}catch(e){console.error("Failed to load DBeaver import state:",e)}}}async checkAndShowDialog(e){this.isLoading=!0;try{const t=await zs(e);t.length>0&&(this.connections=t,this.isOpen=!0)}catch(t){console.error("Failed to check DBeaver connections:",t)}finally{this.isLoading=!1}}toggleConnection(e){this.connections[e]&&!this.connections[e].isDuplicate&&(this.connections[e].selected=!this.connections[e].selected,this.connections=[...this.connections])}selectAll(){this.connections=this.connections.map(e=>({...e,selected:!e.isDuplicate}))}deselectAll(){this.connections=this.connections.map(e=>({...e,selected:!1}))}getSelectedConnections(){return this.connections.filter(e=>e.selected)}async dismiss(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async completeImport(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async persist(){try{const e=await Fe(Qe,{autoSave:!0,defaults:{state:null}}),t={hasOfferedImport:this.hasOfferedImport,lastCheckTimestamp:new Date().toISOString()};await e.set("state",t),await e.save()}catch(e){console.error("Failed to persist DBeaver import state:",e)}}}ce=new WeakMap,le=new WeakMap,ue=new WeakMap,de=new WeakMap;const xa=new Bs;export{aa as A,na as B,oa as C,ca as D,la as F,ra as I,ua as K,da as L,qa as S,fa as T,va as U,pa as a,sa as b,$a as c,_a as d,ia as e,xa as f,ba as g,ga as h,ya as i,ha as l,ma as q,ka as s};
