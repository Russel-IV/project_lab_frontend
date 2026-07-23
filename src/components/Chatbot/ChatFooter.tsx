import { ExternalLink } from 'lucide-react';

export function ChatFooter() {
  return (
    <div className="flex justify-center items-center gap-1.5 py-2 text-center text-[10px] text-frui-blue/40 select-none bg-frui-white border-t border-frui-blue/5 rounded-b-2xl">
      <span>Uses AI. Verify results.</span>
      <a
        href="https://frui.com/ai-disclosures"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View AI safety disclosures (opens in a new tab)"
        className="text-frui-blue/40 inline-flex items-center focus:outline-none"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
