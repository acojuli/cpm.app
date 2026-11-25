import type { NextPage } from "next";
import { ErrorPage } from "src/components/common/error-page";

const ServerError: NextPage = () => (
  <ErrorPage
    code="500"
    description="Algo salió mal de nuestro lado. Probá de nuevo en unos minutos; si el problema continúa, escribinos."
    primaryAction={{ href: "/", label: "Volver al inicio" }}
    secondaryAction={{ href: "/contacto", label: "Contactar a soporte" }}
    title="Tuvimos un problema"
  />
);

export default ServerError;
