// JS de soporte para las páginas de solicitud (viaje / acarreo)
document.addEventListener('DOMContentLoaded', function () {
  // Helpers
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  // Map preview updater - recibe lat,lng y actualiza iframe src
  function updateMapPreview(iframe, lat, lng) {
    if (!iframe) return;
    const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    iframe.src = src;
  }

  // Usar ubicación del dispositivo – añade opción temporal en el select y la selecciona
  $all('.use-my-location').forEach(function(btn){
    btn.addEventListener('click', function(e){
      const container = btn.closest('.solicitud-card');
      const select = container.querySelector('.select-location');
      const mapIframe = container.querySelector('.map-preview');

      if (!navigator.geolocation) {
        alert('Geolocalización no soportada en este navegador.');
        return;
      }

      btn.classList.add('loading');
      navigator.geolocation.getCurrentPosition(function(pos){
        btn.classList.remove('loading');
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const val = `Mi ubicación (${lat}, ${lng})`;

        // Añadir opción temporal si no existe
        let opt = Array.from(select.options).find(o => o.value === val);
        if (!opt) {
          opt = document.createElement('option');
          opt.value = val;
          opt.text = val;
          select.insertBefore(opt, select.firstChild);
        }
        select.value = val;
        updateMapPreview(mapIframe, lat, lng);
      }, function(err){
        btn.classList.remove('loading');
        alert('No se pudo obtener la ubicación. Por favor permita el acceso o intenta de nuevo.');
      }, { enableHighAccuracy: true, timeout: 10000 });
    });
  });

  // Cuando cambie el select de origen o destino, actualizar mapa si la opción tiene coord
  $all('.select-location').forEach(function(sel){
    sel.addEventListener('change', function(){
      const container = sel.closest('.solicitud-card');
      const mapIframe = container.querySelector('.map-preview');
      const val = sel.value;
      // Si el valor tiene paréntesis con coords: buscar patrón (lat, lng)
      const match = val.match(/\(([-0-9.]+),\s*([-0-9.]+)\)/);
      if (match) {
        updateMapPreview(mapIframe, match[1], match[2]);
      } else {
        // si no hay coords, usar búsqueda por texto
        const query = encodeURIComponent(val);
        if (mapIframe) mapIframe.src = `https://www.google.com/maps?q=${query}&z=13&output=embed`;
      }
    });
  });

  // Payment method toggle
  $all('input[name="payment_method"]').forEach(function(r){
    r.addEventListener('change', function(){
      const container = r.closest('.solicitud-card');
      if (!container) return;
      const cardForm = container.querySelector('.card-form');
      if (r.value === 'card') {
        cardForm.style.display = 'block';
      } else {
        cardForm.style.display = 'none';
      }
    });
  });

  // Simple form submit handler (visual only)
  $all('.solicitud-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      btn.disabled = true;
      btn.textContent = 'Procesando...';

      // Simular validación/submit
      setTimeout(function(){
        btn.disabled = false;
        btn.textContent = 'Enviar solicitud';
        console.log('Solicitud datos:', new FormData(form));
        // Si el formulario indica data-redirect, navegar a esa vista
        if (form.dataset && form.dataset.redirect) {
          // redirigir en el mismo directorio
          window.location.href = form.dataset.redirect;
          return;
        }
        alert('Solicitud enviada (simulada). Revisa la consola para ver los datos.');
      }, 900);
    });
  });

  /* -------------------- Visualizar solicitud (driver + chat) -------------------- */
  // Inicializa el chat si existe la sección
  if ($('.chat-container')) {
    const chatSection = $('.chat-section');
    const startChatBtn = $('#start-chat');
    const messagesEl = $('#messages');
    const chatForm = $('#chat-form');
    const chatInput = $('#chat-input');

    function appendMessage(text, who){
      const div = document.createElement('div');
      div.className = 'msg ' + (who === 'me' ? 'me' : 'they');
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Simular driver aceptando y mostrar información (si se quiere, se podría cargar dinámicamente)
    // startChatBtn habilita el chat
    if (startChatBtn) {
      startChatBtn.addEventListener('click', function(){
        if (chatSection.getAttribute('aria-hidden') === 'true') {
          chatSection.setAttribute('aria-hidden', 'false');
          chatSection.style.display = 'block';
          appendMessage('Hola, soy Carlos. ¿En qué puedo ayudarte?', 'they');
          chatInput.focus();
        } else {
          chatSection.setAttribute('aria-hidden', 'true');
          chatSection.style.display = 'none';
        }
      });
    }

    // Manejo del envío de mensajes (simulado)
    if (chatForm) {
      chatForm.addEventListener('submit', function(e){
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage(text, 'me');
        chatInput.value = '';

        // respuesta automatizada simulada del conductor
        setTimeout(function(){
          appendMessage('Recibido. Llego en 5 minutos.', 'they');
        }, 800 + Math.random()*800);
      });
    }
  }
});
