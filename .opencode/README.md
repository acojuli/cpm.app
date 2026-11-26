# Skills de agente (vendored)

Estas skills se copiaron tal cual desde
[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
(commit `1a2c79d`, rama `main`) para usarlas como base de mejora del proyecto.

Instaladas:

- `react-best-practices`
- `composition-patterns`
- `web-design-guidelines`
- `writing-guidelines`
- `deploy-to-vercel`
- `vercel-cli-with-tokens`
- `vercel-optimize`

No instaladas (no aplican al stack actual):

- `react-native-skills` — el proyecto es web.
- `react-view-transitions` — requiere React 19 / Next 15; este repo usa React 17 / Next 12.

## Actualizar

```bash
# desde la raíz del repo
curl -L https://codeload.github.com/vercel-labs/agent-skills/zip/refs/heads/main -o skills.zip
# reemplazar .opencode/skills/<skill> con el contenido nuevo
```

## Notas de uso

- `vercel-optimize` requiere Vercel CLI v53+, Node 20+ y un proyecto deployado
  con Observability Plus. No aplica hasta que exista un deploy real.
- `web-design-guidelines` y `writing-guidelines` descargan las reglas actualizadas
  desde GitHub en cada revisión.
