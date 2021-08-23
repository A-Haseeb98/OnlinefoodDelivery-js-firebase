let registerRestaurent = async () => {
    let restaurantName = document.getElementById('restaurantName');
    let province = document.getElementById('country');
    let district = document.getElementById('city');
    let profile = document.getElementById('profile');
    let cover = document.getElementById('cover');
    let profileUrl = await uploadFiles(profile.files[0]);
    let coverUrl = await uploadFiles(cover.files[0]);

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            console.log(uid)
            firebase.database().ref(`users/${uid}/RestaurentData`).set(
                {
                    id: uid,
                    RestaurentName: restaurantName.value,
                    province: province.value,
                    district: district.value,
                    address: address.value,
                    profilePic: profileUrl,
                    coverPic: coverUrl
                })
                .then(() => {
                    console.log('done')
                })
        } else {
            console.log('not login logout')
        }
    });
}

let createProduct = async () => {
    let pName = document.getElementById('pName')
    let pCategory = document.getElementById('pCategory')
    let pPrice = document.getElementById('pPrice')
    let pDescription = document.getElementById('pDescription')
    let pDelivery = document.getElementById('pDelivery')
    let pImage = document.getElementById('pImage')
    let pImageUrl = await uploadFiles(pImage.files[0])
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            console.log(uid)
            let uid2 = firebase.database().ref().push().getKey()
            console.log(uid2)
            firebase.database().ref(`users/${uid}/products/${pCategory.value}/${uid2}}`).set(
                {
                    pId: uid2,
                    pName: pName.value,
                    pCategory: pCategory.value,
                    pPrice: pPrice.value,
                    pDescription: pDescription.value,
                    pDelivery: pDelivery.value,
                    pImage: pImageUrl
                })
                .then(() => {
                    console.log('done')
                })

        } else {

            console.log('not login logout')
        }
    });

}

let logout = () => {
    firebase.auth().signOut().then(() => {
        console.log('logout done')
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

let getOrders = () => {
    let orderList = document.getElementById('orderList')
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            firebase.database().ref(`users/${user.uid}/orders`).on('value', (res) => {
                console.log(res.val())
                let data = res.val()
                orderList.innerHTML = ''
                for (let key in data) {
                    console.log(data[key])
                    for (let key1 in data[key]) {
                        console.log(data[key][key1])
                        orderList.innerHTML += ` <div class="card col-xl-3 col-md-6" id="$" style="width: 18rem;">
                    
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

        } else {
            // User is signed out
            console.log(`You Are Not Login`)
            // ...
        }
    });
}

let status = (orderStatus, orderKey, customerId) => {
    console.log(orderStatus)
    console.log(customerId)



    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            firebase.database().ref(`users/${user.uid}/orders/${customerId}/${orderKey}`).update({
                orderStatus: orderStatus
            })

        } else {
            // User is signed out
            console.log(`bye`)
            // ...
        }
    });


}