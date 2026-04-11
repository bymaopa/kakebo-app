<div class="ambient-background">
  <div class="noise-overlay"></div>
  <div class="animated-shapes bg-shape-content container-backdrop-blur">
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
    width: 100%;
    height: 100%;
    overflow: hidden;
    }
    .noise-overlay {
      position: absolute;
      inset: 0;
      /* Aquí inyectamos el SVG codificado en base64 para que pese 0 KB en red */
      background-image: url('data:image/svg+xml,%3Csvg 22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');
      mix-blend-mode: overlay;
      z-index: 20;
      filter: contrast(1.2); 
    }
            .bg-shape-content {
                height: auto;
                width: auto;
                position: absolute;
                margin: auto;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                overflow: hidden;
                z-index: -10;
                }
                .bg-shape-content div {
                position: absolute;
                animation: gradient 8s infinite;
                border-radius: 100%;
                }
                @keyframes gradient {
                70% {
                    transform: scale(1.2) translate(40px);
                }
                }
                .bg-shape-content div:nth-child(1) {
                height: 100%;
                width: 90%;
                background-color: #000000;
                left: -29%;
                top: -10%;
                filter: blur(40px);
                }
                .bg-shape-content div:nth-child(2) {
                height: 90%;
                width: 80%;
                background-color: #1c1c1f;
                top: -12%;
                right: -12%;
                animation-delay: 8s;
                filter: blur(40px);
                }
                .bg-shape-content div:nth-child(3) {
                height: 90%;
                width: 80%;
                background-color: #000000;
                bottom: -15%;
                right: -12%;
                animation-delay: 0.3s;
                filter: blur(40px);
                }
                .bg-shape-content div:nth-child(4) {
                height: 90%;
                width: 80%;
                background-color: #1f1f1f;
                bottom: -10%;
                left: -18%;
                animation-delay: 1.6s;
                filter: blur(80x);
                }
                .container-backdrop-blur::after {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                backdrop-filter: blur(34px) brightness(100%) contrast(105%);
                -webkit-backdrop-filter: blur(34px) brightness(100%) contrast(105%);
                }

                /* Dentro de Background.svelte */
.animated-shapes {
  /* Apaga el "foco" bajando la opacidad de los brillos al 20% */
  opacity: 1; 
  filter: brightness(1); 
}
</style>