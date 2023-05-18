//Projecto Moudrost

// Funcionalidad N° 1 - Calculadora de prestamos empresariales
let prestamos = [];

document.addEventListener("DOMContentLoaded", function() {
  const prestadores = {
    tecnologia: {
      nombre: "TecnoSoft",
      tasaInteres: 15,
      montoMinimo: 5000,
      montoMaximo: 50000,
      plazoPagos: 12
    },
    mineria: {
      nombre: "Minerales S.A.",
      tasaInteres: 20,
      montoMinimo: 10000,
      montoMaximo: 100000,
      plazoPagos: 24
    },
    agricultura: {
      nombre: "AgroIndustrias",
      tasaInteres: 12,
      montoMinimo: 2000,
      montoMaximo: 20000,
      plazoPagos: 6
    }
  };

  const empresaSelect = document.getElementById("empresa");
  const montoInput = document.getElementById("monto");
  const calcularBtn = document.getElementById("calcular");
  const listaPrestamos = document.getElementById("listaPrestamos");

  empresaSelect.selectedIndex = 0;
  montoInput.value = "";

  calcularBtn.addEventListener("click", function() {
    const empresaValue = empresaSelect.value;
    const empresa = prestadores[empresaValue];
    const monto = parseInt(montoInput.value);

    if (isNaN(monto) || monto < empresa.montoMinimo || monto > empresa.montoMaximo) {
      return alert("ingrese un monto entre: "+ empresa.montoMinimo + " y " +empresa.montoMaximo);
    };

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
  });

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

  mostrarPrestamosGuardados();
});