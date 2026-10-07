const STAGES = [
  { title: 'Dream', body: 'Browse silhouettes and necklines from home, with no pressure and no appointment.' },
  { title: 'Shortlist', body: 'Narrow a whole collection down to the handful of shapes she responds to.' },
  { title: 'Appointment', body: 'Arrive with a shortlist, so the hour goes on fit, fabric and advice.' },
  { title: 'Fitting', body: 'Compare small variations — neckline, sleeve, length — without another trip to the rail.' },
  { title: 'Final look', body: 'Preview the finishing touches, from veil to jewellery, before the last decision.' },
]

/** Where try-on helps along a bride’s journey. Horizontal on desktop, vertical on mobile. */
export function Journey() {
  return (
    <ol data-reveal-stagger="" className="relative grid gap-0 md:grid-cols-5 md:gap-6">
      <span aria-hidden="true" className="absolute top-[0.95rem] right-[10%] left-[10%] hidden h-px bg-border md:block" />
      {STAGES.map((s, i) => (
        <li key={s.title} data-reveal="" className="relative grid grid-cols-[2.5rem_1fr] gap-4 border-l border-border py-5 pl-5 md:block md:border-0 md:py-0 md:pl-0">
          <span className="absolute top-6 -left-[0.55rem] size-[1.1rem] rounded-full border-2 border-lumen bg-background md:static md:mb-5 md:grid md:size-8 md:place-items-center md:border-lumen md:font-mono md:text-xs md:tracking-widest md:text-lumen">
            <span className="hidden md:inline">{i + 1}</span>
          </span>
          <div className="col-start-2 md:col-start-auto">
            <h3 className="t-3">{s.title}</h3>
            <p className="mt-2 max-w-[28ch] text-[0.95rem] leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
