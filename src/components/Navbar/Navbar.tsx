import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Globe,
  LogIn,
  LogOut,
  ChevronDown,
  Check,
  BedDouble,
  Plane,
  Car,
  Ticket,
  Ship,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';

const navTabs = [
  { id: 'stays', label: 'Stays', icon: BedDouble, to: '/stays' },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'cars', label: 'Cars', icon: Car },
  { id: 'things', label: 'Things to do', icon: Ticket },
  { id: 'cruises', label: 'Cruises', icon: Ship },
];

export function Navbar() {
  const [lang, setLang] = useState('English');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isStaysActive =
    location.pathname === '/' ||
    location.pathname.startsWith('/stays') ||
    location.pathname.startsWith('/stay/');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  return (
    <header
      style={{ backgroundColor: '#121529' }}
      className="sticky top-0 z-50 w-full border-b border-border/40 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand/Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 select-none cursor-pointer"
        >
          <span className="text-3xl font-bold tracking-tight text-frui-white">
            <span className="bg-gradient-to-r from-frui-orange to-[#ff9900] bg-clip-text text-transparent">
              Frui
            </span>
          </span>
        </Link>

        {/* Center: Category tabs */}
        <nav className="hidden md:flex flex-1 min-w-0 items-center justify-center gap-2">
          {navTabs.map(({ id, label, icon: Icon, to }) => {
            const isEnabled = id === 'stays';
            const isActive = isEnabled && isStaysActive;
            const content = (
              <>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </>
            );

            return isEnabled ? (
              <Link
                key={id}
                to={to ?? '/'}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-frui-orange'
                    : 'text-frui-white/80 hover:bg-white/5 hover:text-frui-orange'
                }`}
              >
                {content}
                {isActive && (
                  <span className="absolute left-1/2 bottom-0 h-0.5 w-6 -translate-x-1/2 translate-y-1.5 rounded-full bg-frui-orange" />
                )}
              </Link>
            ) : (
              <span
                key={id}
                aria-disabled="true"
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-frui-white/30 cursor-not-allowed select-none"
              >
                {content}
              </span>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-3 ml-auto md:ml-0">
          {/* Language Selector */}
          <Popover open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-frui-white/60 hover:bg-white/10 hover:text-frui-white/90 transition-all duration-200 cursor-pointer"
                >
                  <Globe className="h-3.5 w-3.5" />
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

          {user ? (
            <>
              <span className="hidden sm:inline text-sm font-medium text-frui-orange">
                Welcome, {user.name}!
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 cursor-pointer bg-[#E8660D] shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#f8741f]"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </>
          ) : (
            /* Sign In Button */
            <Button
              variant="default"
              size="sm"
              render={<Link to="/login" />}
              nativeButton={false}
              className="gap-1.5 cursor-pointer bg-[#E8660D] shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#f8741f]"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
