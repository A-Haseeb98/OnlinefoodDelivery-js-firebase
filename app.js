const login = () => {
    var email = document.getElementById('email')
    var password = document.getElementById('password')

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            //    firebase.database().ref(`users/admin/${user.uid}`).once('value', (data) => {
            firebase.database().ref(`users`).once(`value`).then((res) => {
                let data = res.val();

                if (data[user.uid].UserRole === 'admin') {
                    window.location.href = './Dashboard/index.html'

                }
                else if (data[user.uid].UserRole === 'local-user') {
                    window.location.href = 'index.html'
                }
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            // ..
        });
}

const signup = () => {
    let fullName = document.getElementById('fullName')
    let email = document.getElementById('email')
    let password = document.getElementById('password')
    let role = document.querySelector('input[name="role"]:checked').value;

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log(`signUp`, user.uid)
            firebase.database().ref(`users/${user.uid}`).set(
                {
                    fullName: fullName.value,
                    UserEmail: email.value,
                    UserRole: role
                }
            ).then(() => {
                if (role === 'admin') {
                    window.location = 'registerAdmin.html'
                }
                else if (role === 'local-user') {
                    window.location = 'registerUser.html'
                }
                else {
                    alert('error occured')
                }
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
}


let comleteResRegistration = async () => {
    let userName = document.getElementById('userName');
    let phone = document.getElementById('phone');
    let city = document.getElementById('city');
    let country = document.getElementById('country');
    let address = document.getElementById('address');
    let profile = document.getElementById('profile');
    let profileUrl = await uploadFiles(profile.files[0]);

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            console.log(uid)
            firebase.database().ref(`users/${uid}/RestaurentData`).update(
                {
                    id: uid,
                    userName: userName.value,
                    phone: phone.value,
                    city: city.value,
                    country: country.value,
                    address: address.value,
                    profilePic: profileUrl
                })
                .then(() => {
                    console.log('done')
                    window.location.href = './Dashboard/index.html'
                })
        } else {
            console.log('not login logout')
        }
    });
}

let comleteUserRegistration = async () => {
    let userName = document.getElementById('userName');
    let phone = document.getElementById('phone');
    let city = document.getElementById('city');
    let country = document.getElementById('country');
    let address = document.getElementById('address');
    let profile = document.getElementById('profile');
    let profileUrl = await uploadFiles(profile.files[0]);

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            console.log(uid)
            firebase.database().ref(`users/${uid}`).update(
                {
                    id: uid,
                    userName: userName.value,
                    phone: phone.value,
                    city: city.value,
                    country: country.value,
                    address: address.value,
                    profilePic: profileUrl
                })
                .then(() => {
                    console.log('done')
                    window.location.href = 'index.html'
                })
        } else {
            console.log('not login logout')
        }
    });
}



let getData = () => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let div = document.getElementById('nav-right')
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            console.log(`hi`);
            div.innerHTML = ` <a onclick="logout()" class=" btn btn-light  mr-3  btn-lg  header-btn">logout</a> `
        } else {
            // User is signed out
            console.log(`bye`)
            // ...
        }
    });

    let main = document.getElementById('main')
    firebase.database().ref(`users`).once('child_added', (data) => {
        data = data.val().RestaurentData;
        console.log(data);
        main.innerHTML +=
            `<div class="card  col-sm-4" id="$" style="width: 18rem;">
        <img class="card-img-top image-set" src="${data.profilePic}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${data.userName},</h5>
        <p class="card-text">${data.city}, ${data.country}</p>
    <a href="home.html#${data.id}">Go To Products</a>
        
      `
    })
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

