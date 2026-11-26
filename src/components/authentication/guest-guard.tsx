import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/use-auth";
import { getSafeReturnUrl } from "src/utils/safe-return-url";

interface GuestGuardProps {
  children: ReactNode;
}

export const GuestGuard: FC<GuestGuardProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || !auth.isInitialized) {
      return;
    }

    if (auth.isAuthenticated) {
      setChecked(false);
      router
        .replace(getSafeReturnUrl(router.query.returnUrl))
        .catch(console.error);
    } else {
      setChecked(true);
    }
  }, [
    router,
    router.isReady,
    router.query.returnUrl,
    auth.isInitialized,
    auth.isAuthenticated,
  ]);

  if (!checked) {
    return null;
  }

  // Si llegamos acá el usuario no está autenticado.

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};
