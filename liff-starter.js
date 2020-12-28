window.onload = function() {
    const defaultLiffId = "1655453347-xyprGnKm";   // change the default LIFF value if you are not using a node server
    
    // DO NOT CHANGE THIS
    let myLiffId = "";
    let daftar = '';

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
};
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    //cek apakah aplikasi dibuka di browser line
    const lineProfile = document.getElementById('profile');
    if(liff.isInClient()){
        addProfile();
        document.getElementById('liffLogoutButton').setAttribute('hidden', '');
    //cek apakah aplikasi dibuka di external browser dan status login 
    } else if(liff.isLoggedIn()){
        addProfile();
        document.getElementById('openWindowButton').setAttribute('hidden', '');
        document.getElementById('liffLogoutButton').removeAttribute('hidden');
    } else {
    //kondisi ketika aplikasi dibuka di external browser dan status belum login
        document.getElementById('app').innerHTML = '';
        //Menambahkan loginPage di awal halaman jika belum login
        document.getElementById('loginPage').innerHTML = /*html*/`
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center p-2">
                <h1 class="display-4">Raosh ! Drink&Meal</h1>
                <p class="lead">Pesan Makananmu Sekarang Juga !</p>
                <button class="btn btn-success" id="liffLoginButton">Login Untuk Memesan</button>
            </div>
        </div>`;
        document.getElementById('openWindowButton').setAttribute('hidden', '');
        document.getElementById('liffLogoutButton').setAttribute('hidden', '');
        document.getElementById('sendMessageButton').setAttribute('hidden', '');
    };
    registerButtonHandlers();
    console.log("Client : " + liff.isInClient());
    console.log("Login : " + liff.isLoggedIn());
};

function addProfile(){
    //mendapatkan profil pengguna
    const lineProfile = document.getElementById('profile');
    liff.getProfile()
    .then(profile => {
      const nama = profile.displayName;
      const picture = profile.pictureUrl;
      lineProfile.innerHTML = `<img src="${picture}" alt="Foto Profil Line" class="w-50 rounded-circle d-block mx-auto my-2">
                               <p class="text-center">Selamat Datang <b>${nama}</b>, yuk pesan menunya sekarang!</>`;
      })
    .catch((err) => {
      console.log('error', err);
    });
};

function getPesanan(){
    for (let i = 0; i < arrayPesanan.length; i++) {
        daftar = daftar + `${arrayPesanan[i].jumlah} ${arrayPesanan[i].nama} \n`;
    };
    return daftar;
};

function registerButtonHandlers() {
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: baseURL,
            external: true
        });
    });

    if (!liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').addEventListener('click', function() {
            liff.login();
        });
    };

    document.getElementById('closeAppButton').addEventListener('click', function() {
        liff.closeWindow();
    });

    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        };
    });

    document.getElementById('sendMessageButton').addEventListener('click', function() {
        let totalHarga = hitungTotal();
        daftar = getPesanan();
        if (!liff.isInClient()) {
            alert(`Pesanan Kamu :\n${daftar}\nTotal Rp. ${totalHarga}\nSilakan pesan melalui aplikasi LINE`);
        } else {
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
};


