const btnLogin = document.getElementById('btnLogin')
const inputUser = document.getElementById('inputUser')
const inputPass = document.getElementById('inputPass')
const togglePass = document.getElementById("togglePass");
const aviso = document.getElementById("aviso");

togglePass.addEventListener("click", () => {
    
    if (inputPass.type === "password"){
        inputPass.type = "text" 
        togglePass.className = "fa-solid fa-eye" 
    }
    else{
        inputPass.type = "password" 
        togglePass.className = "fa-solid fa-eye-slash"   
    }

});

inputPass.addEventListener('focus', () =>{
    togglePass.style.transform = 'scale(1.2)';
})
inputPass.addEventListener('blur', () =>{
    togglePass.style.transform = 'scale(1)';
})
inputUser.addEventListener('input', () =>{
    enableConfirmar()
})
inputPass.addEventListener('input', () =>{
    enableConfirmar()
})

btnLogin.addEventListener('click', async () =>{
    const payload = {
        userName: inputUser.value,
        passWd: inputPass.value,
    };
    const resposta = await fetch(`https://agendabackend-xdmi.onrender.com/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const dados = await resposta.json();

    if (resposta.ok) {
        inputPass.value = ""
        inputUser.value = ""

        localStorage.setItem("token", dados.token);
        window.location.href = "home.html";
    }
    else{
        aviso.style.opacity = "100%"

       if (resposta.status === 401) {
           aviso.textContent = "Usuário ou senha inválidos"; 
        } else if (resposta.status === 500) {
            aviso.textContent = "Erro ao contatar o servidor, tente novamente mais tarde";
        } else {
            aviso.textContent = `Erro inesperado: ${resposta.status}`;
        }
    }
})

document.addEventListener('click', (event) => {
        aviso.style.opacity = "0%"
});

function enableConfirmar(){
    if (inputPass.value !== "" && inputUser !== ""){
        btnLogin.disabled = false
    }
    else{
        btnLogin.disabled = true
    }
}
