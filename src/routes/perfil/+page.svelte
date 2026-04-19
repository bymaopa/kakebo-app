<script lang="ts">
  import { kakebo } from '$lib/core';
  import { UserProfileSettings } from '$lib/ui';

  function handleSaveProfile(profile: any) {
    kakebo.saveUserProfile(profile);
  }

  function handleExport() {
    kakebo.exportData();
  }

  function handleImport(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target?.result as string);
      kakebo.importData(data);
    };
    reader.readAsText(file);
  }

  function handleClearAll() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos?')) {
      kakebo.clearAllData();
    }
  }
</script>

<UserProfileSettings
  profile={kakebo.userProfile}
  onSave={handleSaveProfile}
  onExport={handleExport}
  onImport={handleImport}
  onClearAll={handleClearAll}
/>
