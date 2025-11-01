// Pequeños comportamientos globales: nav activo y validación básica del formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
  // Marcar link activo según la ruta
  const links = document.querySelectorAll('.nav a');
  links.forEach(a => {
    try {
      const href = a.getAttribute('href');
      if (!href) return;
      const current = location.pathname.split('/').pop() || 'index.html';
      if (href === current || (href === 'index.html' && current === '')) {
        a.classList.add('active');
      }
    } catch (e) { /* safe */ }
  });

  // Validación básica y UX del formulario de contacto
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      // validación sencilla
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        showMessage(form, 'Por favor completa todos los campos.', 'error');
        return;
      }

      // Simular envío (no hay back-end). Mostrar confirmación y limpiar.
      showMessage(form, 'Mensaje enviado. Gracias por contactarnos.', 'success');
      form.reset();
    });
  }

  function showMessage(formEl, text, type) {
    // eliminar mensajes previos
    const prev = formEl.querySelector('.contact-success, .contact-error');
    if (prev) prev.remove();
    const div = document.createElement('div');
    div.textContent = text;
    div.className = type === 'success' ? 'contact-success' : 'contact-error';
    formEl.appendChild(div);
    setTimeout(() => div.remove(), 6000);
  }
});
