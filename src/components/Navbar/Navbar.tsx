import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, LogIn, ChevronDown, Check } from 'lucide-react';
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
    <header
      style={{ backgroundColor: '#121529' }}
      className="w-full border-b border-border/40"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand/Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 select-none cursor-pointer"
        >
          <span className="text-3xl font-bold tracking-tight text-frui-white">
            <span className="bg-gradient-to-r from-frui-orange to-[#ff9900] bg-clip-text text-transparent">
              Frui
            </span>
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <Popover open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 text-white bg-[#E8660D] hover:bg-[#f8741f] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <Globe className="h-4 w-4 text-white" />
                  <span className="hidden sm:inline text-white">{lang}</span>
                  <ChevronDown
                    className={`h-3 w-3 text-white transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`}
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
            className="gap-1.5 cursor-pointer bg-[#E8660D] shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#f8741f]"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
