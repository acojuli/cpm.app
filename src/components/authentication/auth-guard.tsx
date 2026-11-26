import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/use-auth";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = (props) => {
  const user = useSelector((state: RootState) => state.user.userData.user);
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || !auth.isInitialized) {
      return;
    }

    if (!auth.isAuthenticated) {
      setChecked(false);
      router
        .replace({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        })
        .catch(console.error);
      return;
    }

    if (user && !user.active) {
      setChecked(false);
      router
        .replace({
          pathname: "/email-verification",
          query: { returnUrl: router.asPath },
        })
        .catch(console.error);
      return;
    }

    setChecked(true);
  }, [
    router,
    router.isReady,
    router.asPath,
    auth.isInitialized,
    auth.isAuthenticated,
    user,
  ]);

  if (!checked) {
    return null;
  }

  // Si llegamos acá el usuario está autenticado y con el email verificado.

  return <>{children}</>;
};
