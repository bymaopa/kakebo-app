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
        /* inset: 0 es el equivalente CSS moderno a top:0, right:0, bottom:0, left:0 */
        position: absolute;
        inset: 0; 
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
    }
        .noise-overlay {
            position: absolute;
            inset: 0;
            background-image: url('../assets/noisy-background.jpg');
            z-index: 0;
            /* Aumentamos solo el contraste como indicaba tu clase contrast-120 */
            filter: contrast(1.5) brightness(0.1) opacity(0.2); 
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