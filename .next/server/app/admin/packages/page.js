(()=>{var e={};e.id=6642,e.ids=[6642],e.modules={96330:e=>{"use strict";e.exports=require("@prisma/client")},5486:e=>{"use strict";e.exports=require("bcrypt")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},33873:e=>{"use strict";e.exports=require("path")},11723:e=>{"use strict";e.exports=require("querystring")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},54245:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>n.a,__next_app__:()=>p,pages:()=>o,routeModule:()=>u,tree:()=>l});var a=t(70260),r=t(28203),i=t(25155),n=t.n(i),d=t(67292),c={};for(let e in d)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(c[e]=()=>d[e]);t.d(s,c);let l=["",{children:["admin",{children:["packages",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,65110)),"/home/beane/projects/my-app/my-app/app/admin/packages/page.tsx"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(t.bind(t,19611)),"/home/beane/projects/my-app/my-app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,41485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],o=["/home/beane/projects/my-app/my-app/app/admin/packages/page.tsx"],p={require:t,loadChunk:()=>Promise.resolve()},u=new a.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/admin/packages/page",pathname:"/admin/packages",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},82374:(e,s,t)=>{Promise.resolve().then(t.bind(t,22323)),Promise.resolve().then(t.bind(t,5986)),Promise.resolve().then(t.bind(t,53335)),Promise.resolve().then(t.t.bind(t,59607,23))},526:(e,s,t)=>{Promise.resolve().then(t.bind(t,72119)),Promise.resolve().then(t.bind(t,73654)),Promise.resolve().then(t.bind(t,73003)),Promise.resolve().then(t.t.bind(t,28531,23))},73003:(e,s,t)=>{"use strict";t.d(s,{PackageList:()=>k});var a=t(45512),r=t(58009),i=t(28531),n=t.n(i),d=t(79334),c=t(45103),l=t(87021),o=t(97643),p=t(54871),u=t(77766),m=t(65518),h=t(10985),x=t(19904),f=t(31079),j=t(93526),g=t(49656),v=t(59462),b=t(22096);function k({packages:e}){let[s,t]=(0,r.useState)(null),[i,k]=(0,r.useState)(null),y=(0,d.useRouter)(),{toast:N}=(0,m.dj)(),w=async e=>{t(e);try{let s=await fetch(`/api/packages/${e}`,{method:"DELETE"});if(!s.ok){let e=await s.json();throw Error(e.message||"Terjadi kesalahan saat menghapus paket")}N({title:"Berhasil",description:"Paket berhasil dihapus"}),y.refresh()}catch(e){N({variant:"destructive",title:"Gagal",description:e instanceof Error?e.message:"Terjadi kesalahan saat menghapus paket"})}finally{t(null)}},P=async(e,s)=>{k(e);try{let t=await fetch(`/api/packages/${e}/toggle-active`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({isActive:!s})});if(!t.ok){let e=await t.json();throw Error(e.message||"Terjadi kesalahan saat mengubah status paket")}N({title:"Berhasil",description:`Paket berhasil ${s?"dinonaktifkan":"diaktifkan"}`}),y.refresh()}catch(e){N({variant:"destructive",title:"Gagal",description:e instanceof Error?e.message:"Terjadi kesalahan saat mengubah status paket"})}finally{k(null)}};return 0===e.length?(0,a.jsx)(o.Zp,{children:(0,a.jsxs)(o.Wu,{className:"flex flex-col items-center justify-center p-6",children:[(0,a.jsx)(h.A,{className:"h-12 w-12 text-muted-foreground mb-4"}),(0,a.jsx)("p",{className:"text-lg font-medium text-center",children:"Belum ada paket"}),(0,a.jsx)("p",{className:"text-sm text-muted-foreground text-center mt-1 mb-4",children:"Tambahkan paket untuk mulai menawarkan kepada reseller"}),(0,a.jsx)(n(),{href:"/admin/packages/create",children:(0,a.jsx)(l.$,{children:"Tambah Paket"})})]})}):(0,a.jsx)("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:e.map(e=>(0,a.jsxs)(o.Zp,{className:e.isActive?"":"opacity-70",children:[(0,a.jsxs)(o.aR,{className:"pb-3",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)(b.c,{icon:e.packageType.icon,className:"h-5 w-5"}),(0,a.jsx)(o.ZB,{className:"text-lg",children:e.name})]}),(0,a.jsx)(p.E,{variant:e.isActive?"default":"secondary",children:e.isActive?"Aktif":"Nonaktif"})]}),e.description&&(0,a.jsx)(o.BT,{className:"mt-2",children:e.description})]}),(0,a.jsxs)(o.Wu,{className:"pb-3",children:[(0,a.jsx)("div",{className:"aspect-video relative rounded-md overflow-hidden mb-4",children:e.imageUrl?(0,a.jsx)(c.default,{src:e.imageUrl||"/placeholder.svg",alt:e.name,fill:!0,className:"object-cover"}):(0,a.jsx)("div",{className:"w-full h-full flex items-center justify-center bg-muted",children:(0,a.jsx)(h.A,{className:"h-12 w-12 text-muted-foreground"})})}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("span",{className:"text-muted-foreground",children:"Harga Total:"}),(0,a.jsx)("span",{className:"font-medium",children:(0,v.vv)(e.price)})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("span",{className:"text-muted-foreground",children:"Tenor:"}),(0,a.jsxs)("span",{className:"font-medium",children:[e.tenorMonths," bulan"]})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("span",{className:"text-muted-foreground",children:"Cicilan per Bulan:"}),(0,a.jsx)("span",{className:"font-medium",children:(0,v.vv)(e.monthlyAmount)})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("span",{className:"text-muted-foreground",children:"Jenis Paket:"}),(0,a.jsx)("span",{className:"font-medium",children:e.packageType.name})]})]})]}),(0,a.jsxs)(o.wL,{className:"flex justify-between pt-3",children:[(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(n(),{href:`/admin/packages/${e.id}/edit`,children:(0,a.jsxs)(l.$,{variant:"outline",size:"sm",children:[(0,a.jsx)(x.A,{className:"h-4 w-4 mr-2"}),"Edit"]})}),(0,a.jsx)(l.$,{variant:e.isActive?"secondary":"default",size:"sm",onClick:()=>P(e.id,e.isActive),disabled:i===e.id,children:i===e.id?"Memproses...":(0,a.jsxs)(a.Fragment,{children:[e.isActive?(0,a.jsx)(f.A,{className:"h-4 w-4 mr-2"}):(0,a.jsx)(j.A,{className:"h-4 w-4 mr-2"}),e.isActive?"Nonaktifkan":"Aktifkan"]})})]}),(0,a.jsxs)(u.Lt,{children:[(0,a.jsx)(u.tv,{asChild:!0,children:(0,a.jsxs)(l.$,{variant:"destructive",size:"sm",children:[(0,a.jsx)(g.A,{className:"h-4 w-4 mr-2"}),"Hapus"]})}),(0,a.jsxs)(u.EO,{children:[(0,a.jsxs)(u.wd,{children:[(0,a.jsx)(u.r7,{children:"Hapus Paket"}),(0,a.jsx)(u.$v,{children:"Apakah Anda yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan."})]}),(0,a.jsxs)(u.ck,{children:[(0,a.jsx)(u.Zr,{children:"Batal"}),(0,a.jsx)(u.Rx,{onClick:()=>w(e.id),disabled:s===e.id,children:s===e.id?"Menghapus...":"Hapus"})]})]})]})]})]},e.id))})}},22096:(e,s,t)=>{"use strict";t.d(s,{c:()=>d});var a=t(45512),r=t(21957),i=t(10985),n=t(59462);function d({icon:e,className:s,...t}){let d=r[e]||i.A;return(0,a.jsx)(d,{className:(0,n.cn)("h-4 w-4",s),...t})}},54871:(e,s,t)=>{"use strict";t.d(s,{E:()=>d});var a=t(45512);t(58009);var r=t(21643),i=t(59462);let n=(0,r.F)("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function d({className:e,variant:s,...t}){return(0,a.jsx)("div",{className:(0,i.cn)(n({variant:s}),e),...t})}},65110:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>h});var a=t(62740),r=t(51825),i=t(31831),n=t(45369),d=t(62545),c=t(9742),l=t(53335),o=t(27171),p=t(8948),u=t(59607),m=t.n(u);async function h(){let e=await (0,r.getServerSession)(n.N);e&&"ADMIN"===e.user.role||(0,i.redirect)("/");let s=await d.db.package.findMany({include:{packageType:!0},orderBy:{createdAt:"desc"}});return(0,a.jsx)(c.U,{children:(0,a.jsxs)("div",{className:"p-6",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold",children:"Paket"}),(0,a.jsx)(m(),{href:"/admin/packages/create",children:(0,a.jsxs)(o.$,{children:[(0,a.jsx)(p.A,{className:"mr-2 h-4 w-4"}),"Tambah Paket"]})})]}),(0,a.jsx)(l.PackageList,{packages:s})]})})}},53335:(e,s,t)=>{"use strict";t.d(s,{PackageList:()=>a});let a=(0,t(46760).registerClientReference)(function(){throw Error("Attempted to call PackageList() from the server but PackageList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/beane/projects/my-app/my-app/components/admin/package-list.tsx","PackageList")}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[638,8728,3618,7928,159,1957,7085,5103,6244,4999,4563,2678],()=>t(54245));module.exports=a})();