document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CONTROL DEL FORMULARIO DE CONTACTO
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');

    if (contactForm && statusMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue automáticamente

            // Captura de datos del formulario
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                projectType: document.getElementById('project-type').value,
                message: document.getElementById('message').value.trim()
            };

            // Referencia al botón de envío
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Estado de interfaz durante la carga
            submitBtn.textContent = 'Отправка...'; // "Enviando..."
            submitBtn.disabled = true;

            // Limpiar estilos previos del mensaje de estado
            statusMessage.className = '';
            statusMessage.style.cssText = '';

            try {
                // PETICIÓN FETCH REAL (Ruta relativa)
                // Funciona automáticamente en http://localhost:3000 y en el servidor de Render
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                // MANEJO DE LA RESPUESTA
                if (response.ok) {
                    // Éxito (HTTP status 200)
                    statusMessage.textContent = 'Ваша заявка успешно отправлена! Я свяжусь с вами в ближайшее время.';
                    statusMessage.style.color = '#10b981'; // Verde
                    statusMessage.style.border = '1px solid #10b981';
                    statusMessage.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    statusMessage.style.padding = '12px 16px';
                    statusMessage.style.borderRadius = '8px';
                    statusMessage.style.marginTop = '15px';

                    // Limpiar campos del formulario
                    contactForm.reset();
                } else {
                    // Error devuelto por el backend
                    throw new Error(result.message || 'Ошибка при отправке заявки');
                }

            } catch (error) {
                console.error('Error en la petición:', error);

                // Error de red o fallo en el servidor
                statusMessage.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
                statusMessage.style.color = '#ef4444'; // Rojo
                statusMessage.style.border = '1px solid #ef4444';
                statusMessage.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                statusMessage.style.padding = '12px 16px';
                statusMessage.style.borderRadius = '8px';
                statusMessage.style.marginTop = '15px';
            } finally {
                // Restaurar botón
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Mostrar el elemento y desplazar la pantalla suavemente hacia el mensaje
                statusMessage.classList.remove('hidden');
                statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // ==========================================
    // 2. EFECTO VISUAL DE NAVEGACIÓN (SCROLL SPY)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let currentSectionId = '';

            // Detectar qué sección está visible en pantalla
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 150)) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            // Resaltar el enlace activo del menú de navegación
            navLinks.forEach(link => {
                link.classList.remove('highlight');
                const href = link.getAttribute('href');
                if (href && currentSectionId && href === `#${currentSectionId}`) {
                    link.classList.add('highlight');
                }
            });
        });
    }
});