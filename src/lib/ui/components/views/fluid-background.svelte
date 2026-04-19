<script lang="ts">
  interface Props {
    colors?: string[];
    opacity?: number;
  }

  let { colors = ['#a7f3d0', '#34d399', '#059669'], opacity = 0.4 }: Props = $props();
</script>

<div class="fluid-background">
  <div class="blob blob-1" style="--color: {colors[0]}; --opacity: {opacity}"></div>
  <div class="blob blob-2" style="--color: {colors[1]}; --opacity: {opacity}"></div>
  <div class="blob blob-3" style="--color: {colors[2] || colors[0]}; --opacity: {opacity}"></div>
</div>

<style>
  .fluid-background {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: -10;
    background: rgb(250 250 249);
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: var(--opacity, 0.4);
  }

  .blob-1 {
    width: 60vw;
    height: 60vw;
    background: var(--color);
    top: -20%;
    left: -10%;
    animation: move1 20s ease-in-out infinite;
  }

  .blob-2 {
    width: 50vw;
    height: 50vw;
    background: var(--color);
    bottom: -20%;
    right: -10%;
    animation: move2 25s ease-in-out infinite;
  }

  .blob-3 {
    width: 40vw;
    height: 40vw;
    background: var(--color);
    top: 40%;
    left: 30%;
    animation: move3 22s ease-in-out infinite;
  }

  @keyframes move1 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(15vw, -10vh) scale(1.2);
    }
    66% {
      transform: translate(-10vw, 15vh) scale(0.8);
    }
  }

  @keyframes move2 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-15vw, 15vh) scale(0.8);
    }
    66% {
      transform: translate(15vw, -10vh) scale(1.2);
    }
  }

  @keyframes move3 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(10vw, 10vh) scale(1.1);
    }
    66% {
      transform: translate(-10vw, -10vh) scale(0.9);
    }
  }
</style>
