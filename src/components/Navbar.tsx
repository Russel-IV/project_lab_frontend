import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, LogIn, Sparkles, ChevronDown, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function Navbar() {
  const [lang, setLang] = useState('English');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand/Logo */}
        <div className="flex items-center gap-2 select-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Lab
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Project
            </span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <Popover open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{lang}</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`}
                  />
                </Button>
              }
            />
            <PopoverContent align="end" className="w-40 p-1">
              <div className="flex flex-col gap-0.5">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setLang(language.name);
                      setIsLanguageOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span>{language.name}</span>
                    {lang === language.name && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sign In Button */}
          <Button
            variant="default"
            size="sm"
            className="gap-1.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
