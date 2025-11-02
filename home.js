const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
} else {
  document.body.style.display = "block";
  console.log("Token disponível:", token);
}

function clicar(elemento) {
    setTimeout(function() {
        window.location.href = elemento.href;
    }, 300);
}
