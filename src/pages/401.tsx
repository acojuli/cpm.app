import type { NextPage } from "next";
import { ErrorPage } from "src/components/common/error-page";

const AuthorizationRequired: NextPage = () => (
  <ErrorPage
    code="401"
    description="Necesitás iniciar sesión para ver esta página."
    primaryAction={{ href: "/login", label: "Iniciar sesión" }}
    secondaryAction={{ href: "/", label: "Volver al inicio" }}
    title="Acceso restringido"
  />
);

export default AuthorizationRequired;
