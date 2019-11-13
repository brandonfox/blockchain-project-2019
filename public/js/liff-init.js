const App = {
  initialiseLiff: liffID => {
    return liff.init({ liffId: liffID });
  },

  getProfile: () => {
    liff.getProfile().then(profile => {
      generateBarCode(
        'https://user-oranoss-chjtic.firebaseapp.com/receipt.html?userId=' +
          profile.userId
      );
      $('#profile').text(profile.displayName);
    });
  }
};

App.initialiseLiff('1653518966-zg6XY7LD').then(() => {
  $('#demo').text("It's ready");
  App.getProfile();
});
