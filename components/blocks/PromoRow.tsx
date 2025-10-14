export default function PromoRow({title,href,items}:{title:string;href:string;items:{title:string;href:string;image:string}[]}){
return (
<section className="container py-10">
<div className="flex items-end justify-between"><h2 className="title-2">{title}</h2><a href={href} className="text-sm underline">View all</a></div>
<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
{items.map((it)=> (
<a key={it.href} href={it.href} className="group card block overflow-hidden">
<div className="aspect-[4/5] w-full bg-neutral-100" aria-hidden />
<div className="p-3 text-sm font-medium group-hover:underline">{it.title}</div>
</a>
))}
</div>
</section>
);
}