const uid = localStorage.getItem('uid');

if (uid) {
    alert('you already login')
    window.location = 'index.html';
}

const login = () => {

    var email = document.getElementById('email')
    var password = document.getElementById('password')

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            let user = userCredential.user;

            firebase.database().ref(`users`).once(`value`).then((res) => {
                let role = res.val()[user.uid].userRole;
                localStorage.setItem('uid', user.uid);
                localStorage.setItem('role', role);
                if (role === 'admin') {
                    window.location.href = './Dashboard/index.html'
                }

                else if (role === 'local-user') {
                    localStorage.setItem('uid', user.uid)
                    window.location.href = 'index.html'
                }
            })
        })
        .catch((error) => {
            var errorMessage = error.message;
            console.log(errorMessage)
            alert('Email or Password Incorect')
        });
}

let register = async () => {

    let email = document.getElementById('email')
    let password = document.getElementById('password')
    let role = document.querySelector('input[name="role"]:checked');
    let userName = document.getElementById('userName');
    let phone = document.getElementById('phone');
    let city = document.getElementById('city');
    let country = document.getElementById('country');
    let address = document.getElementById('address');
    let profile = document.getElementById('profile');
    let profileUrl = await uploadFiles(profile.files[0]);

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`signUp`, user.uid)
            firebase.database().ref(`users/${user.uid}`).set(
                {
                    userEmail: email.value,
                    userRole: role.value,
                    id: user.uid,
                    userName: userName.value,
                    phone: phone.value,
                    city: city.value,
                    country: country.value,
                    address: address.value,
                    profilePic: profileUrl
                }
            ).then(() => {

                localStorage.setItem('uid', user.uid)
                localStorage.setItem('role', role.value)
                if (role.value === 'admin') {
                    window.location.href = './Dashboard/index.html'
                }
                else if (role.value === 'local-user') {
                    window.location = 'index.html'
                }
                else {
                    alert('error occured')
                }
            })
        })
        .catch((error) => {
            let errorMessage = error.message;
            console.log(errorMessage)
            alert(errorMessage)
        });
}

let change = (e) => {
    console.log(e.value)

    if (e.value === 'Customer') {
        window.location = 'CustomerSignup.html'
    }
    
    else if (e.value === 'Restaurent') {
        window.location = 'signup.html'
    }
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