const uid = localStorage.getItem('uid');
const role = localStorage.getItem('role')

if (role === 'admin' && uid) {
    console.log('Admin User! allow')
}

else {
    console.log('not allow')
    window.location = '../index.html'
}

let createProduct = async () => {
    let pName = document.getElementById('pName')
    let pCategory = document.getElementById('pCategory')
    let pPrice = document.getElementById('pPrice')
    let pDescription = document.getElementById('pDescription')
    let pDelivery = document.getElementById('pDelivery')
    let pImage = document.getElementById('pImage')
    let pImageUrl = await uploadFiles(pImage.files[0])

    let productId = firebase.database().ref().push().getKey()
    console.log(productId)
    firebase.database().ref(`users/${uid}/products/${pCategory.value}/${productId}}`).set(
        {
            pId: productId,
            pName: pName.value,
            pCategory: pCategory.value,
            pPrice: pPrice.value,
            pDescription: pDescription.value,
            pDelivery: pDelivery.value,
            pImage: pImageUrl
        })
        .then(() => {
            console.log('done')
            alert('Product Added')
            // window.location = 'index.html'
        })
}

let logout = () => {
    firebase.auth().signOut().then(() => {
        console.log('logout done')
        localStorage.clear()
        window.location = '../index.html'
    })
}


let getOrders = () => {
    let orderList = document.getElementById('orderList')

    firebase.database().ref(`users/${uid}/orders`).on('value', (res) => {
        let data = res.val()
        orderList.innerHTML = ''
        for (let key in data) {
            console.log(data[key])
            for (let key1 in data[key]) {
                console.log(data[key][key1])
                orderList.innerHTML +=
                    `<div class="card col-xl-3 col-md-6" id="$" style="width: 18rem;">   
                    <img class="card-img-top image-set" src="${data[key][key1].url}" alt="Card image cap">
                    <div class="card-body">
                    <h5 class="card-title">Product Name: ${data[key][key1].productName}</h5>
                    <p class="card-text">Price: ${data[key][key1].price}</p>
                    <p class="card-text">Product Category: ${data[key][key1].category}</p
                    <p class="card-text">Order Status: ${data[key][key1].orderStatus}</p>
                    <button onclick="status('accept','${data[key][key1].orderKey}','${data[key][key1].id}')"> Accept</button>
                    <button onclick="status('reject','${data[key][key1].orderKey}','${data[key][key1].id}')">Reject</button>
                    <button onclick="status('Pending','${data[key][key1].orderKey}','${data[key][key1].id}')">Pending</button>
                    <button onclick="status('Deliverd','${data[key][key1].orderKey}','${data[key][key1].id}')">Deliverd</button>
                    </div>`
            }
        }
    })
}

let status = (orderStatus, orderKey, customerUid) => {
    firebase.database().ref(`users/${uid}/orders/${customerUid}/${orderKey}`).update({
        orderStatus: orderStatus
    })
}

let uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
        let storageRef = firebase.storage().ref(`myfolder/todayImages/${file.name}`);
        let uploading = storageRef.put(file)
        uploading.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                uploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                    console.log('Upload is completed');
                });
            }
        );
    })
}