// Funciones para manejar formularios
export function initFormHandlers() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formType = event.target.id.replace('form-', '');
    
    // Aquí iría la lógica de envío del formulario
    console.log(`Enviando datos de ${formType}:`, Object.fromEntries(formData));
}

// Función para cambiar entre formularios
export function initFormSwitcher() {
    const buttons = document.querySelectorAll('.selector-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => cambiarFormulario(button.dataset.form));
    });

    // Verificar parámetro en URL al cargar
    window.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        const tipoUsuario = params.get('tipo');
        if (tipoUsuario === 'taxista') {
            cambiarFormulario('taxista');
        }
    });
}

function cambiarFormulario(tipo) {
    // Remover clase active de todos los botones y formularios
    document.querySelectorAll('.selector-btn').forEach(btn => 
        btn.classList.remove('active')
    );
    document.querySelectorAll('.form-registro').forEach(form => 
        form.classList.remove('active')
    );
    
    // Agregar clase active al botón y formulario correspondiente
    document.querySelector(`[data-form="${tipo}"]`).classList.add('active');
    document.getElementById(`form-${tipo}`).classList.add('active');
}