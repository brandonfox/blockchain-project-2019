// initilise the liff id first
async function successCallback() {
  try {
    const profile = await liff.getProfile();
    document.getElementById('result').innerText = JSON.stringify(profile);
  } catch (err) {
    console.error('err', err);
  }
}

// liffID of the dealer registration
liff.init({ liffId: '1653520229-EMmQJJQe' }, successCallback);
