
  // Comprueba si la URL actual termina en 'index.html' (o 'index.htm')
  if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/index.htm')) {
    // Reemplaza la URL actual con la URL de la carpeta (ej. /carpeta/ en lugar de /carpeta/index.html)
    // Esto es un redireccionamiento del lado del cliente.
    window.location.replace(window.location.pathname.replace(/index\.html?$/, ""));
  }
