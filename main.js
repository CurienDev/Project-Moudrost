let prestamos = [];

document.addEventListener("DOMContentLoaded", function() {
  fetch("./prestadores.json")
    .then(response => response.json())
    .then(data => {
      const prestadores = data.prestadores;

      const empresaSelect = document.getElementById("empresa");
      const montoInput = document.getElementById("monto");
      const calcularBtn = document.getElementById("calcular");
      const listaPrestamos = document.getElementById("listaPrestamos");
      const listaProximos = document.getElementById("listaProximos");
      const listaCaducados = document.getElementById("listaCaducados");

      empresaSelect.selectedIndex = 0;
      montoInput.value = "";

      cargarPrestadores(prestadores);

      empresaSelect.addEventListener("change", function() {
        const empresaValue = empresaSelect.value;
        const empresa = prestadores.find(prestador => prestador.nombre === empresaValue);

        if (empresa) {
          mostrarDetallesEmpresa(empresa);
        } else {
          ocultarDetallesEmpresa();
        }
      });

      calcularBtn.addEventListener("click", function() {
        const empresaValue = empresaSelect.value;
        const empresa = prestadores.find(prestador => prestador.nombre === empresaValue);
        const monto = parseInt(montoInput.value);
      
        const mensajeError = document.getElementById("mensajeError");
      
        if (isNaN(monto) || monto < empresa.montoMinimo || monto > empresa.montoMaximo) {
          mensajeError.textContent = "Esta empresa solo admite préstamos entre: " + empresa.montoMinimo + " y " + empresa.montoMaximo + ", por favor, ingrese el monto correcto.";
          return;
        } else {
          mensajeError.textContent = "";
        }
        
        const { intereses, total, cuotaMensual } = calcularPrestamo(monto, empresa.tasaInteres, empresa.plazoPagos);
      
        document.getElementById("nombreEmpresa").textContent = "Empresa: " + empresa.nombre;
        document.getElementById("tasaInteres").textContent = "Tasa de Interés: " + empresa.tasaInteres + "%";
        document.getElementById("montoMinimo").textContent = "Monto Mínimo: " + empresa.montoMinimo;
        document.getElementById("montoMaximo").textContent = "Monto Máximo: " + empresa.montoMaximo;
        document.getElementById("plazoPagos").textContent = "Plazo de Pagos: " + empresa.plazoPagos + " meses";
        document.getElementById("intereses").textContent = "Intereses: $" + intereses;
        document.getElementById("total").textContent = "Monto Total a Pagar: $" + total;
        document.getElementById("cuotaMensual").textContent = "Cuota Mensual: $" + cuotaMensual.toFixed(2);
      
        const prestamo = {
          empresa: empresa.nombre,
          monto: monto,
          intereses: intereses,
          total: total,
          cuotaMensual: cuotaMensual.toFixed(2)
        };
      
        prestamos.push(prestamo);
        guardarPrestamos();
      
        mostrarPrestamosGuardados();
        
        mostrarPrestadoresProximos(prestadores);
        mostrarPrestadoresCaducados(prestadores);
      });

      function cargarPrestadores(prestadores) {
        empresaSelect.innerHTML = "";
        prestadores.forEach(prestador => {
          if (prestador.estadoContratacion === "vigente") {
            const option = document.createElement("option");
            option.value = prestador.nombre;
            option.textContent = prestador.nombre;
            empresaSelect.appendChild(option);
          }
        });
      }

      function mostrarDetallesEmpresa(empresa) {
        document.getElementById("nombreEmpresa").textContent = "Empresa: " + empresa.nombre;
        document.getElementById("tasaInteres").textContent = "Tasa de Interés: " + empresa.tasaInteres + "%";
        document.getElementById("montoMinimo").textContent = "Monto Mínimo: " + empresa.montoMinimo;
        document.getElementById("montoMaximo").textContent = "Monto Máximo: " + empresa.montoMaximo;
        document.getElementById("plazoPagos").textContent = "Plazo de Pagos: " + empresa.plazoPagos + " meses";

        document.getElementById("detallePrestamo").style.display = "block";
      }

      function ocultarDetallesEmpresa() {
        document.getElementById("detallePrestamo").style.display = "none";
      }

      function calcularPrestamo(monto, tasaInteres, plazoPagos) {
        let intereses = monto * tasaInteres / 100;
        let total = monto + intereses;
        let cuotaMensual = total / plazoPagos;
        return { intereses, total, cuotaMensual };
      }

      function guardarPrestamos() {
        localStorage.setItem("prestamos", JSON.stringify(prestamos));
      }

      function mostrarPrestamosGuardados() {
        const prestamosGuardados = JSON.parse(localStorage.getItem("prestamos"));

        listaPrestamos.innerHTML = "";

        if (prestamosGuardados) {
          prestamos = prestamosGuardados;
          prestamos.forEach((prestamo, index) => {
            const li = document.createElement("li");
            li.textContent = `Préstamo ${index + 1}: Empresa: ${prestamo.empresa}, Monto: $${prestamo.monto}, Intereses: $${prestamo.intereses}, Total a pagar: $${prestamo.total}, Cuota Mensual: $${prestamo.cuotaMensual}`;
            listaPrestamos.appendChild(li);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.addEventListener("click", function() {
              eliminarPrestamo(index);
            });
            li.appendChild(deleteBtn);
          });
        }
      }

      function eliminarPrestamo(index) {
        prestamos.splice(index, 1);
        guardarPrestamos();
        mostrarPrestamosGuardados();
      }

      function mostrarPrestadoresProximos(prestadores) {
        listaProximos.innerHTML = "";

        prestadores.forEach(prestador => {
          if (prestador.estadoContratacion === "proximo") {
            const li = document.createElement("li");
            li.textContent = `${prestador.nombre} - Estado: Próximo`;
            listaProximos.appendChild(li);
          }
        });
      }

      function mostrarPrestadoresCaducados(prestadores) {
        listaCaducados.innerHTML = "";

        prestadores.forEach(prestador => {
          if (prestador.estadoContratacion === "caducado") {
            const li = document.createElement("li");
            li.textContent = `${prestador.nombre} - Estado: Caducado`;
            listaCaducados.appendChild(li);
          }
        });
      }

      mostrarPrestamosGuardados();
      mostrarPrestadoresProximos(prestadores);
      mostrarPrestadoresCaducados(prestadores);
    })
    .catch(error => {
      console.error("Error al cargar los prestadores:", error);
    });
});