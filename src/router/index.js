import {
  createRouter,
  createWebHistory,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import("@/views/auth/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: () =>
        import("@/views/auth/RegisterView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/recuperar-contrasena",
      name: "recuperar-contrasena",
      component: () =>
        import(
          "@/views/auth/RecuperarContrasenaView.vue"
        ),
      meta: { requiresGuest: true },
    },
    {
      path: "/verificar-email",
      name: "verificar-email",
      component: () =>
        import(
          "@/views/auth/VerificarEmailView.vue"
        ),
      meta: { requiresGuest: true },
    },
    {
      path: "/admin",
      component: () =>
        import("@/layouts/AdminLayout.vue"),
      meta: { requiresAuth: true, role: "admin" },
      children: [
        {
          path: "",
          name: "admin-dashboard",
          component: () =>
            import(
              "@/views/admin/DashboardView.vue"
            ),
        },
        {
          path: "estudiantes",
          name: "admin-estudiantes",
          component: () =>
            import(
              "@/views/admin/EstudiantesView.vue"
            ),
        },
        {
          path: "estudiantes/registro",
          name: "admin-registro-estudiante",
          component: () =>
            import(
              "@/views/admin/RegistroEstudianteView.vue"
            ),
        },
        {
          path: "estudiantes/editar/:id",
          name: "admin-editar-estudiante",
          component: () =>
            import(
              "@/views/admin/RegistroEstudianteView.vue"
            ),
        },
        {
          path: "nutricionistas",
          name: "admin-nutricionistas",
          component: () =>
            import(
              "@/views/admin/NutricionistasView.vue"
            ),
        },
        {
          path: "nutricionistas/registro",
          name: "admin-registro-nutricionista",
          component: () =>
            import(
              "@/views/admin/RegistroNutricionistaView.vue"
            ),
        },
        {
          path: "nutricionistas/editar/:id",
          name: "admin-editar-nutricionista",
          component: () =>
            import(
              "@/views/admin/RegistroNutricionistaView.vue"
            ),
        },
        {
          path: "representantes",
          name: "admin-representantes",
          component: () =>
            import(
              "@/views/admin/RepresentantesView.vue"
            ),
        },
        {
          path: "representantes/registro",
          name: "admin-registro-representante",
          component: () =>
            import(
              "@/views/admin/RegistroRepresentanteView.vue"
            ),
        },
        {
          path: "representantes/editar/:id",
          name: "admin-editar-representante",
          component: () =>
            import(
              "@/views/admin/RegistroRepresentanteView.vue"
            ),
        },
        {
          path: "reportes",
          name: "admin-reportes",
          component: () =>
            import(
              "@/views/admin/ReportesView.vue"
            ),
        },
        {
          path: "configuracion",
          name: "admin-configuracion",
          component: () =>
            import(
              "@/views/admin/ConfiguracionView.vue"
            ),
        },
      ],
    },
    {
      path: "/usuario",
      component: () =>
        import("@/layouts/UserLayout.vue"),
      meta: {
        requiresAuth: true,
        role: "representante",
      },
      children: [
        {
          path: "",
          name: "usuario-inicio",
          component: () =>
            import(
              "@/views/usuario/InicioView.vue"
            ),
        },
        {
          path: "perfil",
          name: "usuario-perfil",
          component: () =>
            import(
              "@/views/usuario/PerfilView.vue"
            ),
        },
        {
          path: "retroalimentacion",
          name: "usuario-retroalimentacion",
          component: () =>
            import(
              "@/views/usuario/RetroalimentacionView.vue"
            ),
        },
      ],
    },
    {
      path: "/nutricionista",
      component: () =>
        import(
          "@/layouts/NutricionistaLayout.vue"
        ),
      meta: {
        requiresAuth: true,
        role: "nutricionista",
      },
      children: [
        {
          path: "",
          name: "nutricionista-dashboard",
          component: () =>
            import(
              "@/views/nutricionista/DashboardView.vue"
            ),
        },
        {
          path: "menu-semanal",
          name: "nutricionista-menu",
          component: () =>
            import(
              "@/views/nutricionista/MenuSemanalView.vue"
            ),
        },
        {
          path: "comidas",
          name: "nutricionista-comidas",
          component: () =>
            import(
              "@/views/nutricionista/ComidasView.vue"
            ),
        },

        {
          path: "recomendaciones",
          name: "nutricionista-recomendaciones",
          component: () =>
            import(
              "@/views/nutricionista/RecomendacionesView.vue"
            ),
        },
        {
          path: "alertas",
          name: "nutricionista-alertas",
          component: () =>
            import(
              "@/views/nutricionista/AlertasView.vue"
            ),
        },
        {
          path: "perfil",
          name: "nutricionista-perfil",
          component: () =>
            import(
              "@/views/usuario/PerfilView.vue"
            ),
        },
      ],
    },
    {
      path: "/terminos",
      name: "terminos",
      component: () =>
        import("@/views/TerminosView.vue"),
    },
    {
      path: "/politica-privacidad",
      name: "politica-privacidad",
      component: () =>
        import(
          "@/views/PoliticaPrivacidadView.vue"
        ),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () =>
        import("@/views/NotFoundView.vue"),
    },
  ],
});

// Guards de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Verificar si la ruta requiere autenticación
  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated
  ) {
    console.log(
      "Ruta requiere autenticación, redirigiendo a login"
    );
    next("/login");
    return;
  }

  // Verificar si la ruta requiere ser invitado (no autenticado)
  if (
    to.meta.requiresGuest &&
    authStore.isAuthenticated
  ) {
    console.log(
      "Usuario ya autenticado, redirigiendo según rol"
    );
    // Redirigir según el rol
    let redirectPath = "/usuario";
    if (authStore.user?.role === "admin") {
      redirectPath = "/admin";
    } else if (
      authStore.user?.role === "nutricionista"
    ) {
      redirectPath = "/nutricionista";
    }
    next(redirectPath);
    return;
  }

  // Verificar rol
  if (
    to.meta.role &&
    authStore.user?.role !== to.meta.role
  ) {
    console.log(
      "Usuario no tiene el rol correcto"
    );
    // Redirigir según el rol del usuario
    if (authStore.user?.role === "admin") {
      next("/admin");
    } else if (
      authStore.user?.role === "nutricionista"
    ) {
      next("/nutricionista");
    } else {
      next("/usuario");
    }
    return;
  }

  console.log("Navegación permitida a:", to.path);
  next();
});

export default router;
