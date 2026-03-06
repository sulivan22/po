import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="page-stack">
      <section className="card legal-card">
        <p className="eyebrow">Legal</p>
        <h1>Política de Privacidad</h1>
        <p>Última actualización: 6 de marzo de 2026</p>
        <p>
          En Porrify tratamos datos personales para gestionar porras privadas deportivas, autenticación de usuarios,
          pagos de acceso y clasificación de resultados.
        </p>

        <h2>1. Responsable del tratamiento</h2>
        <p>
          Responsable: Porrify.
          <br />
          Contacto: porrify@gmail.com
        </p>

        <h2>2. Datos que tratamos</h2>
        <p>Tratamos nombre visible, email de acceso, identificadores de usuario, selecciones deportivas y datos de pago.</p>
        <p>
          Los pagos se gestionan con Stripe. Porrify no almacena datos completos de tarjeta, solo identificadores y
          estado del pago.
        </p>

        <h2>3. Finalidades y base legal</h2>
        <p>Usamos tus datos para:</p>
        <p>- Permitir el registro y acceso seguro a la aplicación.</p>
        <p>- Gestionar la creación/unión a porras y su ranking.</p>
        <p>- Confirmar pagos y prevenir fraude.</p>
        <p>- Cumplir obligaciones legales y fiscales.</p>
        <p>Base legal: ejecución del servicio, consentimiento y cumplimiento legal (RGPD y LOPDGDD).</p>

        <h2>4. Conservación</h2>
        <p>
          Conservamos los datos mientras exista relación activa con el servicio y durante los plazos exigidos por la
          normativa aplicable.
        </p>

        <h2>5. Destinatarios</h2>
        <p>
          Compartimos datos solo con proveedores necesarios para operar el servicio: autenticación (Google), pagos
          (Stripe), base de datos y hosting.
        </p>

        <h2>6. Derechos de las personas usuarias</h2>
        <p>
          Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, escribiendo a
          porrify@gmail.com. También puedes presentar reclamación ante la autoridad de control competente.
        </p>

        <h2>7. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger la confidencialidad, integridad y
          disponibilidad de los datos.
        </p>

        <h2>8. Cambios en esta política</h2>
        <p>Publicaremos cualquier cambio relevante en esta misma página indicando la fecha de actualización.</p>

        <p className="legal-back-link">
          <Link href="/">Volver al inicio</Link>
        </p>
      </section>
    </div>
  );
}
