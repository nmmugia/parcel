(()=>{var e={};e.id=8846,e.ids=[8846],e.modules={96330:e=>{"use strict";e.exports=require("@prisma/client")},5486:e=>{"use strict";e.exports=require("bcrypt")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},33873:e=>{"use strict";e.exports=require("path")},11723:e=>{"use strict";e.exports=require("querystring")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},15613:(e,s,r)=>{"use strict";r.r(s),r.d(s,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>m,tree:()=>o});var t=r(70260),a=r(28203),n=r(25155),i=r.n(n),l=r(67292),d={};for(let e in l)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>l[e]);r.d(s,d);let o=["",{children:["reseller",{children:["dashboard",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,41942)),"/home/beane/projects/my-app/my-app/app/reseller/dashboard/page.tsx"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,19611)),"/home/beane/projects/my-app/my-app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,41485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["/home/beane/projects/my-app/my-app/app/reseller/dashboard/page.tsx"],u={require:r,loadChunk:()=>Promise.resolve()},m=new t.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/reseller/dashboard/page",pathname:"/reseller/dashboard",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},89744:(e,s,r)=>{Promise.resolve().then(r.bind(r,90188)),Promise.resolve().then(r.bind(r,40545)),Promise.resolve().then(r.bind(r,72940))},99472:(e,s,r)=>{Promise.resolve().then(r.bind(r,59168)),Promise.resolve().then(r.bind(r,28013)),Promise.resolve().then(r.bind(r,34555))},59168:(e,s,r)=>{"use strict";r.d(s,{ResellerDashboard:()=>j});var t=r(45512),a=r(28531),n=r.n(a),i=r(87021),l=r(97643),d=r(54871),o=r(59462),c=r(91124),u=r(96795),m=r(46583),x=r(31393),h=r(15907),p=r(72744);function j({activeTransactions:e,pendingPayments:s,approvedPayments:r,totalBonus:a,recentTransactions:j}){return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-4",children:[(0,t.jsxs)(l.Zp,{children:[(0,t.jsxs)(l.aR,{className:"flex flex-row items-center justify-between pb-2",children:[(0,t.jsx)(l.ZB,{className:"text-sm font-medium",children:"Transaksi Aktif"}),(0,t.jsx)(c.A,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(l.Wu,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:e}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Transaksi yang sedang berjalan"})]}),(0,t.jsx)(l.wL,{children:(0,t.jsx)(n(),{href:"/reseller/transactions",className:"w-full",children:(0,t.jsx)(i.$,{variant:"outline",size:"sm",className:"w-full",children:"Lihat Transaksi"})})})]}),(0,t.jsxs)(l.Zp,{children:[(0,t.jsxs)(l.aR,{className:"flex flex-row items-center justify-between pb-2",children:[(0,t.jsx)(l.ZB,{className:"text-sm font-medium",children:"Pembayaran Tertunda"}),(0,t.jsx)(u.A,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(l.Wu,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:s}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Pembayaran yang belum diunggah buktinya"})]}),(0,t.jsx)(l.wL,{children:(0,t.jsx)(n(),{href:"/reseller/payments",className:"w-full",children:(0,t.jsx)(i.$,{variant:"outline",size:"sm",className:"w-full",children:"Lihat Pembayaran"})})})]}),(0,t.jsxs)(l.Zp,{children:[(0,t.jsxs)(l.aR,{className:"flex flex-row items-center justify-between pb-2",children:[(0,t.jsx)(l.ZB,{className:"text-sm font-medium",children:"Pembayaran Disetujui"}),(0,t.jsx)(m.A,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(l.Wu,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:r}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Pembayaran yang telah disetujui"})]}),(0,t.jsx)(l.wL,{children:(0,t.jsx)(n(),{href:"/reseller/payments?status=APPROVED",className:"w-full",children:(0,t.jsx)(i.$,{variant:"outline",size:"sm",className:"w-full",children:"Lihat Detail"})})})]}),(0,t.jsxs)(l.Zp,{children:[(0,t.jsxs)(l.aR,{className:"flex flex-row items-center justify-between pb-2",children:[(0,t.jsx)(l.ZB,{className:"text-sm font-medium",children:"Total Bonus"}),(0,t.jsx)(x.A,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(l.Wu,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:(0,o.vv)(a)}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Bonus dari pembayaran yang disetujui"})]}),(0,t.jsx)(l.wL,{children:(0,t.jsx)(n(),{href:"/reseller/payments",className:"w-full",children:(0,t.jsx)(i.$,{variant:"outline",size:"sm",className:"w-full",children:"Lihat Riwayat"})})})]})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2",children:[(0,t.jsxs)(l.Zp,{className:"col-span-1",children:[(0,t.jsxs)(l.aR,{children:[(0,t.jsx)(l.ZB,{children:"Transaksi Terbaru"}),(0,t.jsx)(l.BT,{children:j.length>0?"Transaksi terbaru yang Anda buat":"Belum ada transaksi"})]}),(0,t.jsx)(l.Wu,{children:j.length>0?(0,t.jsx)("div",{className:"space-y-4",children:j.map(e=>(0,t.jsxs)("div",{className:"flex items-center justify-between space-x-4",children:[(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsx)("p",{className:"text-sm font-medium leading-none",children:e.package.name}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:e.customerName})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(d.E,{variant:"outline",children:(0,o.vv)(e.totalAmount)}),(0,t.jsx)(n(),{href:`/reseller/transactions/${e.id}`,children:(0,t.jsx)(i.$,{variant:"ghost",size:"icon",children:(0,t.jsx)(h.A,{className:"h-4 w-4"})})})]})]},e.id))}):(0,t.jsxs)("div",{className:"flex flex-col items-center justify-center py-4",children:[(0,t.jsx)(c.A,{className:"h-8 w-8 text-muted-foreground mb-2"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Belum ada transaksi"})]})}),(0,t.jsx)(l.wL,{children:(0,t.jsx)(n(),{href:"/reseller/transactions",className:"w-full",children:(0,t.jsx)(i.$,{variant:"outline",className:"w-full",children:"Lihat Semua Transaksi"})})})]}),(0,t.jsxs)(l.Zp,{className:"col-span-1",children:[(0,t.jsxs)(l.aR,{children:[(0,t.jsx)(l.ZB,{children:"Pembayaran yang Perlu Diunggah"}),(0,t.jsx)(l.BT,{children:"Pembayaran yang belum diunggah buktinya"})]}),(0,t.jsx)(l.Wu,{children:j.some(e=>e.payments.length>0)?(0,t.jsx)("div",{className:"space-y-4",children:j.filter(e=>e.payments.length>0).map(e=>(0,t.jsxs)("div",{className:"flex items-center justify-between space-x-4",children:[(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsx)("p",{className:"text-sm font-medium leading-none",children:e.package.name}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Jatuh tempo: ",(0,o.Yq)(e.payments[0].dueDate)]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(d.E,{variant:"outline",children:(0,o.vv)(e.payments[0].amount)}),(0,t.jsx)(n(),{href:`/reseller/transactions/${e.id}`,children:(0,t.jsx)(i.$,{variant:"ghost",size:"icon",children:(0,t.jsx)(p.A,{className:"h-4 w-4"})})})]})]},e.id))}):(0,t.jsxs)("div",{className:"flex flex-col items-center justify-center py-4",children:[(0,t.jsx)(u.A,{className:"h-8 w-8 text-muted-foreground mb-2"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Tidak ada pembayaran yang perlu diunggah"})]})}),(0,t.jsx)(l.wL,{children:(0,t.jsx)(n(),{href:"/reseller/payments",className:"w-full",children:(0,t.jsx)(i.$,{variant:"outline",className:"w-full",children:"Lihat Semua Pembayaran"})})})]})]}),(0,t.jsx)("div",{className:"grid gap-4",children:(0,t.jsxs)(l.Zp,{children:[(0,t.jsxs)(l.aR,{children:[(0,t.jsx)(l.ZB,{children:"Mulai Transaksi Baru"}),(0,t.jsx)(l.BT,{children:"Pilih paket dan buat transaksi baru untuk pelanggan Anda"})]}),(0,t.jsx)(l.Wu,{children:(0,t.jsxs)("div",{className:"flex flex-col items-center justify-center py-4",children:[(0,t.jsx)(c.A,{className:"h-12 w-12 text-muted-foreground mb-4"}),(0,t.jsx)("p",{className:"text-center text-muted-foreground mb-4",children:"Lihat katalog paket dan buat transaksi baru untuk pelanggan Anda"}),(0,t.jsx)(n(),{href:"/reseller/packages",children:(0,t.jsx)(i.$,{children:"Lihat Katalog Paket"})})]})})]})})]})}},54871:(e,s,r)=>{"use strict";r.d(s,{E:()=>l});var t=r(45512);r(58009);var a=r(21643),n=r(59462);let i=(0,a.F)("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function l({className:e,variant:s,...r}){return(0,t.jsx)("div",{className:(0,n.cn)(i({variant:s}),e),...r})}},15907:(e,s,r)=>{"use strict";r.d(s,{A:()=>t});let t=(0,r(5187).A)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]])},46583:(e,s,r)=>{"use strict";r.d(s,{A:()=>t});let t=(0,r(5187).A)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},31393:(e,s,r)=>{"use strict";r.d(s,{A:()=>t});let t=(0,r(5187).A)("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]])},72744:(e,s,r)=>{"use strict";r.d(s,{A:()=>t});let t=(0,r(5187).A)("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]])},41942:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>c});var t=r(62740),a=r(51825),n=r(31831),i=r(45369),l=r(62545),d=r(37941),o=r(90188);async function c(){let e=await (0,a.getServerSession)(i.N);e&&"RESELLER"===e.user.role||(0,n.redirect)("/");let s=await l.db.transaction.count({where:{resellerId:e.user.id,status:"ACTIVE"}}),r=await l.db.payment.count({where:{resellerId:e.user.id,status:"WAITING_FOR_PAYMENT",proofImageUrl:null}}),c=await l.db.payment.count({where:{resellerId:e.user.id,status:"APPROVED"}}),u=await l.db.payment.aggregate({where:{resellerId:e.user.id,status:"APPROVED",resellerBonus:{not:null}},_sum:{resellerBonus:!0}}),m=await l.db.transaction.findMany({where:{resellerId:e.user.id},include:{package:!0,payments:{where:{status:"WAITING_FOR_PAYMENT",proofImageUrl:null},orderBy:{dueDate:"asc"},take:1}},orderBy:{createdAt:"desc"},take:5});return(0,t.jsx)(d.v,{children:(0,t.jsxs)("div",{className:"p-6",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold mb-6",children:"Dashboard Reseller"}),(0,t.jsx)(o.ResellerDashboard,{activeTransactions:s,pendingPayments:r,approvedPayments:c,totalBonus:u._sum.resellerBonus||0,recentTransactions:m})]})})}},90188:(e,s,r)=>{"use strict";r.d(s,{ResellerDashboard:()=>t});let t=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call ResellerDashboard() from the server but ResellerDashboard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/beane/projects/my-app/my-app/components/reseller/reseller-dashboard.tsx","ResellerDashboard")}};var s=require("../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[638,8728,3618,7928,159,4999,3666],()=>r(15613));module.exports=t})();