let orderList = document.getElementById('orderList')
const key = localStorage.getItem('key')
const uid = localStorage.getItem('uid')
const role = localStorage.getItem('role')

if (role === 'local-user' && uid) {

    console.log('local User! allow')
    firebase.database().ref(`users/${key}/orders/${uid}`).on('value', (res) => {
        orderList.innerHTML = ''
        let data = res.val()
        for (let key1 in data) {
            orderList.innerHTML += `<div class="card col-sm-3" id="$" style="width: 18rem;">
                        <img class="card-img-top image-set" src="${data[key1].url}" alt="Card image cap">
                        <div class="card-body">
                        <h5 class="card-title">Product Name: ${data[key1].productName}</h5>
                        <p class="card-text">Price: ${data[key1].price}</p>
                        <p class="card-text">Product Category: ${data[key1].category}</p>
                        <p class="card-text">Order Status: ${data[key1].orderStatus}</p>`
        }
    })
}
else {
    console.log('not allow')
    window.location = 'index.html'

}


let logout = () => {
    firebase.auth().signOut().then(() => {
        console.log('logout done')
        window.location = 'index.html'
        localStorage.clear()
    })
}
