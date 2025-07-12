document.addEventListener('DOMContentLoaded', () => {
    const materias = document.querySelectorAll('.materia');
    const resetButton = document.getElementById('resetButton');

    // Mapeo de códigos de materia a sus elementos HTML para fácil acceso
    const materiaElements = {};
    materias.forEach(materia => {
        const codigo = materia.dataset.codigo;
        materiaElements[codigo] = materia;
    });

    // Definición de las prelaciones (prerrequisitos)
    // El formato es: { 'CODIGO_MATERIA': ['CODIGO_PREREQUISITO1', 'CODIGO_PREREQUISITO2', ...] }
    // Si no tiene prerrequisitos, la lista es vacía.
    const prelaciones = {
        // Semestre 1 (Ninguna tiene prerrequisitos iniciales)
        '006-1922': [],
        '007-1513': [],
        '008-1613': [],
        '009-1012': [],
        '091-1013': [],
        'xxx-xxx1': [], // Extra Académica Cultural ó Deportiva

        // Semestre 2
        '007-1523': ['007-1513'],
        '008-1623': ['008-1613'],
        '011-1623': [],
        '091-1323': [],
        '091-1822': [],
        'xxx-xxx2': [], // Electiva Socio-Humanística

        // Semestre 3
        '091-2333': ['091-1323'],
        '091-2833': ['091-1822'],
        '091-2933': ['008-1623'],
        '092-2233': [],
        '092-2633': [],
        '092-2733': [],

        // Semestre 4
        '091-2343': ['091-2333'],
        '091-2943': ['091-2933'],
        '092-2243': ['092-2233'],
        '092-2643': ['092-2633'],
        '092-2743': ['092-2733'],
        'xxx-xxx3': [], // Electiva Socio-Humanística

        // Semestre 5
        '091-3353': ['091-2343'],
        '091-3853': [],
        '092-3253': [],
        '092-3653': ['092-2633'],
        '092-3753': ['092-2743'],
        'xxx-xxx4': [], // Electiva Profesional

        // Semestre 6
        '091-3063': ['091-3353'],
        '091-3363': ['091-3353'],
        '091-3563': ['091-3353'],
        '091-3863': ['091-3853'],
        '092-3062': [],
        '092-3763': ['092-3753'],

        // Semestre 7
        '091-4373': ['092-3763'],
        '091-4474': ['091-3363'],
        '091-4573': ['091-3563'],
        '091-4873': ['091-3363'],
        '092-4972': ['092-3763'],
        // Asumiendo que esta electiva profesional tiene una prela interna, o ninguna en este nivel.
        // Si tienes más detalles de prerrequisitos de electivas, por favor, ajusta.
        'xxx-xxx2': [], // Esta se repite en la imagen, asumo que es una electiva profesional distinta a la del sem 2. Debería tener otro código. Si es la misma, la prelación sería la misma o ninguna.
                        // Dado que es 'xxx-xxx2' de nuevo, la trataré como una electiva libre sin prela específica del pensum, pero si tiene una, corrígeme.
                        // Para evitar duplicados de ID, he cambiado en el HTML las electivas a xxx-xxx1, xxx-xxx2, xxx-xxx3, xxx-xxx4, para reflejar las diferentes electivas.
                        // La imagen muestra la segunda electiva profesional como "xxx-xxx2", lo que es confuso.
                        // He asignado xxx-xxx4 para la Electiva Profesional del Semestre 5, y xxx-xxx5 para la del Semestre 7.
                        // *** IMPORTANTE: Si las electivas profesionales tienen códigos específicos o prerrequisitos, por favor, avísame para ajustarlo. Por ahora, las dejo sin prerrequisitos. ***
        'xxx-xxx5': [], // Electiva Profesional (ajustado en HTML para evitar duplicados)


        // Semestre 8
        '091-4382': ['092-4972'],
        '091-4383': ['091-4373'],
        '091-4483': ['091-4474'],
        '091-4582': ['091-4573'],
        '091-4583': ['091-4873'],
        '092-4183': [],

        // Semestre 9
        '091-5392': [], // En la imagen no se ve prela clara, la dejo sin prela.
        '091-5393': ['091-4383'],
        '091-5493': ['091-4483'],
        '091-5593': ['091-4583'],
        '091-5992': ['091-4582'],
        '091-5993': [], // En la imagen no se ve prela clara, la dejo sin prela.

        // Semestre 10
        '091-5509': [], // Trabajo de Grado - Comúnmente sin prela directa de materia, pero puede requerir X créditos. Lo dejo sin prela de materia para esta simulación.
        '091-5603': ['091-5393'] // Ética Profesional
    };


    // Función para guardar el estado en localStorage
    const saveState = () => {
        const approvedMaterias = [];
        document.querySelectorAll('.materia.aprobada').forEach(materia => {
            approvedMaterias.push(materia.dataset.codigo);
        });
        localStorage.setItem('mallaContaduriaState', JSON.stringify(approvedMaterias));
    };

    // Función para cargar el estado desde localStorage
    const loadState = () => {
        const savedState = localStorage.getItem('mallaContaduriaState');
        if (savedState) {
            const approvedMaterias = JSON.parse(savedState);
            approvedMaterias.forEach(codigo => {
                const materia = materiaElements[codigo];
                if (materia) {
                    materia.classList.add('aprobada');
                }
            });
        }
    };

    // Función para actualizar el estado de bloqueo/desbloqueo de las materias
    const updateMateriasStatus = () => {
        const approvedCodes = new Set();
        document.querySelectorAll('.materia.aprobada').forEach(materia => {
            approvedCodes.add(materia.dataset.codigo);
        });

        materias.forEach(materia => {
            const codigoMateria = materia.dataset.codigo;
            const prelacCodes = prelaciones[codigoMateria] || [];

            let allPrelacsApproved = true;
            if (prelacCodes.length > 0) {
                for (const prelacCode of prelacCodes) {
                    if (!approvedCodes.has(prelacCode)) {
                        allPrelacsApproved = false;
                        break;
                    }
                }
            }

            if (materia.classList.contains('aprobada')) {
                materia.classList.remove('bloqueada'); // Una aprobada no puede estar bloqueada
            } else if (!allPrelacsApproved) {
                materia.classList.add('bloqueada');
                materia.style.pointerEvents = 'none'; // Deshabilita clics
            } else {
                materia.classList.remove('bloqueada');
                materia.style.pointerEvents = 'auto'; // Habilita clics
            }
        });
    };

    // Manejar el clic en las materias
    materias.forEach(materia => {
        materia.addEventListener('click', () => {
            // Solo permitir hacer clic si no está aprobada y no está bloqueada
            if (!materia.classList.contains('aprobada') && !materia.classList.contains('bloqueada')) {
                materia.classList.add('aprobada');
                saveState();
                updateMateriasStatus();
            }
        });
    });

    // Botón de Reiniciar
    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres reiniciar toda la malla? Esto borrará tu progreso.')) {
            localStorage.removeItem('mallaContaduriaState');
            materias.forEach(materia => {
                materia.classList.remove('aprobada');
            });
            updateMateriasStatus(); // Actualiza para reflejar el estado inicial
        }
    });

    // Cargar estado al inicio y actualizar el estatus de las materias
    loadState();
    updateMateriasStatus();
});