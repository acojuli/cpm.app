# Registro visual: Contacto

- Antes: dos títulos gigantes (h1 + h2), formulario angosto y un bug: si el envío fallaba el botón quedaba en "Enviando..." para siempre; el mock no tenía `/contactForm`.
- Después: jerarquía clara, formulario controlado con validación al salir del campo, mensajes de éxito/error, el formulario se limpia al enviar. El mock responde `POST /contactForm` con 201.
