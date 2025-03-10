(()=>{var e={};e.id=6123,e.ids=[6123],e.modules={96330:e=>{"use strict";e.exports=require("@prisma/client")},5486:e=>{"use strict";e.exports=require("bcrypt")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},33873:e=>{"use strict";e.exports=require("path")},11723:e=>{"use strict";e.exports=require("querystring")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},51899:(e,s,r)=>{"use strict";r.r(s),r.d(s,{GlobalError:()=>n.a,__next_app__:()=>m,pages:()=>c,routeModule:()=>u,tree:()=>d});var t=r(70260),a=r(28203),i=r(25155),n=r.n(i),l=r(67292),o={};for(let e in l)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);r.d(s,o);let d=["",{children:["reseller",{children:["packages",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,4911)),"/home/beane/projects/my-app/my-app/app/reseller/packages/[id]/page.tsx"]}]},{}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,19611)),"/home/beane/projects/my-app/my-app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,41485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["/home/beane/projects/my-app/my-app/app/reseller/packages/[id]/page.tsx"],m={require:r,loadChunk:()=>Promise.resolve()},u=new t.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/reseller/packages/[id]/page",pathname:"/reseller/packages/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},75212:(e,s,r)=>{Promise.resolve().then(r.bind(r,93188)),Promise.resolve().then(r.bind(r,40545)),Promise.resolve().then(r.bind(r,72940))},38764:(e,s,r)=>{Promise.resolve().then(r.bind(r,29861)),Promise.resolve().then(r.bind(r,28013)),Promise.resolve().then(r.bind(r,34555))},22096:(e,s,r)=>{"use strict";r.d(s,{c:()=>l});var t=r(45512),a=r(21957),i=r(10985),n=r(59462);function l({icon:e,className:s,...r}){let l=a[e]||i.A;return(0,t.jsx)(l,{className:(0,n.cn)("h-4 w-4",s),...r})}},29861:(e,s,r)=>{"use strict";r.d(s,{PackageDetail:()=>T});var t=r(45512),a=r(58009),i=r(79334),n=r(45103),l=r(87021),o=r(97643),d=r(71227),c=r(59462),m=r(22096),u=r(35668),p=r(10985),x=r(91124),h=r(6868),f=r(81914),j=r(16131),v=r(94727),g=r(25409),b=r(48859),N=r(65518),y=r(86235);let w=j.z.object({customerName:j.z.string().min(1,"Nama pelanggan wajib diisi"),customerPhone:j.z.string().min(1,"Nomor telepon wajib diisi"),customerAddress:j.z.string().optional()});function k({packageData:e,resellerId:s,onCancel:r}){let[n,d]=(0,a.useState)(!1),m=(0,i.useRouter)(),{toast:u}=(0,N.dj)(),p=(0,h.mN)({resolver:(0,f.u)(w),defaultValues:{customerName:"",customerPhone:"",customerAddress:""}}),x=async r=>{d(!0);try{let t=await fetch("/api/transactions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...r,packageId:e.id,resellerId:s,totalAmount:e.price,tenorMonths:e.tenorMonths,monthlyAmount:e.monthlyAmount})});if(!t.ok){let e=await t.json();throw Error(e.message||"Terjadi kesalahan saat membuat transaksi")}let a=await t.json();u({title:"Berhasil",description:"Transaksi berhasil dibuat"}),m.push(`/reseller/transactions/${a.id}`),m.refresh()}catch(e){u({variant:"destructive",title:"Gagal",description:e instanceof Error?e.message:"Terjadi kesalahan saat membuat transaksi"})}finally{d(!1)}};return(0,t.jsxs)(o.Zp,{children:[(0,t.jsxs)(o.aR,{children:[(0,t.jsx)(o.ZB,{children:"Buat Transaksi"}),(0,t.jsx)(o.BT,{children:"Masukkan informasi pelanggan untuk membuat transaksi baru"})]}),(0,t.jsxs)(o.Wu,{children:[(0,t.jsxs)("div",{className:"mb-6 p-4 bg-muted rounded-md",children:[(0,t.jsx)("h3",{className:"font-medium mb-2",children:"Informasi Paket"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2 text-sm",children:[(0,t.jsx)("div",{children:"Nama Paket:"}),(0,t.jsx)("div",{className:"font-medium",children:e.name}),(0,t.jsx)("div",{children:"Harga Total:"}),(0,t.jsx)("div",{className:"font-medium",children:(0,c.vv)(e.price)}),(0,t.jsx)("div",{children:"Tenor:"}),(0,t.jsxs)("div",{className:"font-medium",children:[e.tenorMonths," bulan"]}),(0,t.jsx)("div",{children:"Cicilan per Bulan:"}),(0,t.jsx)("div",{className:"font-medium",children:(0,c.vv)(e.monthlyAmount)})]})]}),(0,t.jsx)(v.lV,{...p,children:(0,t.jsxs)("form",{onSubmit:p.handleSubmit(x),className:"space-y-4",children:[(0,t.jsx)(v.zB,{control:p.control,name:"customerName",render:({field:e})=>(0,t.jsxs)(v.eI,{children:[(0,t.jsx)(v.lR,{children:"Nama Pelanggan"}),(0,t.jsx)(v.MJ,{children:(0,t.jsx)(g.p,{placeholder:"Masukkan nama pelanggan",...e})}),(0,t.jsx)(v.C5,{})]})}),(0,t.jsx)(v.zB,{control:p.control,name:"customerPhone",render:({field:e})=>(0,t.jsxs)(v.eI,{children:[(0,t.jsx)(v.lR,{children:"Nomor Telepon"}),(0,t.jsx)(v.MJ,{children:(0,t.jsx)(g.p,{placeholder:"Masukkan nomor telepon pelanggan",...e})}),(0,t.jsx)(v.C5,{})]})}),(0,t.jsx)(v.zB,{control:p.control,name:"customerAddress",render:({field:e})=>(0,t.jsxs)(v.eI,{children:[(0,t.jsx)(v.lR,{children:"Alamat (Opsional)"}),(0,t.jsx)(v.MJ,{children:(0,t.jsx)(b.T,{placeholder:"Masukkan alamat pelanggan",...e,value:e.value||""})}),(0,t.jsx)(v.C5,{})]})})]})})]}),(0,t.jsxs)(o.wL,{className:"flex justify-end gap-4",children:[(0,t.jsx)(l.$,{type:"button",variant:"outline",onClick:r,disabled:n,children:"Batal"}),(0,t.jsxs)(l.$,{onClick:p.handleSubmit(x),disabled:n,children:[n&&(0,t.jsx)(y.A,{className:"mr-2 h-4 w-4 animate-spin"}),"Buat Transaksi"]})]})]})}function T({packageData:e,resellerId:s}){let[r,h]=(0,a.useState)(!1),f=(0,i.useRouter)();return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(l.$,{variant:"outline",size:"icon",onClick:()=>f.back(),className:"h-8 w-8",children:(0,t.jsx)(u.A,{className:"h-4 w-4"})}),(0,t.jsx)("h1",{className:"text-2xl font-bold",children:"Detail Paket"})]}),(0,t.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,t.jsxs)(o.Zp,{children:[(0,t.jsxs)(o.aR,{className:"pb-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(m.c,{icon:e.packageType.icon,className:"h-5 w-5"}),(0,t.jsx)(o.ZB,{children:e.name})]}),(0,t.jsx)(o.BT,{className:"mt-2",children:e.description||"Tidak ada deskripsi"})]}),(0,t.jsx)(o.Wu,{className:"pb-3",children:(0,t.jsx)("div",{className:"aspect-video relative rounded-md overflow-hidden mb-4",children:e.imageUrl?(0,t.jsx)(n.default,{src:e.imageUrl||"/placeholder.svg",alt:e.name,fill:!0,className:"object-cover"}):(0,t.jsx)("div",{className:"w-full h-full flex items-center justify-center bg-muted",children:(0,t.jsx)(p.A,{className:"h-12 w-12 text-muted-foreground"})})})})]}),(0,t.jsxs)(o.Zp,{children:[(0,t.jsx)(o.aR,{children:(0,t.jsx)(o.ZB,{children:"Informasi Harga"})}),(0,t.jsx)(o.Wu,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Jenis Paket:"}),(0,t.jsx)("span",{className:"font-medium",children:e.packageType.name})]}),(0,t.jsx)(d.w,{}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Harga Total:"}),(0,t.jsx)("span",{className:"font-medium",children:(0,c.vv)(e.price)})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Tenor:"}),(0,t.jsxs)("span",{className:"font-medium",children:[e.tenorMonths," bulan"]})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Cicilan per Bulan:"}),(0,t.jsx)("span",{className:"font-medium",children:(0,c.vv)(e.monthlyAmount)})]})]})}),(0,t.jsx)(o.wL,{children:(0,t.jsxs)(l.$,{className:"w-full",onClick:()=>h(!0),disabled:r,children:[(0,t.jsx)(x.A,{className:"mr-2 h-4 w-4"}),"Buat Transaksi"]})})]})]}),r&&(0,t.jsx)(k,{packageData:e,resellerId:s,onCancel:()=>h(!1)})]})}},94727:(e,s,r)=>{"use strict";r.d(s,{C5:()=>v,MJ:()=>f,Rr:()=>j,eI:()=>x,lR:()=>h,lV:()=>d,zB:()=>m});var t=r(45512),a=r(58009),i=r(12705),n=r(6868),l=r(59462),o=r(47699);let d=n.Op,c=a.createContext({}),m=({...e})=>(0,t.jsx)(c.Provider,{value:{name:e.name},children:(0,t.jsx)(n.xI,{...e})}),u=()=>{let e=a.useContext(c),s=a.useContext(p),{getFieldState:r,formState:t}=(0,n.xW)(),i=r(e.name,t);if(!e)throw Error("useFormField should be used within <FormField>");let{id:l}=s;return{id:l,name:e.name,formItemId:`${l}-form-item`,formDescriptionId:`${l}-form-item-description`,formMessageId:`${l}-form-item-message`,...i}},p=a.createContext({}),x=a.forwardRef(({className:e,...s},r)=>{let i=a.useId();return(0,t.jsx)(p.Provider,{value:{id:i},children:(0,t.jsx)("div",{ref:r,className:(0,l.cn)("space-y-2",e),...s})})});x.displayName="FormItem";let h=a.forwardRef(({className:e,...s},r)=>{let{error:a,formItemId:i}=u();return(0,t.jsx)(o.J,{ref:r,className:(0,l.cn)(a&&"text-destructive",e),htmlFor:i,...s})});h.displayName="FormLabel";let f=a.forwardRef(({...e},s)=>{let{error:r,formItemId:a,formDescriptionId:n,formMessageId:l}=u();return(0,t.jsx)(i.DX,{ref:s,id:a,"aria-describedby":r?`${n} ${l}`:`${n}`,"aria-invalid":!!r,...e})});f.displayName="FormControl";let j=a.forwardRef(({className:e,...s},r)=>{let{formDescriptionId:a}=u();return(0,t.jsx)("p",{ref:r,id:a,className:(0,l.cn)("text-[0.8rem] text-muted-foreground",e),...s})});j.displayName="FormDescription";let v=a.forwardRef(({className:e,children:s,...r},a)=>{let{error:i,formMessageId:n}=u(),o=i?String(i?.message??""):s;return o?(0,t.jsx)("p",{ref:a,id:n,className:(0,l.cn)("text-[0.8rem] font-medium text-destructive",e),...r,children:o}):null});v.displayName="FormMessage"},25409:(e,s,r)=>{"use strict";r.d(s,{p:()=>n});var t=r(45512),a=r(58009),i=r(59462);let n=a.forwardRef(({className:e,type:s,...r},a)=>(0,t.jsx)("input",{type:s,className:(0,i.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:a,...r}));n.displayName="Input"},47699:(e,s,r)=>{"use strict";r.d(s,{J:()=>d});var t=r(45512),a=r(58009),i=r(92405),n=r(21643),l=r(59462);let o=(0,n.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=a.forwardRef(({className:e,...s},r)=>(0,t.jsx)(i.b,{ref:r,className:(0,l.cn)(o(),e),...s}));d.displayName=i.b.displayName},71227:(e,s,r)=>{"use strict";r.d(s,{w:()=>c});var t=r(45512),a=r(58009),i=r(30830),n="horizontal",l=["horizontal","vertical"],o=a.forwardRef((e,s)=>{let{decorative:r,orientation:a=n,...o}=e,d=l.includes(a)?a:n;return(0,t.jsx)(i.sG.div,{"data-orientation":d,...r?{role:"none"}:{"aria-orientation":"vertical"===d?d:void 0,role:"separator"},...o,ref:s})});o.displayName="Separator";var d=r(59462);let c=a.forwardRef(({className:e,orientation:s="horizontal",decorative:r=!0,...a},i)=>(0,t.jsx)(o,{ref:i,decorative:r,orientation:s,className:(0,d.cn)("shrink-0 bg-border","horizontal"===s?"h-[1px] w-full":"h-full w-[1px]",e),...a}));c.displayName=o.displayName},48859:(e,s,r)=>{"use strict";r.d(s,{T:()=>n});var t=r(45512),a=r(58009),i=r(59462);let n=a.forwardRef(({className:e,...s},r)=>(0,t.jsx)("textarea",{className:(0,i.cn)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:r,...s}));n.displayName="Textarea"},65518:(e,s,r)=>{"use strict";r.d(s,{dj:()=>u});var t=r(58009);let a=0,i=new Map,n=e=>{if(i.has(e))return;let s=setTimeout(()=>{i.delete(e),c({type:"REMOVE_TOAST",toastId:e})},1e6);i.set(e,s)},l=(e,s)=>{switch(s.type){case"ADD_TOAST":return{...e,toasts:[s.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===s.toast.id?{...e,...s.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=s;return r?n(r):e.toasts.forEach(e=>{n(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===s.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==s.toastId)}}},o=[],d={toasts:[]};function c(e){d=l(d,e),o.forEach(e=>{e(d)})}function m({...e}){let s=(a=(a+1)%Number.MAX_VALUE).toString(),r=()=>c({type:"DISMISS_TOAST",toastId:s});return c({type:"ADD_TOAST",toast:{...e,id:s,open:!0,onOpenChange:e=>{e||r()}}}),{id:s,dismiss:r,update:e=>c({type:"UPDATE_TOAST",toast:{...e,id:s}})}}function u(){let[e,s]=t.useState(d);return t.useEffect(()=>(o.push(s),()=>{let e=o.indexOf(s);e>-1&&o.splice(e,1)}),[e]),{...e,toast:m,dismiss:e=>c({type:"DISMISS_TOAST",toastId:e})}}},4911:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>c});var t=r(62740),a=r(51825),i=r(31831),n=r(45369),l=r(62545),o=r(37941),d=r(93188);async function c({params:e}){let s=await (0,a.getServerSession)(n.N);s&&"RESELLER"===s.user.role||(0,i.redirect)("/");let r=await l.db.package.findUnique({where:{id:e.id,isActive:!0},include:{packageType:!0}});return r||(0,i.notFound)(),(0,t.jsx)(o.v,{children:(0,t.jsx)("div",{className:"p-6",children:(0,t.jsx)(d.PackageDetail,{packageData:r,resellerId:s.user.id})})})}},93188:(e,s,r)=>{"use strict";r.d(s,{PackageDetail:()=>t});let t=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call PackageDetail() from the server but PackageDetail is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/beane/projects/my-app/my-app/components/reseller/package-detail.tsx","PackageDetail")}};var s=require("../../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[638,8728,3618,7928,159,1957,8310,5103,4999,3666],()=>r(51899));module.exports=t})();