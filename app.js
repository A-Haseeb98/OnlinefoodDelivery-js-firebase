let getData = () => {
    const uid = localStorage.getItem('uid')
    let div = document.getElementById('nav-right')

// for checking authentication using local storage and Print Buttons accordingly

    if (!uid) {
        div.innerHTML = `
        <a href="login.html" class=" btn text-white btn-lg header-btn ">Sign In</a>
        <a href="signup.html" class=" btn btn-light  mr-3  btn-lg  header-btn">Register</a>
        `
    }
    else {
        div.innerHTML = ` <a onclick="logout()" class=" btn btn-light  mr-3  btn-lg  header-btn">logout</a> `
    }

// Print Restaurent Detail

    let main = document.getElementById('main')
    firebase.database().ref(`users`).once('child_added', (res) => {
        if (res.val().userRole === 'admin') {
            data = res.val();
            console.log(data);
            main.innerHTML +=
                `<div class="card  col-sm-4" id="$" style="width: 18rem;">
            <img class="card-img-top image-set" src="${data.profilePic}" alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title">${data.userName},</h5>
            <p class="card-text">${data.city}, ${data.country}</p>
        <a href="home.html#${data.id}">Go To Products</a>`
        }
    })
}
// for logout 
let logout = () => {
    firebase.auth().signOut().then(() => {
        console.log('logout done')
        localStorage.clear();
        window.location = 'index.html'
    })
}



