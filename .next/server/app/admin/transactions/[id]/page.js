(()=>{var e={};e.id=1728,e.ids=[1728],e.modules={96330:e=>{"use strict";e.exports=require("@prisma/client")},5486:e=>{"use strict";e.exports=require("bcrypt")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},33873:e=>{"use strict";e.exports=require("path")},11723:e=>{"use strict";e.exports=require("querystring")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},39461:(e,s,a)=>{"use strict";a.r(s),a.d(s,{GlobalError:()=>i.a,__next_app__:()=>m,pages:()=>o,routeModule:()=>u,tree:()=>c});var t=a(70260),r=a(28203),n=a(25155),i=a.n(n),l=a(67292),d={};for(let e in l)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>l[e]);a.d(s,d);let c=["",{children:["admin",{children:["transactions",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,28238)),"/home/beane/projects/my-app/my-app/app/admin/transactions/[id]/page.tsx"]}]},{}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(a.bind(a,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(a.bind(a,19611)),"/home/beane/projects/my-app/my-app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(a.t.bind(a,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(a.t.bind(a,41485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(a.bind(a,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],o=["/home/beane/projects/my-app/my-app/app/admin/transactions/[id]/page.tsx"],m={require:a,loadChunk:()=>Promise.resolve()},u=new t.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/admin/transactions/[id]/page",pathname:"/admin/transactions/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},15750:(e,s,a)=>{Promise.resolve().then(a.bind(a,22323)),Promise.resolve().then(a.bind(a,5986)),Promise.resolve().then(a.bind(a,11710))},85486:(e,s,a)=>{Promise.resolve().then(a.bind(a,72119)),Promise.resolve().then(a.bind(a,73654)),Promise.resolve().then(a.bind(a,83232))},83232:(e,s,a)=>{"use strict";a.d(s,{AdminTransactionDetail:()=>A});var t=a(45512),r=a(58009),n=a(79334),i=a(87021),l=a(97643),d=a(54871),c=a(71227),o=a(77766),m=a(65518),u=a(59462),x=a(22096),p=a(35668),h=a(97832),f=a(46583),j=a(96795),v=a(28531),N=a.n(v),g=a(4643),y=a(24849),b=a(44269),w=a(21956);function k({payments:e}){let s=e=>{switch(e){case"WAITING_FOR_PAYMENT":return(0,t.jsxs)(d.E,{variant:"outline",className:"flex items-center gap-1",children:[(0,t.jsx)(g.A,{className:"h-3 w-3"}),"Menunggu Pembayaran"]});case"WAITING_FOR_APPROVAL":return(0,t.jsxs)(d.E,{variant:"outline",className:"flex items-center gap-1",children:[(0,t.jsx)(g.A,{className:"h-3 w-3"}),"Menunggu Persetujuan"]});case"APPROVED":return(0,t.jsxs)(d.E,{variant:"success",className:"flex items-center gap-1",children:[(0,t.jsx)(y.A,{className:"h-3 w-3"}),"Disetujui"]});case"REJECTED":return(0,t.jsxs)(d.E,{variant:"destructive",className:"flex items-center gap-1",children:[(0,t.jsx)(b.A,{className:"h-3 w-3"}),"Ditolak"]});default:return(0,t.jsx)(d.E,{variant:"outline",children:e})}};return 0===e.length?(0,t.jsx)("p",{className:"text-center text-muted-foreground",children:"Tidak ada data pembayaran"}):(0,t.jsx)("div",{className:"space-y-4",children:e.map(e=>(0,t.jsxs)("div",{className:"flex flex-col gap-2 rounded-lg border p-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"font-medium",children:["Cicilan ",(0,u.Yq)(e.dueDate)]}),s(e.status)]}),(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Jumlah:"}),(0,t.jsx)("span",{children:(0,u.vv)(e.amount)})]}),e.paidDate&&(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Tanggal Bayar:"}),(0,t.jsx)("span",{children:(0,u.Yq)(e.paidDate)})]}),e.resellerBonus&&(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Bonus Reseller:"}),(0,t.jsx)("span",{children:(0,u.vv)(e.resellerBonus)})]}),e.adminBonus&&(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Bonus Admin:"}),(0,t.jsx)("span",{children:(0,u.vv)(e.adminBonus)})]}),(0,t.jsx)("div",{className:"mt-2",children:e.proofImageUrl?(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Bukti pembayaran telah diunggah"}),(0,t.jsxs)(i.$,{variant:"outline",size:"sm",onClick:()=>window.open(e.proofImageUrl,"_blank"),children:[(0,t.jsx)(w.A,{className:"mr-2 h-4 w-4"}),"Lihat Bukti"]})]}):(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Belum ada bukti pembayaran"})}),"WAITING_FOR_APPROVAL"===e.status&&e.proofImageUrl&&(0,t.jsx)("div",{className:"mt-2",children:(0,t.jsx)(N(),{href:`/admin/payments/${e.id}`,children:(0,t.jsx)(i.$,{size:"sm",className:"w-full",children:"Proses Pembayaran"})})})]},e.id))})}function A({transaction:e}){let[s,a]=(0,r.useState)(!1),v=(0,n.useRouter)(),{toast:N}=(0,m.dj)(),g=e=>{switch(e){case"ACTIVE":return(0,t.jsx)(d.E,{variant:"default",children:"Aktif"});case"COMPLETED":return(0,t.jsx)(d.E,{variant:"success",children:"Selesai"});case"CANCELLED":return(0,t.jsx)(d.E,{variant:"destructive",children:"Dibatalkan"});default:return(0,t.jsx)(d.E,{variant:"outline",children:e})}},y=async s=>{a(!0);try{let a=await fetch(`/api/transactions/${e.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:s})});if(!a.ok){let e=await a.json();throw Error(e.message||"Terjadi kesalahan saat memperbarui status transaksi")}N({title:"Berhasil",description:`Status transaksi berhasil diubah menjadi ${"COMPLETED"===s?"Selesai":"Dibatalkan"}`}),v.refresh()}catch(e){N({variant:"destructive",title:"Gagal",description:e instanceof Error?e.message:"Terjadi kesalahan saat memperbarui status transaksi"})}finally{a(!1)}};return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(i.$,{variant:"outline",size:"icon",onClick:()=>v.back(),className:"h-8 w-8",children:(0,t.jsx)(p.A,{className:"h-4 w-4"})}),(0,t.jsx)("h1",{className:"text-2xl font-bold",children:"Detail Transaksi"})]}),(0,t.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,t.jsxs)(l.Zp,{children:[(0,t.jsxs)(l.aR,{className:"pb-3",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(x.c,{icon:e.package.packageType.icon,className:"h-5 w-5"}),(0,t.jsx)(l.ZB,{children:e.package.name})]}),g(e.status)]}),(0,t.jsxs)(l.BT,{className:"mt-2",children:["ID Transaksi: ",e.id]})]}),(0,t.jsx)(l.Wu,{className:"pb-3",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-medium mb-2",children:"Informasi Paket"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Jenis Paket:"}),(0,t.jsx)("span",{className:"font-medium",children:e.package.packageType.name})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Harga Total:"}),(0,t.jsx)("span",{className:"font-medium",children:(0,u.vv)(e.totalAmount)})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Tenor:"}),(0,t.jsxs)("span",{className:"font-medium",children:[e.tenorMonths," bulan"]})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Cicilan per Bulan:"}),(0,t.jsx)("span",{className:"font-medium",children:(0,u.vv)(e.monthlyAmount)})]})]})]}),(0,t.jsx)(c.w,{}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-medium mb-2",children:"Informasi Reseller"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Nama:"}),(0,t.jsx)("span",{className:"font-medium",children:e.reseller.name})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Email:"}),(0,t.jsx)("span",{className:"font-medium",children:e.reseller.email})]})]})]}),(0,t.jsx)(c.w,{}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-medium mb-2",children:"Informasi Pelanggan"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Nama:"}),(0,t.jsx)("span",{className:"font-medium",children:e.customerName})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Telepon:"}),(0,t.jsx)("span",{className:"font-medium",children:e.customerPhone})]}),e.customerAddress&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Alamat:"}),(0,t.jsx)("span",{className:"font-medium text-right",children:e.customerAddress})]})]})]}),(0,t.jsx)(c.w,{}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-medium mb-2",children:"Informasi Transaksi"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Tanggal Transaksi:"}),(0,t.jsx)("span",{className:"font-medium",children:(0,u.Yq)(e.createdAt)})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Status:"}),(0,t.jsx)("span",{className:"font-medium",children:g(e.status)})]})]})]})]})}),(0,t.jsx)(l.wL,{className:"flex justify-end gap-4",children:"ACTIVE"===e.status&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(o.Lt,{children:[(0,t.jsx)(o.tv,{asChild:!0,children:(0,t.jsxs)(i.$,{variant:"outline",children:[(0,t.jsx)(h.A,{className:"mr-2 h-4 w-4"}),"Batalkan"]})}),(0,t.jsxs)(o.EO,{children:[(0,t.jsxs)(o.wd,{children:[(0,t.jsx)(o.r7,{children:"Batalkan Transaksi"}),(0,t.jsx)(o.$v,{children:"Apakah Anda yakin ingin membatalkan transaksi ini? Tindakan ini tidak dapat dibatalkan."})]}),(0,t.jsxs)(o.ck,{children:[(0,t.jsx)(o.Zr,{children:"Batal"}),(0,t.jsx)(o.Rx,{onClick:()=>y("CANCELLED"),disabled:s,children:s?"Memproses...":"Ya, Batalkan"})]})]})]}),(0,t.jsxs)(o.Lt,{children:[(0,t.jsx)(o.tv,{asChild:!0,children:(0,t.jsxs)(i.$,{children:[(0,t.jsx)(f.A,{className:"mr-2 h-4 w-4"}),"Selesaikan"]})}),(0,t.jsxs)(o.EO,{children:[(0,t.jsxs)(o.wd,{children:[(0,t.jsx)(o.r7,{children:"Selesaikan Transaksi"}),(0,t.jsx)(o.$v,{children:"Apakah Anda yakin ingin menyelesaikan transaksi ini? Tindakan ini tidak dapat dibatalkan."})]}),(0,t.jsxs)(o.ck,{children:[(0,t.jsx)(o.Zr,{children:"Batal"}),(0,t.jsx)(o.Rx,{onClick:()=>y("COMPLETED"),disabled:s,children:s?"Memproses...":"Ya, Selesaikan"})]})]})]})]})})]}),(0,t.jsxs)(l.Zp,{children:[(0,t.jsxs)(l.aR,{children:[(0,t.jsxs)(l.ZB,{className:"flex items-center gap-2",children:[(0,t.jsx)(j.A,{className:"h-5 w-5"}),"Pembayaran"]}),(0,t.jsx)(l.BT,{children:"Daftar cicilan pembayaran untuk transaksi ini"})]}),(0,t.jsx)(l.Wu,{children:(0,t.jsx)(k,{payments:e.payments})})]})]})]})}},22096:(e,s,a)=>{"use strict";a.d(s,{c:()=>l});var t=a(45512),r=a(21957),n=a(10985),i=a(59462);function l({icon:e,className:s,...a}){let l=r[e]||n.A;return(0,t.jsx)(l,{className:(0,i.cn)("h-4 w-4",s),...a})}},77766:(e,s,a)=>{"use strict";a.d(s,{$v:()=>f,EO:()=>u,Lt:()=>d,Rx:()=>j,Zr:()=>v,ck:()=>p,r7:()=>h,tv:()=>c,wd:()=>x});var t=a(45512),r=a(58009),n=a(6244),i=a(59462),l=a(87021);let d=n.bL,c=n.l9,o=n.ZL,m=r.forwardRef(({className:e,...s},a)=>(0,t.jsx)(n.hJ,{className:(0,i.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...s,ref:a}));m.displayName=n.hJ.displayName;let u=r.forwardRef(({className:e,...s},a)=>(0,t.jsxs)(o,{children:[(0,t.jsx)(m,{}),(0,t.jsx)(n.UC,{ref:a,className:(0,i.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...s})]}));u.displayName=n.UC.displayName;let x=({className:e,...s})=>(0,t.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-2 text-center sm:text-left",e),...s});x.displayName="AlertDialogHeader";let p=({className:e,...s})=>(0,t.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...s});p.displayName="AlertDialogFooter";let h=r.forwardRef(({className:e,...s},a)=>(0,t.jsx)(n.hE,{ref:a,className:(0,i.cn)("text-lg font-semibold",e),...s}));h.displayName=n.hE.displayName;let f=r.forwardRef(({className:e,...s},a)=>(0,t.jsx)(n.VY,{ref:a,className:(0,i.cn)("text-sm text-muted-foreground",e),...s}));f.displayName=n.VY.displayName;let j=r.forwardRef(({className:e,...s},a)=>(0,t.jsx)(n.rc,{ref:a,className:(0,i.cn)((0,l.r)(),e),...s}));j.displayName=n.rc.displayName;let v=r.forwardRef(({className:e,...s},a)=>(0,t.jsx)(n.ZD,{ref:a,className:(0,i.cn)((0,l.r)({variant:"outline"}),"mt-2 sm:mt-0",e),...s}));v.displayName=n.ZD.displayName},54871:(e,s,a)=>{"use strict";a.d(s,{E:()=>l});var t=a(45512);a(58009);var r=a(21643),n=a(59462);let i=(0,r.F)("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function l({className:e,variant:s,...a}){return(0,t.jsx)("div",{className:(0,n.cn)(i({variant:s}),e),...a})}},71227:(e,s,a)=>{"use strict";a.d(s,{w:()=>o});var t=a(45512),r=a(58009),n=a(30830),i="horizontal",l=["horizontal","vertical"],d=r.forwardRef((e,s)=>{let{decorative:a,orientation:r=i,...d}=e,c=l.includes(r)?r:i;return(0,t.jsx)(n.sG.div,{"data-orientation":c,...a?{role:"none"}:{"aria-orientation":"vertical"===c?c:void 0,role:"separator"},...d,ref:s})});d.displayName="Separator";var c=a(59462);let o=r.forwardRef(({className:e,orientation:s="horizontal",decorative:a=!0,...r},n)=>(0,t.jsx)(d,{ref:n,decorative:a,orientation:s,className:(0,c.cn)("shrink-0 bg-border","horizontal"===s?"h-[1px] w-full":"h-full w-[1px]",e),...r}));o.displayName=d.displayName},65518:(e,s,a)=>{"use strict";a.d(s,{dj:()=>u});var t=a(58009);let r=0,n=new Map,i=e=>{if(n.has(e))return;let s=setTimeout(()=>{n.delete(e),o({type:"REMOVE_TOAST",toastId:e})},1e6);n.set(e,s)},l=(e,s)=>{switch(s.type){case"ADD_TOAST":return{...e,toasts:[s.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===s.toast.id?{...e,...s.toast}:e)};case"DISMISS_TOAST":{let{toastId:a}=s;return a?i(a):e.toasts.forEach(e=>{i(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===s.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==s.toastId)}}},d=[],c={toasts:[]};function o(e){c=l(c,e),d.forEach(e=>{e(c)})}function m({...e}){let s=(r=(r+1)%Number.MAX_VALUE).toString(),a=()=>o({type:"DISMISS_TOAST",toastId:s});return o({type:"ADD_TOAST",toast:{...e,id:s,open:!0,onOpenChange:e=>{e||a()}}}),{id:s,dismiss:a,update:e=>o({type:"UPDATE_TOAST",toast:{...e,id:s}})}}function u(){let[e,s]=t.useState(c);return t.useEffect(()=>(d.push(s),()=>{let e=d.indexOf(s);e>-1&&d.splice(e,1)}),[e]),{...e,toast:m,dismiss:e=>o({type:"DISMISS_TOAST",toastId:e})}}},28238:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>o});var t=a(62740),r=a(51825),n=a(31831),i=a(45369),l=a(62545),d=a(9742),c=a(11710);async function o({params:e}){let s=await (0,r.getServerSession)(i.N);s&&"ADMIN"===s.user.role||(0,n.redirect)("/");let a=await l.db.transaction.findUnique({where:{id:e.id},include:{package:{include:{packageType:!0}},reseller:{select:{id:!0,name:!0,email:!0}},payments:{orderBy:{dueDate:"asc"}}}});return a||(0,n.notFound)(),(0,t.jsx)(d.U,{children:(0,t.jsx)("div",{className:"p-6",children:(0,t.jsx)(c.AdminTransactionDetail,{transaction:a})})})}},11710:(e,s,a)=>{"use strict";a.d(s,{AdminTransactionDetail:()=>t});let t=(0,a(46760).registerClientReference)(function(){throw Error("Attempted to call AdminTransactionDetail() from the server but AdminTransactionDetail is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/beane/projects/my-app/my-app/components/admin/admin-transaction-detail.tsx","AdminTransactionDetail")}};var s=require("../../../../webpack-runtime.js");s.C(e);var a=e=>s(s.s=e),t=s.X(0,[638,8728,3618,7928,159,1957,6244,4999,4563],()=>a(39461));module.exports=t})();