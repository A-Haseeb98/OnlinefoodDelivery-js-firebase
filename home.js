const uid = localStorage.getItem('uid')
const role = localStorage.getItem('role')

const key = window.location.hash.slice(1);

localStorage.setItem('key', key)

// for checking authentication using local storage and Print Buttons accordingly
let div = document.getElementById('nav-right')
if (!uid) {
    div.innerHTML = `<a href="login.html" class=" btn text-white btn-lg header-btn ">Sign In</a>
                     <a href="signup.html" class=" btn btn-light  mr-3  btn-lg  header-btn">Register</a>`
}
else {
    div.innerHTML = `<a onclick="logout()" class=" btn btn-light  mr-3  btn-lg  header-btn">logout</a> `
}

// for print selected restaurent data, Category wise
let getRestaurent = () => {

    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val();
        cover.innerHTML +=
            `<h1 class="title-1">${data.userName}</h1>
            <img class="coverPic" src="${data.profilePic}"  />`
    })

    // for lunch Category
    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val().products.Lunch;

        for (var key1 in data) {
            lunch.innerHTML +=
                `<div class="card col-xl-4 col-sm-12 col-md-6" id="$" style="width: 18rem;">
        <img class="card-img-top image-set" src="${data[key1].pImage}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${data[key1].pName}</h5>
        <p class="card-text">${data[key1].pPrice}</p>
        <p class="card-text">${data[key1].pDescription}</p>
            <button class="myBtn" onclick ='addToCart("${data[key1].pId}","${data[key1].pCategory}","${data[key1].pName}","${data[key1].pPrice}","${data[key1].pImage}")'>Order Now</button>`
        }
    })

    // for breakFast Category
    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val().products.BreakFast;
        for (var key1 in data) {

            breakFast.innerHTML +=
                `<div class="card col-xl-4 col-sm-12 col-md-6" id="$" style="width: 18rem;">
        <img class="card-img-top image-set" src="${data[key1].pImage}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${data[key1].pName}</h5>
        <p class="card-text">${data[key1].pPrice}</p>
        <p class="card-text">${data[key1].pDescription}</p>
        <button class="myBtn" onclick ='addToCart("${data[key1].pId}","${data[key1].pCategory}","${data[key1].pName}","${data[key1].pPrice}","${data[key1].pImage}")'>Order Now</button> `
        }
    })

    // for Dinner Category
    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val().products.Dinner;

        for (var key1 in data) {
            dinner.innerHTML +=
                `<div class="card col-xl-4 col-sm-12 col-md-6" id="$" style="width: 18rem;">
        <img class="card-img-top image-set" src="${data[key1].pImage}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${data[key1].pName}</h5>
        <p class="card-text">${data[key1].pPrice}</p>
        <p class="card-text">${data[key1].pDescription}</p>
        <button class="myBtn" onclick ='addToCart("${data[key1].pId}","${data[key1].pCategory}","${data[key1].pName}","${data[key1].pPrice}","${data[key1].pImage}")'>Order Now</button> `
        }
    })

    // for fastFood Category

    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val().products.fastFood;

        for (var key1 in data) {
            fastFood.innerHTML +=
                `<div class="card col-xl-4 col-sm-12 col-md-6" id="$" style="width: 18rem;">
        <img class="card-img-top image-set" src="${data[key1].pImage}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${data[key1].pName}</h5>
        <p class="card-text">${data[key1].pPrice}</p>
        <p class="card-text">${data[key1].pDescription}</p>
        <button class="myBtn" onclick ='addToCart("${data[key1].pId}","${data[key1].pCategory}","${data[key1].pName}","${data[key1].pPrice}","${data[key1].pImage}")'>Order Now</button>`
        }
    })
}

let addToCart = (dataKey, category, productName, price, url) => {


    if (role === 'local-user' && uid) {
        console.log('Local User! allow')
        firebase.database().ref(`users/${uid}`).once('value', (res) => {
            console.log(res.val())
        })
        firebase.database().ref(`users/${key}/orders/${uid}/${dataKey}`).set({
            id: uid,
            orderKey: dataKey,
            productName: productName,
            category: category,
            price: price,
            url: url

        }).then(() => {
            console.log('done')
            alert('Order Added! Visit Add to Cart Page to See Your Order Status')
        })

    }

    else {
        console.log('not allow')
        alert('Restaurent Not Allowed to order food')
    }
}

let goToCart = () => {
    window.location.href = 'cart.html'
}

let logout = () => {
    firebase.auth().signOut().then(() => {
        console.log('logout done')
        localStorage.clear()
        window.location = 'index.html'
    })
}
