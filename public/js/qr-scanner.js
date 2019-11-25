const { liff } = window;

function successCallback() {
  liff.scanCode().then(result => {
    window.location.assign(result.value);
  });
}

liff.init({ liffId: '1653520229-bK1o00od' }, successCallback);
