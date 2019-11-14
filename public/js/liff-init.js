function successCallback() {
  liff.getProfile().then(profile => {
    const val =
      'https://user-oranoss-chjtic.firebaseapp.com/receipt.html?userId=' +
      profile.userId;
    generateQr(val);
  });
}

function generateQr(val) {
  const url =
    'https://api.qrserver.com/v1/create-qr-code/?data=' +
    val +
    '&amp;size=600x600';
  document.getElementById('barcode').setAttribute('src', url);
}

liff.init({ liffId: '1653518966-zg6XY7LD' }, successCallback);
