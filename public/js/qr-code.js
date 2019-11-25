const { liff } = window;

function generateQr(val) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?data=${val}&amp;size=600x600`;
  document.getElementById('barcode').setAttribute('src', url);
}

function successCallback() {
  liff.getProfile().then(profile => {
    const val = `https://liff.line.me/1653520229-vA50WW0A?userId=${profile.userId}`;
    generateQr(val);
  });
}

liff.init({ liffId: '1653518966-zg6XY7LD' }, successCallback);
