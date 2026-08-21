const FAQS = [
  {
    question: 'What is VideoCreator?',
    answer:
      'VideoCreator is a live conversational video studio. Tavus renders a photorealistic face. You join through a Daily room URL returned by the Create Conversation API.',
  },
  {
    question: 'Which face does the studio use?',
    answer:
      'The default is Tavus stock face r90bbd427f71 (Anna). Set TAVUS_FACE_ID to use a custom Phoenix face.',
  },
  {
    question: 'Do I talk to Dr. Jan Duffy in person?',
    answer:
      'This is an AI video PAL configured for Las Vegas real estate. Call 702-222-1964 to reach Dr. Jan Duffy at Berkshire Hathaway HomeServices Nevada Properties.',
  },
  {
    question: 'Where is the office?',
    answer:
      'Berkshire Hathaway HomeServices Nevada Properties, 8850 W. Sunset Road, Suite 200, Las Vegas, NV 89148. Hours are Monday through Sunday, 9:00 AM to 6:00 PM.',
  },
] as const

export function FAQSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold text-slate-900">
        Frequently asked questions
      </h2>
      <dl className="mt-8 grid gap-6 md:grid-cols-2">
        {FAQS.map((faq) => (
          <div key={faq.question} className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="font-medium text-slate-900">{faq.question}</dt>
            <dd className="mt-2 text-sm leading-6 text-slate-700">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
