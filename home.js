let key = window.location.hash;
key = key.slice(1)

let getRestaurent = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let div = document.getElementById('nav-right')
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            div.innerHTML = ` <a href="" onclick="logout()" class=" btn btn-light  mr-3  btn-lg  header-btn">logout</a> `
        } else {
            // User is signed out
            console.log(`bye`)
            // ...
        }
    });

    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val().RestaurentData;
        cover.innerHTML +=
            `<h1 class="title-1">${data.userName}</h1>
            <img class="coverPic" src="${data.profilePic}"  />`
    })

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

    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val().products.Dinner;

        for (var key1 in data) {

            if (data == undefined) {
                console.log(`undifined`)
                dinner.remove();
            }

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

    firebase.database().ref(`users/${key}`).once('value', (data) => {
        data = data.val().products.fastFood;
        if (data == undefined) {
            console.log(`undifined`)
            fastFood.remove();
        }

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

let addToCart = (dataKey, category, productName,price, url) => {
    console.log(category)
    console.log(dataKey)
    console.log(productName)
    console.log(price)
    console.log(url)


    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            firebase.database().ref(`users/${user.uid}`).once('value', (res) => {
                console.log(res.val())
            })
            firebase.database().ref(`users/${key}/orders/${user.uid}/${dataKey}`).set({
                id: user.uid,
                orderKey: dataKey,
                productName: productName,
                category: category,
                price:price,
                url:url

            }).then(() => {
                console.log('done')
                alert('Order Added! Visit Add to Cart Page to See Your Order Status')
                localStorage.setItem('key', key)

            })



        } else {
            // User is signed out
            console.log(`bye`)
            // ...
        }
    });




}

let goToCart = () => {


    window.location.href = 'cart.html'

}

let logout = () => {
    firebase.auth().signOut().then(() => {
        console.log('logout done')
    })
}
