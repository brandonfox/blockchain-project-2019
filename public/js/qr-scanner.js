const { liff } = window;

function successCallback() {
  liff.scanCode().then(result => {
    window.location.href = result.value;
  });
}

liff.init({ liffId: '1653518966-5BAvg8ZX' }, successCallback);
