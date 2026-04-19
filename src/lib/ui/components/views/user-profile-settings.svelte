<script lang="ts">
  import type { UserProfile } from '$lib/core';
  import { Card, Input, Button } from '$lib/ui';

  interface Props {
    profile: UserProfile;
    onSave?: (profile: UserProfile) => void;
    onExport?: () => void;
    onImport?: (file: File) => void;
    onClearAll?: () => void;
  }

  let { profile, onSave, onExport, onImport, onClearAll }: Props = $props();

  let name = $state(profile.name);
  let age = $state(profile.age);
  let financialGoal = $state(profile.financialGoal);
  let riskTolerance = $state(profile.riskTolerance);

  function handleSave() {
    if (onSave) {
      onSave({ name, age, financialGoal, riskTolerance, avatarSeed: profile.avatarSeed });
    }
  }

  function handleFileImport(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0] && onImport) {
      onImport(input.files[0]);
    }
  }
</script>

<div class="user-profile">
  <Card>
    <h3>Perfil de Usuario</h3>

    <div class="field">
      <label for="name">Nombre</label>
      <Input id="name" bind:value={name} placeholder="Tu nombre" />
    </div>

    <div class="field">
      <label for="age">Edad</label>
      <Input id="age" bind:value={age} placeholder="Tu edad" />
    </div>

    <div class="field">
      <label for="goal">Objetivo Financiero</label>
      <Input id="goal" bind:value={financialGoal} placeholder="¿Qué quieres lograr?" />
    </div>

    <div class="field">
      <label for="risk">Tolerancia al Riesgo</label>
      <select id="risk" bind:value={riskTolerance}>
        <option value="low">Baja - Prefiero asegurar</option>
        <option value="medium">Media - Equilibrado</option>
        <option value="high">Alta - Puedo arriesgar</option>
      </select>
    </div>

    <Button onclick={handleSave}>Guardar Perfil</Button>
  </Card>

  <Card>
    <h3>Gestión de Datos</h3>

    <div class="actions">
      <Button variant="secondary" onclick={onExport}>Exportar Datos</Button>

      <label class="import-btn">
        <Input type="file" accept=".json" onchange={handleFileImport} />
        <span>Importar Datos</span>
      </label>

      {#if onClearAll}
        <Button variant="destructive" onclick={onClearAll}>Borrar Todo</Button>
      {/if}
    </div>
  </Card>
</div>

<style>
  .user-profile {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 2.5rem;
  }

  .user-profile h3 {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .field label {
    font-size: 0.75rem;
    font-weight: 500;
    color: rgb(120 113 108);
    text-transform: uppercase;
  }

  .field select {
    display: flex;
    height: 3rem;
    width: 100%;
    border-radius: 9999px;
    background: rgb(231 229 228);
    border: 0;
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
    appearance: none;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .import-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    background: rgb(231 229 228);
    color: rgb(6 78 59);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
  }

  .import-btn :global(input) {
    display: none;
  }
</style>
