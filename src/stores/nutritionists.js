import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export const useNutritionistsStore = defineStore("nutritionists", () => {
  const nutritionists = ref([]);
  const authStore = useAuthStore();

  // Cargar nutricionistas desde localStorage (filtrando de 'users')
  function loadNutritionists() {
    const stored = localStorage.getItem("users");
    if (stored) {
      const allUsers = JSON.parse(stored);
      nutritionists.value = allUsers.filter(u => u.role === "nutricionista");
    }
  }

  // Guardar nutricionistas en localStorage ('users')
  function saveNutritionists() {
    const stored = localStorage.getItem("users");
    let allUsers = [];
    if (stored) {
      allUsers = JSON.parse(stored);
    }
    
    // Eliminar nutricionistas existentes y agregar actualizados
    allUsers = allUsers.filter(u => u.role !== "nutricionista");
    allUsers.push(...nutritionists.value);
    
    localStorage.setItem("users", JSON.stringify(allUsers));
  }

  // Computed: Todos los nutricionistas
  const allNutritionists = computed(() => nutritionists.value);

  // Computed: Nutricionistas activos
  const activeNutritionists = computed(() => 
    nutritionists.value.filter(n => n.estado === "activo")
  );

  // Agregar nutricionista
  function addNutritionist(nutricionistData) {
    const newNutritionist = {
      id: Date.now().toString(),
      ...nutricionistData,
      role: "nutricionista",
      estado: nutricionistData.estado || "activo",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    nutritionists.value.push(newNutritionist);
    saveNutritionists();
    return newNutritionist;
  }

  // Actualizar nutricionista
  function updateNutritionist(id, nutricionistData) {
    const index = nutritionists.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      nutritionists.value[index] = {
        ...nutritionists.value[index],
        ...nutricionistData,
        updatedAt: new Date().toISOString(),
      };
      saveNutritionists();
      return nutritionists.value[index];
    }
    return null;
  }

  // Eliminar nutricionista
  function deleteNutritionist(id) {
    const index = nutritionists.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      nutritionists.value.splice(index, 1);
      saveNutritionists();
      return true;
    }
    return false;
  }

  // Obtener nutricionista por ID
  function getNutritionistById(id) {
    return nutritionists.value.find((n) => n.id === id);
  }

  // Inicializar: Cargar datos
  loadNutritionists();

  return {
    nutritionists,
    allNutritionists,
    activeNutritionists,
    addNutritionist,
    updateNutritionist,
    deleteNutritionist,
    getNutritionistById,
    loadNutritionists,
    saveNutritionists,
  };
});
