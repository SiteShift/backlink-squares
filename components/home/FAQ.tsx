import { homeFaqs } from '@/lib/home-faq'
export function FAQ() {
  return <section className="container-wide py-16 max-w-4xl"><h2 className="font-display text-3xl sm:text-4xl font-black mb-8">Frequently asked questions</h2>{homeFaqs.map(f=><details key={f.question} className="border-b-2 border-surface-200 py-5"><summary className="font-bold text-lg cursor-pointer">{f.question}</summary><p className="mt-4 text-surface-600">{f.answer}</p></details>)}</section>
}
