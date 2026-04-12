<!--  -->

<div class="ambient-background">
  <div class="noise-overlay"></div>
  <div class="animated-shapes">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>

<style lang="scss">
  .ambient-background {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: -10;

    /* 1. Capa de Ruido */
    .noise-overlay {
      position: absolute;
      inset: 0;
      /* 1. SVG actualizado con un grano mucho más fino (baseFrequency="1.5") */
      background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');
      /* 2. Forzamos a que sea un mosaico de alta resolución que no se deforma */
      background-repeat: repeat;
      background-size: 120px; /* Si lo quieres aún más fino, bájalo a 100px */

      mix-blend-mode: overlay;
      z-index: 20;
      filter: contrast(1.2);

      /* Opcional: Si el grano llama demasiado la atención, bájale la opacidad aquí */
      opacity: 0.7;
    }

    /* 2. Contenedor de Formas y Cristal Esmerilado */
    .animated-shapes {
      position: absolute;
      inset: 0;

      /* Efecto blur por encima de los círculos (antiguo container-backdrop-blur) */
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        backdrop-filter: blur(34px) contrast(1.05);
        -webkit-backdrop-filter: blur(34px) contrast(1.05);
      }

      /* 3. Las formas en sí */
      > div {
        position: absolute;
        border-radius: 50%;
        animation: ambient-drift 8s infinite;
        filter: blur(40px); /* Valor por defecto para casi todos */

        &:nth-child(1) {
          width: 90%;
          height: 100%;
          background-color: var(--bg-card);
          left: -29%;
          top: -10%;
        }

        &:nth-child(2) {
          width: 80%;
          height: 90%;
          background-color: var(--card-shape);
          right: -12%;
          top: -12%;
        }

        &:nth-child(3) {
          width: 80%;
          height: 90%;
          background-color: var(--bg-card);
          right: -12%;
          bottom: -15%;
          animation-delay: 0.3s;
        }

        &:nth-child(4) {
          width: 80%;
          height: 90%;
          background-color: var(--card-shape);
          left: -18%;
          bottom: -10%;
          animation-delay: 1.6s;
          filter: blur(80px); /* Este requiere más desenfoque */
        }
      }
    }
  }

  @keyframes ambient-drift {
    70% {
      transform: scale(1.2) translate(40px);
    }
  }
</style>
