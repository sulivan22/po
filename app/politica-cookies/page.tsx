import Link from "next/link";

export default function CookiesPolicyPage() {
  return (
    <div className="page-stack">
      <section className="card legal-card">
        <p className="eyebrow">Legal</p>
        <h1>Política de Cookies</h1>
        <p>Última actualización: 6 de marzo de 2026</p>
        <p>
          Esta política explica qué cookies y tecnologías similares usa Porrify para que la plataforma funcione de
          forma segura y eficiente.
        </p>

        <h2>1. Qué son las cookies</h2>
        <p>
          Son pequeños archivos que se guardan en tu navegador para recordar sesión, preferencias técnicas y métricas
          de uso.
        </p>

        <h2>2. Tipos de cookies que usamos</h2>
        <p>- Cookies técnicas necesarias: autenticación, sesión y seguridad.</p>
        <p>- Cookies funcionales: recordar estado básico de navegación dentro de la app.</p>
        <p>- Cookies de terceros estrictamente necesarias para login y pago (Google y Stripe).</p>

        <h2>3. Finalidad</h2>
        <p>
          Permitir el acceso seguro, mantener la sesión iniciada, completar pagos y proteger la plataforma frente a
          usos indebidos.
        </p>

        <h2>4. Gestión y desactivación</h2>
        <p>
          Puedes gestionar o bloquear cookies desde la configuración del navegador. Si desactivas cookies técnicas,
          algunas funciones de la web pueden dejar de operar correctamente.
        </p>

        <h2>5. Transferencias con terceros</h2>
        <p>
          Algunos proveedores pueden tratar datos en otros países bajo sus propias políticas y mecanismos de garantía
          legal.
        </p>

        <h2>6. Cambios en esta política</h2>
        <p>Cualquier cambio se publicará en esta página con fecha de actualización.</p>

        <p className="legal-back-link">
          <Link href="/">Volver al inicio</Link>
        </p>
      </section>
    </div>
  );
}
