window.onload = function() {
    const defaultLiffId = "1655453347-xyprGnKm";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";

    myLiffId = defaultLiffId;
    initializeLiff(myLiffId);
};

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
        });
}
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    registerButtonHandlers();
    //cek apakah aplikasi dibuka di browser line
    if(liff.isInClient()){
        addProfile();
        document.getElementById('liffLogoutButton').setAttribute('hidden', '');
    //cek apakah aplikasi dibuka di external browser dan status login 
    } else if(liff.isLoggedIn()){
        addProfile();
        document.getElementById('openWindowButton').setAttribute('hidden', '');
        document.getElementById('closeAppButton').setAttribute('hidden', '');
    } else {
        lineProfile.innerHTML = '';
        document.getElementById('loginPage').innerHTML = /*html*/`
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center p-2">
                <h1 class="display-4">Raosh ! Drink&Meal</h1>
                <p class="lead">Pesan Makananmu Sekarang Juga !</p>
                <button class="btn btn-success" id="liffLoginButton">Login Untuk Memesan</button>
            </div>
        </div>`;
        document.getElementById('openWindowButton').setAttribute('hidden', '');
        document.getElementById('sendMessageButton').addEventListener('click', alert('Kamu belum login'));
    }
    console.log("Client : " + liff.isInClient());
    console.log("Login : " + liff.isLoggedIn());
}

function addProfile(){
    liff.getProfile()
    .then(profile => {
      const nama = profile.displayName;
      const picture = profile.pictureUrl;
      const lineProfile = document.getElementById('profile');
      lineProfile.innerHTML = `<img src="${picture}" alt="Foto Profil Line" class="w-50">
                               <p>Selamat Datang <b>${nama}</b>, yuk pesan menunya sekarang!</>`;
      })
    .catch((err) => {
      console.log('error', err);
    });
}

function getPesanan(){
    let daftar = "";
    for (let i = 0; i < arrayPesanan.length; i++) {
        daftar = daftar + `${arrayPesanan[i].jumlah} ${arrayPesanan[i].nama} \n`;
    };
}

function registerButtonHandlers() {
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: baseURL,
            external: true
        });
    });

    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
            window.location.reload();
        };
    });

    document.getElementById('closeAppButton').addEventListener('click', function() {
        liff.closeWindow();
    });

    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
            liff.closeWindow();
        };
    });

    document.getElementById('sendMessageButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            alert('Silakan buka aplikasi dari line');
        } else {
            getPesanan();
            let totalHarga = hitungTotal();
            liff.sendMessages([{
                'type': 'text',
                'text': `Halo ${nama} ! 
                        \n \n
                        Pesanan Anda : 
                        \n
                        *${daftar}* \n
                        Total : ${totalHarga} \n
                        Terima kasih sudah memesan. Pesanan akan disiapkan segera`
            }]).then(function() {
                liff.closeWindow();
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });
}


