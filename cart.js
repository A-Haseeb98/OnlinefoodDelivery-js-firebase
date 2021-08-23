let orderList = document.getElementById('orderList')
let key = localStorage.getItem('key')
console.log(key)

firebase.auth().onAuthStateChanged((user) => {
    if (user) {

        firebase.database().ref(`users/${key}/orders/${user.uid}`).on('value', (res) => {
            console.log(res.val())
            orderList.innerHTML = ''  
            let data = res.val()
            for (let key1 in data) {
                console.log(data[key1])
                orderList.innerHTML += `<div class="card col-sm-3" id="$" style="width: 18rem;">
                <img class="card-img-top image-set" src="${data[key1].url}" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">Product Name: ${data[key1].productName}</h5>
                <p class="card-text">Price: ${data[key1].price}</p>
                <p class="card-text">Product Category: ${data[key1].category}</p>
                <p class="card-text">Order Status: ${data[key1].orderStatus}</p>
                `
                
            }
        })

    } else {

        console.log(`bye`)
    }
});
