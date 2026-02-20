var Oe=Object.defineProperty;var te=s=>{throw TypeError(s)};var Se=(s,e,t)=>e in s?Oe(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var G=(s,e,t)=>Se(s,typeof e!="symbol"?e+"":e,t),ke=(s,e,t)=>e.has(s)||te("Cannot "+t);var l=(s,e,t)=>(ke(s,e,"read from private field"),t?t.call(s):e.get(s)),y=(s,e,t)=>e.has(s)?te("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t);import"./Bzak7iHL.js";import{p as m,f as h,j as v,a as g,c as de,r as ue,n as se,t as ae,g as f,i as J,s as Ie,h as $,e as w,aj as he}from"./Ng8P2r2G.js";import{c as p,a as d,f as z,t as re}from"./CfSXt8bd.js";import{s as _,a as fe}from"./Dc67WuTr.js";import{s as O,r as b,p as W,i as ne}from"./Du1jPCW4.js";import{I as S}from"./nm-eUgNh.js";import{s as oe}from"./Dv8uDT6C.js";import{c as E,e as qe,o as Pe}from"./CWJNqUGE.js";import{b as pe,c as Z}from"./DLIyy6hA.js";import{g as De,i as Ne}from"./CGkVb7zx.js";import{g as me}from"./CluvpHAZ.js";import{f as Me,l as F,h as Le}from"./4RHrTr5V.js";function St(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];S(s,O({name:"info"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}var Te=z("<kbd><!></kbd>");function ie(s,e){m(e,!0);let t=W(e,"ref",15,null),a=b(e,["$$slots","$$events","$$legacy","ref","class","children"]);var n=Te();fe(n,r=>({"data-slot":"kbd",class:r,...a}),[()=>E("bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none","[&_svg:not([class*='size-'])]:size-3","[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",e.class)]);var c=de(n);_(c,()=>e.children??v),ue(n),pe(n,r=>t(r),()=>t()),d(s,n),g()}var Ve=z("<kbd><!></kbd>");function Ce(s,e){m(e,!0);let t=W(e,"ref",15,null),a=b(e,["$$slots","$$events","$$legacy","ref","class","children"]);var n=Ve();fe(n,r=>({"data-slot":"kbd-group",class:r,...a}),[()=>E("inline-flex items-center gap-1",e.class)]);var c=de(n);_(c,()=>e.children??v),ue(n),pe(n,r=>t(r),()=>t()),d(s,n),g()}var xe=z('<span class="text-muted-foreground">+</span>'),Ae=z("<!> <!>",1);function kt(s,e){m(e,!0);let t=W(e,"class",3,"");const a=De(),n=J(()=>{const u=[];e.keys.mod&&u.push(a.mod),e.keys.ctrl&&u.push(a.ctrl),e.keys.alt&&u.push(a.alt),e.keys.shift&&u.push(a.shift);let i=e.keys.key;return i==="Enter"?i=a.enter:i==="Backspace"?i=a.backspace:i==="Delete"?i=a.delete:i==="Escape"?i=a.escape:i==="Tab"?i=a.tab:i.length===1&&(i=i.toUpperCase()),u.push(i),u});var c=p(),r=h(c);{var o=u=>{var i=p(),j=h(i);{let B=J(()=>E(t()));Z(j,()=>ie,(H,R)=>{R(H,{get class(){return f(B)},children:(U,ge)=>{se();var I=re();ae(K=>oe(I,K),[()=>f(n).join("")]),d(U,I)},$$slots:{default:!0}})})}d(u,i)},k=u=>{var i=p(),j=h(i);{let B=J(()=>E(t()));Z(j,()=>Ce,(H,R)=>{R(H,{get class(){return f(B)},children:(U,ge)=>{var I=p(),K=h(I);qe(K,17,()=>f(n),Pe,(ve,_e,be)=>{var X=Ae(),Y=h(X);{var ye=q=>{var Q=xe();d(q,Q)};ne(Y,q=>{be>0&&q(ye)})}var $e=Ie(Y,2);Z($e,()=>ie,(q,Q)=>{Q(q,{children:(we,dt)=>{se();var ee=re();ae(()=>oe(ee,f(_e))),d(we,ee)},$$slots:{default:!0}})}),d(ve,X)}),d(U,I)},$$slots:{default:!0}})})}d(u,i)};ne(r,u=>{Ne()?u(o):u(k,!1)})}d(s,c),g()}function It(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];S(s,O({name:"bot"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function qt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335"}],["path",{d:"m9 11 3 3L22 4"}]];S(s,O({name:"circle-check-big"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function Pt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"m16 18 6-6-6-6"}],["path",{d:"m8 6-6 6 6 6"}]];S(s,O({name:"code"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function Dt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];S(s,O({name:"download"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function Nt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"}],["path",{d:"m21 2-9.6 9.6"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5"}]];S(s,O({name:"key"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function Mt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"M3 5h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 19h.01"}],["path",{d:"M8 5h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 19h13"}]];S(s,O({name:"list"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function Lt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];S(s,O({name:"sparkles"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function Tt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"}]];S(s,O({name:"table-2"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}function Vt(s,e){m(e,!0);/**
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
 */let t=b(e,["$$slots","$$events","$$legacy"]);const a=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:"12",cy:"7",r:"4"}]];S(s,O({name:"user"},()=>t,{get iconNode(){return a},children:(n,c)=>{var r=p(),o=h(r);_(o,()=>e.children??v),d(n,r)},$$slots:{default:!0}})),g()}const Ee=()=>"Failed to copy to clipboard",Fe=()=>"Error al copiar al portapapeles",ze=()=>"فشل النسخ إلى الحافظة",je=()=>"Kopieren in Zwischenablage fehlgeschlagen",Be=()=>"클립보드에 복사 실패",He=()=>"Échec de la copie dans le presse-papiers",Ct=(s={},e={})=>{const t=e.locale??me();return t==="en"?Ee():t==="es"?Fe():t==="ar"?ze():t==="de"?je():t==="ko"?Be():He()},Re=()=>"Error copied to clipboard",Ue=()=>"Error copiado al portapapeles",Ke=()=>"تم نسخ الخطأ إلى الحافظة",Qe=()=>"Fehler in Zwischenablage kopiert",Ge=()=>"오류가 클립보드에 복사되었습니다",Je=()=>"Erreur copiée dans le presse-papiers",xt=(s={},e={})=>{const t=e.locale??me();return t==="en"?Re():t==="es"?Ue():t==="ar"?Ke():t==="de"?Qe():t==="ko"?Ge():Je()},Ze={"app-info":"general",license:"general",theme:"appearance",themes:"appearance",learn:"features"},At={general:["app-info","license"],appearance:["theme","themes"],features:["learn"]};var P,D;class We{constructor(){y(this,P,$(!1));y(this,D,$("general"))}get isOpen(){return f(l(this,P))}set isOpen(e){w(l(this,P),e,!0)}get activeView(){return f(l(this,D))}set activeView(e){w(l(this,D),e,!0)}open(e){this.activeView=e??"general",this.isOpen=!0}close(){this.isOpen=!1}setView(e){this.activeView=e}isGroupView(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"}getActiveGroup(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"?this.activeView:Ze[this.activeView]}}P=new WeakMap,D=new WeakMap;const Et=new We,Xe={postgresql:"postgres",postgres:"postgres",mysql:"mysql",mariadb:"mariadb",sqlite:"sqlite",mssql:"mssql",sqlserver:"mssql",duckdb:"duckdb"},Ye={postgres:5432,mysql:3306,mariadb:3306,sqlite:0,mssql:1433,duckdb:0};async function et(){try{const s=await Me();if(!s)return[];const e=JSON.parse(s);return e.connections?Object.entries(e.connections).map(([t,a])=>({...a,id:t})):[]}catch(s){return console.error("Failed to read DBeaver config:",s),[]}}function tt(s,e){var i;const t=Xe[(i=s.provider)==null?void 0:i.toLowerCase()];if(!t)return null;const a=s.configuration||{},n=a.host||"localhost",c=parseInt(a.port||String(Ye[t]),10),r=a.database||"",o=a.user||"",k=t==="sqlite"?`conn-sqlite-${r}`:`conn-${n}-${c}`,u=e.includes(k);return{original:s,name:s.name,type:t,host:n,port:c,databaseName:r,username:o,isDuplicate:u,selected:!u}}async function st(s){return(await et()).map(t=>tt(t,s)).filter(t=>t!==null)}const ce="dbeaver_import_state.json";var N,M,L,T;class at{constructor(){y(this,N,$(!1));y(this,M,$(!1));y(this,L,$(he([])));y(this,T,$(!1));G(this,"initialized",!1)}get isOpen(){return f(l(this,N))}set isOpen(e){w(l(this,N),e,!0)}get isLoading(){return f(l(this,M))}set isLoading(e){w(l(this,M),e,!0)}get connections(){return f(l(this,L))}set connections(e){w(l(this,L),e,!0)}get hasOfferedImport(){return f(l(this,T))}set hasOfferedImport(e){w(l(this,T),e,!0)}async initialize(){if(!this.initialized){this.initialized=!0;try{const t=await(await F(ce,{autoSave:!1,defaults:{state:null}})).get("state");t&&(this.hasOfferedImport=t.hasOfferedImport)}catch(e){console.error("Failed to load DBeaver import state:",e)}}}async checkAndShowDialog(e){this.isLoading=!0;try{const t=await st(e);t.length>0&&(this.connections=t,this.isOpen=!0)}catch(t){console.error("Failed to check DBeaver connections:",t)}finally{this.isLoading=!1}}toggleConnection(e){this.connections[e]&&!this.connections[e].isDuplicate&&(this.connections[e].selected=!this.connections[e].selected,this.connections=[...this.connections])}selectAll(){this.connections=this.connections.map(e=>({...e,selected:!e.isDuplicate}))}deselectAll(){this.connections=this.connections.map(e=>({...e,selected:!1}))}getSelectedConnections(){return this.connections.filter(e=>e.selected)}async dismiss(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async completeImport(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async persist(){try{const e=await F(ce,{autoSave:!0,defaults:{state:null}}),t={hasOfferedImport:this.hasOfferedImport,lastCheckTimestamp:new Date().toISOString()};await e.set("state",t),await e.save()}catch(e){console.error("Failed to persist DBeaver import state:",e)}}}N=new WeakMap,M=new WeakMap,L=new WeakMap,T=new WeakMap;const Ft=new at,rt={PostgreSQL:"postgres",MySQL:"mysql",MariaDB:"mariadb",SQLite:"sqlite","SQL Server":"mssql"},nt={postgres:5432,mysql:3306,mariadb:3306,sqlite:0,mssql:1433,duckdb:0};async function ot(){try{const s=await Le();if(!s)return[];const e=JSON.parse(s);return Array.isArray(e)?e.filter(t=>typeof t=="object"&&t!==null&&"ID"in t).map(t=>({id:String(t.ID||""),connectionName:String(t.ConnectionName||""),driver:String(t.Driver||""),databaseHost:String(t.DatabaseHost||""),databasePort:String(t.DatabasePort||""),databaseName:String(t.DatabaseName||""),databaseUser:String(t.DatabaseUser||"")})):[]}catch(s){return console.error("Failed to read TablePlus config:",s),[]}}function it(s,e){const t=rt[s.driver];if(!t)return null;const a=s.databaseHost||"localhost",n=parseInt(s.databasePort||String(nt[t]),10),c=s.databaseName||"",r=s.databaseUser||"",o=t==="sqlite"?`conn-sqlite-${c}`:`conn-${a}-${n}`,k=e.includes(o);return{original:s,name:s.connectionName||`${a}:${n}`,type:t,host:a,port:n,databaseName:c,username:r,isDuplicate:k,selected:!k}}async function ct(s){return(await ot()).map(t=>it(t,s)).filter(t=>t!==null)}const le="tableplus_import_state.json";var V,C,x,A;class lt{constructor(){y(this,V,$(!1));y(this,C,$(!1));y(this,x,$(he([])));y(this,A,$(!1));G(this,"initialized",!1)}get isOpen(){return f(l(this,V))}set isOpen(e){w(l(this,V),e,!0)}get isLoading(){return f(l(this,C))}set isLoading(e){w(l(this,C),e,!0)}get connections(){return f(l(this,x))}set connections(e){w(l(this,x),e,!0)}get hasOfferedImport(){return f(l(this,A))}set hasOfferedImport(e){w(l(this,A),e,!0)}async initialize(){if(!this.initialized){this.initialized=!0;try{const t=await(await F(le,{autoSave:!1,defaults:{state:null}})).get("state");t&&(this.hasOfferedImport=t.hasOfferedImport)}catch(e){console.error("Failed to load TablePlus import state:",e)}}}async checkAndShowDialog(e){this.isLoading=!0;try{const t=await ct(e);t.length>0&&(this.connections=t,this.isOpen=!0)}catch(t){console.error("Failed to check TablePlus connections:",t)}finally{this.isLoading=!1}}toggleConnection(e){this.connections[e]&&!this.connections[e].isDuplicate&&(this.connections[e].selected=!this.connections[e].selected,this.connections=[...this.connections])}selectAll(){this.connections=this.connections.map(e=>({...e,selected:!e.isDuplicate}))}deselectAll(){this.connections=this.connections.map(e=>({...e,selected:!1}))}getSelectedConnections(){return this.connections.filter(e=>e.selected)}async dismiss(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async completeImport(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async persist(){try{const e=await F(le,{autoSave:!0,defaults:{state:null}}),t={hasOfferedImport:this.hasOfferedImport,lastCheckTimestamp:new Date().toISOString()};await e.set("state",t),await e.save()}catch(e){console.error("Failed to persist TablePlus import state:",e)}}}V=new WeakMap,C=new WeakMap,x=new WeakMap,A=new WeakMap;const zt=new lt;export{It as B,qt as C,Dt as D,St as I,Nt as K,Mt as L,kt as S,Tt as T,Vt as U,Ct as a,Lt as b,Pt as c,Ft as d,At as g,xt as q,Et as s,zt as t};
