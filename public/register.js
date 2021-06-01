let form = document.getElementById("registerForm");
let apiUrl = `https://yesh-netflix-api.herokuapp.com/`

// https://yesh-netflix-api.herokuapp.com/

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let payload = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value
    }
    console.log(payload);

    fetch(`${apiUrl}register`, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        }else{
            throw new Error('Something went wrong');
        }
    })
    .then((response) => {
        console.log(response)
        location.href = `/login.html?existingEmail=${payload.email}&registered=true`
    })
    // .then((data) => {
    //     console.log(data);
    // })
    .catch((err) => {
        console.log(err)
        location.href = `/login.html?existingEmail=${payload.email}&user=exists`
        
    })
})