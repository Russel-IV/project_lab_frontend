import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, UserRound } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, updateUserInfo } from '@/store/authSlice';
import { getProfile } from '@/api/profile';

export function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // The cached `authUser` in localStorage can go stale (e.g. a picture
  // uploaded in a previous session isn't reflected until next login), so
  // refresh it from the backend once whenever a token is present.
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
                className="gap-1.5 bg-frui-orange text-frui-white border-frui-orange hover:bg-frui-orange hover:brightness-95 focus-visible:ring-frui-orange/40"
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
