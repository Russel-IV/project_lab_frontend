import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface InfoPageSection {
  heading: string;
  body: React.ReactNode;
}

interface InfoPageProps {
  title: string;
  updated?: string;
  intro?: string;
  sections: InfoPageSection[];
}

/**
 * InfoPage
 *
 * Shared static-content layout for help/legal pages (pay-later explainer,
 * booking terms, terms of service, privacy policy). Keeps the same
 * cream-canvas-plus-white-card look as the rest of the site instead of each
 * page re-implementing it.
 */
export function InfoPage({ title, updated, intro, sections }: InfoPageProps) {
  return (
    <div className="flex-1 w-full bg-frui-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-frui-orange hover:underline w-fit"
        >
          <ChevronLeft className="size-4" />
          Back to Frui
        </Link>

        <div className="bg-frui-white border border-border rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-frui-blue tracking-tight">
              {title}
            </h1>
            {updated && (
              <p className="text-xs text-neutral-400 font-medium">
                Last updated {updated}
              </p>
            )}
            {intro && (
              <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                {intro}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-2">
                <h2 className="text-base font-bold text-frui-blue">
                  {section.heading}
                </h2>
                <div className="text-sm text-neutral-600 leading-relaxed flex flex-col gap-2">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
