# LuzYa

App web de un único archivo (sin build, sin backend) para consultar el
precio de la luz por horas en España peninsular: precio de ahora mismo,
gráfico de las 24 horas de hoy (y de mañana en cuanto se publica) e
histórico de 7/30/90 días con la media diaria.

## Uso

Abre `index.html` (o `luzya.html`, es el mismo archivo) directamente con
doble clic — funciona en `file://`. No necesita `npm install` ni ningún
paso de compilación.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo y vacío en GitHub (por ejemplo `LuzYa`), sin
   README ni licencia (para no chocar con lo que ya hay aquí).
2. Desde esta carpeta:

   ```
   git remote add origin https://github.com/Reynaga013/LuzYa.git
   git branch -M main
   git push -u origin main
   ```

   El `push` necesita tu cuenta de GitHub autenticada, así que ese paso
   lo ejecutas tú desde tu propia terminal.
3. En GitHub, ve a Settings → Pages → Build and deployment → Source:
   "Deploy from a branch", rama `main`, carpeta `/ (root)`. Guarda.
4. Al cabo de uno o dos minutos, la app queda publicada en
   `https://reynaga013.github.io/LuzYa/`.

A partir de ahí, cada vez que se cambie `luzya.html`/`index.html`, el
flujo es el mismo que en GasoYa:

```
git add -A
git commit -m "..."
git push
```

## Cómo funciona

Consulta en directo la API pública y gratuita de Red Eléctrica de España
(REE) — sin API key, sin servidor propio:

```
https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real
```

Todo el cálculo (medias diarias, coloreado por tramos, tooltips) ocurre
en el navegador del usuario — nada sale de ahí. Solo cubre España
peninsular: Ceuta, Melilla, Baleares y Canarias no están incluidas.

## Documentación completa

La documentación detallada (arquitectura, decisiones, bugs encontrados,
hoja de ruta) vive en Obsidian, no aquí:

- `Apps/LuzYa/LuzYa - Documentación y Hoja de Ruta.md`
