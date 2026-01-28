var $e=Object.defineProperty;var X=s=>{throw TypeError(s)};var ke=(s,e,t)=>e in s?$e(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var V=(s,e,t)=>ke(s,typeof e!="symbol"?e+"":e,t),Se=(s,e,t)=>e.has(s)||X("Cannot "+t);var u=(s,e,t)=>(Se(s,e,"read from private field"),t?t.call(s):e.get(s)),$=(s,e,t)=>e.has(s)?X("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t);import"./Bzak7iHL.js";import{p,f,i as v,a as m,aZ as qe,a_ as xe,e as k,g,h as S,c as le,r as de,n as ee,t as te,b as R,s as Me,ae as Ie}from"./RtNAYh7v.js";import{c as h,a as l,f as H,t as se}from"./G68d9aZ3.js";import{s as y,i as Oe,a as ue}from"./CDLKInbX.js";import{s as b,r as _,p as Z,i as re}from"./Cezg9DFx.js";import{I as w,s as Ne}from"./DvNzxRcs.js";import{s as ne}from"./vJbyZA0Y.js";import{c as C,e as Pe,o as De}from"./BBgqcc6q.js";import{b as fe,c as U,g as he}from"./CifI9K24.js";import{l as ae}from"./CgVjkY4F.js";import{i as Le}from"./DSoDdw3M.js";function wt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];w(s,b({name:"info"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}let j=null;function Ve(){if(Oe())try{if(typeof navigator<"u"){const s=navigator.userAgent.toLowerCase();if(s.includes("mac"))return"macos";if(s.includes("win"))return"windows";if(s.includes("linux"))return"linux"}}catch{}if(typeof navigator<"u"){const s=navigator.userAgent.toLowerCase();if(s.includes("mac"))return"macos";if(s.includes("win"))return"windows";if(s.includes("linux"))return"linux"}return"unknown"}function J(){return j===null&&(j=Ve()),j==="macos"}const oe={mac:{mod:"⌘",ctrl:"⌃",alt:"⌥",shift:"⇧",enter:"↵",backspace:"⌫",delete:"⌦",escape:"⎋",tab:"⇥",up:"↑",down:"↓",left:"←",right:"→"},other:{mod:"Ctrl",ctrl:"Ctrl",alt:"Alt",shift:"Shift",enter:"Enter",backspace:"Backspace",delete:"Delete",escape:"Esc",tab:"Tab",up:"↑",down:"↓",left:"←",right:"→"}};function Ce(){return J()?oe.mac:oe.other}var M;class He{constructor(){V(this,"handlers",new Map);$(this,M,k(!1));V(this,"handleKeydown",e=>{const t=e.target,n=t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t.isContentEditable;if(!n&&e.key==="?"&&!e.metaKey&&!e.ctrlKey&&!e.altKey){e.preventDefault(),this.showHelp=!0;return}for(const r of Ne)if(!r.handledExternally&&this.matchesShortcut(e,r.keys)){if(n&&!this.isGlobalShortcut(r))continue;const o=this.handlers.get(r.id);if(o){e.preventDefault(),o();return}}})}get showHelp(){return g(u(this,M))}set showHelp(e){S(u(this,M),e,!0)}registerHandler(e,t){this.handlers.set(e,t)}unregisterHandler(e){this.handlers.delete(e)}matchesShortcut(e,t){const r=J()?e.metaKey:e.ctrlKey;if(t.mod&&!r||!t.mod&&r||t.ctrl&&!e.ctrlKey||t.alt&&!e.altKey||t.shift!==void 0&&t.shift!==e.shiftKey)return!1;const o=e.key.toLowerCase(),a=t.key.toLowerCase();return o===a||t.key==="]"&&(e.key==="]"||e.key==="}")||t.key==="["&&(e.key==="["||e.key==="{")}isGlobalShortcut(e){return["toggleSidebar","showShortcuts","commandPalette","saveQuery","formatSql","openSettings"].includes(e.id)}toggleHelp(){this.showHelp=!this.showHelp}closeHelp(){this.showHelp=!1}}M=new WeakMap;const pe=Symbol("shortcuts");function $t(){return qe(pe,new He)}function kt(){return xe(pe)}var Ke=H("<kbd><!></kbd>");function ie(s,e){p(e,!0);let t=Z(e,"ref",15,null),n=_(e,["$$slots","$$events","$$legacy","ref","class","children"]);var r=Ke();ue(r,a=>({"data-slot":"kbd",class:a,...n}),[()=>C("bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none","[&_svg:not([class*='size-'])]:size-3","[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",e.class)]);var o=le(r);y(o,()=>e.children??v),de(r),fe(r,a=>t(a),()=>t()),l(s,r),m()}var Ee=H("<kbd><!></kbd>");function Te(s,e){p(e,!0);let t=Z(e,"ref",15,null),n=_(e,["$$slots","$$events","$$legacy","ref","class","children"]);var r=Ee();ue(r,a=>({"data-slot":"kbd-group",class:a,...n}),[()=>C("inline-flex items-center gap-1",e.class)]);var o=le(r);y(o,()=>e.children??v),de(r),fe(r,a=>t(a),()=>t()),l(s,r),m()}var Ae=H('<span class="text-muted-foreground">+</span>'),Be=H("<!> <!>",1);function St(s,e){p(e,!0);let t=Z(e,"class",3,"");const n=Ce(),r=R(()=>{const d=[];e.keys.mod&&d.push(n.mod),e.keys.ctrl&&d.push(n.ctrl),e.keys.alt&&d.push(n.alt),e.keys.shift&&d.push(n.shift);let c=e.keys.key;return c==="Enter"?c=n.enter:c==="Backspace"?c=n.backspace:c==="Delete"?c=n.delete:c==="Escape"?c=n.escape:c==="Tab"?c=n.tab:c.length===1&&(c=c.toUpperCase()),d.push(c),d});var o=h(),a=f(o);{var i=d=>{var c=h(),E=f(c);{let T=R(()=>C(t()));U(E,()=>ie,(A,B)=>{B(A,{get class(){return g(T)},children:(F,me)=>{ee();var q=se();te(z=>ne(q,z),[()=>g(r).join("")]),l(F,q)},$$slots:{default:!0}})})}l(d,c)},K=d=>{var c=h(),E=f(c);{let T=R(()=>C(t()));U(E,()=>Te,(A,B)=>{B(A,{get class(){return g(T)},children:(F,me)=>{var q=h(),z=f(q);Pe(z,17,()=>g(r),De,(ge,ve,ye)=>{var Q=Be(),Y=f(Q);{var _e=x=>{var G=Ae();l(x,G)};re(Y,x=>{ye>0&&x(_e)})}var be=Me(Y,2);U(be,()=>ie,(x,G)=>{G(x,{children:(we,ct)=>{ee();var W=se();te(()=>ne(W,g(ve))),l(we,W)},$$slots:{default:!0}})}),l(ge,Q)}),l(F,q)},$$slots:{default:!0}})})}l(d,c)};re(a,d=>{J()?d(i):d(K,!1)})}l(s,o),m()}function qt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];w(s,b({name:"bot"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function xt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335"}],["path",{d:"m9 11 3 3L22 4"}]];w(s,b({name:"circle-check-big"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function Mt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"m16 18 6-6-6-6"}],["path",{d:"m8 6-6 6 6 6"}]];w(s,b({name:"code"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function It(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];w(s,b({name:"download"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function Ot(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"}],["path",{d:"m21 2-9.6 9.6"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5"}]];w(s,b({name:"key"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function Nt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M3 5h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 19h.01"}],["path",{d:"M8 5h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 19h13"}]];w(s,b({name:"list"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function Pt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];w(s,b({name:"sparkles"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function Dt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"}]];w(s,b({name:"table-2"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}function Lt(s,e){p(e,!0);/**
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
 */let t=_(e,["$$slots","$$events","$$legacy"]);const n=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:"12",cy:"7",r:"4"}]];w(s,b({name:"user"},()=>t,{get iconNode(){return n},children:(r,o)=>{var a=h(),i=f(a);y(i,()=>e.children??v),l(r,a)},$$slots:{default:!0}})),m()}const Fe=()=>"Failed to copy to clipboard",ze=()=>"Error al copiar al portapapeles",Ge=()=>"فشل النسخ إلى الحافظة",Re=()=>"Kopieren in Zwischenablage fehlgeschlagen",Ue=()=>"클립보드에 복사 실패",je=()=>"Échec de la copie dans le presse-papiers",Vt=(s={},e={})=>{const t=e.locale??he();return t==="en"?Fe():t==="es"?ze():t==="ar"?Ge():t==="de"?Re():t==="ko"?Ue():je()},Ze=()=>"Error copied to clipboard",Je=()=>"Error copiado al portapapeles",Qe=()=>"تم نسخ الخطأ إلى الحافظة",Ye=()=>"Fehler in Zwischenablage kopiert",We=()=>"오류가 클립보드에 복사되었습니다",Xe=()=>"Erreur copiée dans le presse-papiers",Ct=(s={},e={})=>{const t=e.locale??he();return t==="en"?Ze():t==="es"?Je():t==="ar"?Qe():t==="de"?Ye():t==="ko"?We():Xe()},et={"app-info":"general",theme:"appearance",themes:"appearance",learn:"features"},Ht={general:["app-info"],appearance:["theme","themes"],features:["learn"]};var I,O;class tt{constructor(){$(this,I,k(!1));$(this,O,k("general"))}get isOpen(){return g(u(this,I))}set isOpen(e){S(u(this,I),e,!0)}get activeView(){return g(u(this,O))}set activeView(e){S(u(this,O),e,!0)}open(e){this.activeView=e??"general",this.isOpen=!0}close(){this.isOpen=!1}setView(e){this.activeView=e}isGroupView(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"}getActiveGroup(){return this.activeView==="general"||this.activeView==="appearance"||this.activeView==="features"?this.activeView:et[this.activeView]}}I=new WeakMap,O=new WeakMap;const Kt=new tt,st={postgresql:"postgres",postgres:"postgres",mysql:"mysql",mariadb:"mariadb",sqlite:"sqlite",mssql:"mssql",sqlserver:"mssql",duckdb:"duckdb"},rt={postgres:5432,mysql:3306,mariadb:3306,sqlite:0,mssql:1433,duckdb:0};async function nt(){try{const s=await Le("read_dbeaver_config");if(!s)return[];const e=JSON.parse(s);return e.connections?Object.entries(e.connections).map(([t,n])=>({...n,id:t})):[]}catch(s){return console.error("Failed to read DBeaver config:",s),[]}}function at(s,e){var c;const t=st[(c=s.provider)==null?void 0:c.toLowerCase()];if(!t)return null;const n=s.configuration||{},r=n.host||"localhost",o=parseInt(n.port||String(rt[t]),10),a=n.database||"",i=n.user||"",K=t==="sqlite"?`conn-sqlite-${a}`:`conn-${r}-${o}`,d=e.includes(K);return{original:s,name:s.name,type:t,host:r,port:o,databaseName:a,username:i,isDuplicate:d,selected:!d}}async function ot(s){return(await nt()).map(t=>at(t,s)).filter(t=>t!==null)}const ce="dbeaver_import_state.json";var N,P,D,L;class it{constructor(){$(this,N,k(!1));$(this,P,k(!1));$(this,D,k(Ie([])));$(this,L,k(!1));V(this,"initialized",!1)}get isOpen(){return g(u(this,N))}set isOpen(e){S(u(this,N),e,!0)}get isLoading(){return g(u(this,P))}set isLoading(e){S(u(this,P),e,!0)}get connections(){return g(u(this,D))}set connections(e){S(u(this,D),e,!0)}get hasOfferedImport(){return g(u(this,L))}set hasOfferedImport(e){S(u(this,L),e,!0)}async initialize(){if(!this.initialized){this.initialized=!0;try{const t=await(await ae(ce,{autoSave:!1,defaults:{state:null}})).get("state");t&&(this.hasOfferedImport=t.hasOfferedImport)}catch(e){console.error("Failed to load DBeaver import state:",e)}}}async checkAndShowDialog(e){this.isLoading=!0;try{const t=await ot(e);t.length>0&&(this.connections=t,this.isOpen=!0)}catch(t){console.error("Failed to check DBeaver connections:",t)}finally{this.isLoading=!1}}toggleConnection(e){this.connections[e]&&!this.connections[e].isDuplicate&&(this.connections[e].selected=!this.connections[e].selected,this.connections=[...this.connections])}selectAll(){this.connections=this.connections.map(e=>({...e,selected:!e.isDuplicate}))}deselectAll(){this.connections=this.connections.map(e=>({...e,selected:!1}))}getSelectedConnections(){return this.connections.filter(e=>e.selected)}async dismiss(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async completeImport(){this.isOpen=!1,this.hasOfferedImport=!0,await this.persist()}async persist(){try{const e=await ae(ce,{autoSave:!0,defaults:{state:null}}),t={hasOfferedImport:this.hasOfferedImport,lastCheckTimestamp:new Date().toISOString()};await e.set("state",t),await e.save()}catch(e){console.error("Failed to persist DBeaver import state:",e)}}}N=new WeakMap,P=new WeakMap,D=new WeakMap,L=new WeakMap;const Et=new it;export{qt as B,xt as C,It as D,wt as I,Ot as K,Nt as L,St as S,Dt as T,Lt as U,Vt as a,Pt as b,Mt as c,Et as d,$t as e,Ht as g,J as i,Ct as q,Kt as s,kt as u};
