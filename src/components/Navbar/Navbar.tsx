import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';

export function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

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

        {/* Right: Actions */}
        <div className="flex items-center gap-3 ml-auto">
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
