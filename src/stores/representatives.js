import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export const useRepresentativesStore = defineStore("representatives", () => {
  const representatives = ref([]);
  const authStore = useAuthStore();

  // Cargar representantes desde localStorage (filtrando de 'users')
  function loadRepresentatives() {
    const stored = localStorage.getItem("users");
    if (stored) {
      const allUsers = JSON.parse(stored);
      representatives.value = allUsers.filter(u => u.role === "representante");
    }
  }

  // Guardar representantes en localStorage ('users')
  function saveRepresentatives() {
    const stored = localStorage.getItem("users");
    let allUsers = [];
    if (stored) {
      allUsers = JSON.parse(stored);
    }
    
    // Eliminar representantes existentes y agregar actualizados
    allUsers = allUsers.filter(u => u.role !== "representante");
    allUsers.push(...representatives.value);
    
    localStorage.setItem("users", JSON.stringify(allUsers));
  }

  // Computed: Todos los representantes
  const allRepresentatives = computed(() => representatives.value);

  // Computed: Representantes activos
  const activeRepresentatives = computed(() => 
    representatives.value.filter(r => r.estado === "activo")
  );

  // Agregar representante
  function addRepresentative(representativeData) {
    const newRepresentative = {
      id: Date.now().toString(),
      ...representativeData,
      role: "representante",
      estado: representativeData.estado || "activo",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    representatives.value.push(newRepresentative);
    saveRepresentatives();
    return newRepresentative;
  }

  // Actualizar representante
  function updateRepresentative(id, representativeData) {
    const index = representatives.value.findIndex((r) => r.id === id);
    if (index !== -1) {
      representatives.value[index] = {
        ...representatives.value[index],
        ...representativeData,
        updatedAt: new Date().toISOString(),
      };
      saveRepresentatives();
      return representatives.value[index];
    }
    return null;
  }

  // Eliminar representante
  function deleteRepresentative(id) {
    const index = representatives.value.findIndex((r) => r.id === id);
    if (index !== -1) {
      representatives.value.splice(index, 1);
      saveRepresentatives();
      return true;
    }
    return false;
  }

  // Obtener representante por ID
  function getRepresentativeById(id) {
    return representatives.value.find((r) => r.id === id);
  }

  // Obtener representante por usuario
  function getRepresentativeByUsername(username) {
    return representatives.value.find((r) => r.username === username);
  }

  // Inicializar: Cargar datos
  loadRepresentatives();

  return {
    representatives,
    allRepresentatives,
    activeRepresentatives,
    addRepresentative,
    updateRepresentative,
    deleteRepresentative,
    getRepresentativeById,
    getRepresentativeByUsername,
    loadRepresentatives,
    saveRepresentatives,
  };
});
