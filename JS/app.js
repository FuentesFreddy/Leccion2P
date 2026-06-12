document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("notaConceptualForm");
    const btnGuardar = document.getElementById("btnGuardar");
    const errorContainer = document.getElementById("errorContainer");
    const resumenSection = document.getElementById("resumenSection");
    const resumenContenido = document.getElementById("resumenContenido");

    // Lógica opcional para calcular automáticamente el plazo aproximado en meses al cambiar fechas
    const fechaInicioInput = document.getElementById("fechaInicio");
    const fechaFinInput = document.getElementById("fechaFin");
    const plazoInput = document.getElementById("plazoEjecucion");

    function calcularPlazo() {
        if (fechaInicioInput.value && fechaFinInput.value) {
            const inicio = new Date(fechaInicioInput.value);
            const fin = new Date(fechaFinInput.value);
            const meses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
            plazoInput.value = meses > 0 ? meses : 0;
        }
    }
    fechaInicioInput.addEventListener("change", calcularPlazo);
    fechaFinInput.addEventListener("change", calcularPlazo);

    // ESCUCHADOR DE EVENTOS AL GUARDAR
    btnGuardar.addEventListener("click", () => {
        try {
            // Ocultar estados previos
            errorContainer.classList.add("hidden");
            errorContainer.innerHTML = "";
            
            // Ejecutar validaciones obligatorias
            validarFormulario();

            // Si pasa la validación, procesar y generar resumen dinámico
            generarResumen();

        } catch (error) {
            // Manejo de excepciones capturadas de la validación
            mostrarErrores(error.errores || [error.message]);
        }
    });

    // FUNCIÓN DE VALIDACIÓN (Lanza excepciones controladas)
    function validarFormulario() {
        const listaErrores = [];

        // 1. Validar que campos de texto de entrada obligatorios no estén vacíos
        const inputsRequeridos = form.querySelectorAll("input[required], select[required]");
        inputsRequeridos.forEach(input => {
            if (!input.value.trim()) {
                const labelText = input.closest(".form-group")?.querySelector("label")?.innerText.replace(" *", "");
                listaErrores.push(`El campo '${labelText || input.id}' es obligatorio.`);
            }
        });

        // 2. Validación de Fechas lógica (Fin debe ser posterior a Inicio)
        if (fechaInicioInput.value && fechaFinInput.value) {
            const inicio = new Date(fechaInicioInput.value);
            const fin = new Date(fechaFinInput.value);
            if (fin <= inicio) {
                listaErrores.push("La fecha de finalización debe ser estrictamente posterior a la fecha de inicio.");
            }
        }

        // 3. Debe seleccionarse al menos una cobertura (Checkboxes)
        const coberturasSeleccionadas = Array.from(form.querySelectorAll("input[name='cobertura']:checked"));
        if (coberturasSeleccionadas.length === 0) {
            listaErrores.push("Debe seleccionar al menos una opción de Cobertura Territorial.");
        }

        // 4. Debe seleccionarse al menos un sector de población beneficiaria (Checkboxes)
        const sectoresSeleccionados = Array.from(form.querySelectorAll("input[name='sector']:checked"));
        if (sectoresSeleccionados.length === 0) {
            listaErrores.push("Debe seleccionar al menos un Sector de la Población Beneficiaria.");
        }

        // 5. Debe seleccionarse un ámbito prioritario de actuación (Radio Buttons)
        const ambitoSeleccionado = form.querySelector("input[name='ambito']:checked");
        if (!ambitoSeleccionado) {
            listaErrores.push("Debe seleccionar un Ámbito Prioritario de Actuación.");
        }

        // Si se acumularon errores, se lanza la excepción estructurada
        if (listaErrores.length > 0) {
            const excepcionValidacion = new Error("Error de validación de datos");
            excepcionValidacion.errores = listaErrores;
            throw excepcionValidacion;
        }
    }

    // MUESTRA ERRORES EN LA INTERFAZ
    function mostrarErrores(errores) {
        errorContainer.innerHTML = `
            <h4>No se pudo guardar el formulario. Por favor corrija lo siguiente:</h4>
            <ul>
                ${errores.map(err => `<li>${err}</li>`).join("")}
            </ul>
        `;
        errorContainer.classList.remove("hidden");
        resumenSection.classList.add("hidden"); // Ocultar si falló
        window.scrollTo({ top: errorContainer.offsetTop - 40, behavior: 'smooth' });
    }

    // CONSTRUYE EL RESUMEN DINÁMICO REQUERIDO MEDIANTE MANIPULACIÓN DEL DOM
    function generarResumen() {
        // Recuperación limpia de valores recolectados
        const nombre = document.getElementById("nombreProyecto").value;
        const depto = document.getElementById("departamento").value;
        const plazo = document.getElementById("plazoEjecucion").value || "No definido";
        
        const coberturas = Array.from(form.querySelectorAll("input[name='cobertura']:checked"))
                                .map(c => c.value).join(", ");
                                
        const sectores = Array.from(form.querySelectorAll("input[name='sector']:checked"))
                              .map(s => s.value).join(", ");
                              
        const odsVal = document.getElementById("ods").value;
        const metaVal = document.getElementById("metaOds").value;
        const peiObj = document.getElementById("peiObjetivo").value;
        const invPrin = document.getElementById("invPrincipal").value;

        // Inyección dinámica de la plantilla en el contenedor de resultados
        resumenContenido.innerHTML = `
            <div class="resumen-grid">
                <div class="resumen-item"><strong>Nombre del Proyecto:</strong> ${nombre}</div>
                <div class="resumen-item"><strong>Departamento:</strong> ${depto}</div>
                <div class="resumen-item"><strong>Plazo de Ejecución:</strong> ${plazo} meses</div>
                <div class="resumen-item"><strong>Cobertura Seleccionada:</strong> ${coberturas}</div>
                <div class="resumen-item"><strong>Sector Beneficiario:</strong> ${sectores}</div>
                <div class="resumen-item"><strong>Objetivo de Desarrollo Sostenible (ODS):</strong> ${odsVal}</div>
                <div class="resumen-item"><strong>Meta ODS:</strong> ${metaVal}</div>
                <div class="resumen-item"><strong>Objetivo Estratégico (PEI):</strong> ${peiObj}</div>
                <div class="resumen-item"><strong>Línea de Investigación Principal:</strong> ${invPrin}</div>
            </div>
        `;

        // Hacer visible la sección de resultados exitosos
        resumenSection.classList.remove("hidden");
        window.scrollTo({ top: resumenSection.offsetTop - 20, behavior: 'smooth' });
    }
});