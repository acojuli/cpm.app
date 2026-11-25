import type { NextPage } from "next";
import { ErrorPage } from "src/components/common/error-page";

const NotFound: NextPage = () => (
  <ErrorPage
    code="404"
    description="La página que buscás no existe o fue movida. Revisá la dirección o volvé al inicio."
    primaryAction={{ href: "/", label: "Volver al inicio" }}
    secondaryAction={{ href: "/contacto", label: "Contactar a soporte" }}
    title="No encontramos esta página"
  />
);

export default NotFound;
