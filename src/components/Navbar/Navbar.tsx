import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, UserRound } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, updateUserInfo } from '@/store/authSlice';
import { getProfile } from '@/api/profile';

import fruiLogo from '@/assets/frui-logo.svg';

/**
 * Navbar component for main site header navigation.
 * Renders logo branding, user authentication state, profile link, and login/logout controls.
 */
export function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getProfile(token)
      .then(({ name, email, profilePictureUrl }) => {
        dispatch(updateUserInfo({ name, email, profilePictureUrl }));
      })
      .catch(() => {});
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-frui-blue border-b border-frui-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 select-none cursor-pointer"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-frui-orange p-1 shadow-sm">
            <img
              src={fruiLogo}
              alt="Frui logo"
              className="size-full object-contain"
            />
          </div>
          <span className="text-3xl font-bold tracking-tight text-frui-white">
            <span className="bg-gradient-to-r from-frui-orange to-frui-orange-text bg-clip-text text-transparent">
              Frui
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-bold text-frui-white">
                  {user.name}
                </span>
                <span className="text-xs text-frui-white/60">Standard</span>
              </div>
              <Link
                to="/profile"
                aria-label="View profile"
                title={user.name}
                className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-frui-white/10 ring-1 ring-frui-orange/40 transition-colors hover:ring-frui-orange"
              >
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="h-5 w-5 text-frui-white" />
                )}
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5"
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
              className="gap-1.5"
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
