window.openModal = function() {
  var modal = document.getElementById('modal');
  modal.classList.add('is-active');
  modal.querySelector('.modal-background').addEventListener('click', e => {
    e.preventDefault();
    modal.classList.remove('is-active');
  });
};

window.populateModal = function(data) {
  modalData = '';
  modalContent = document.getElementById('recordBody');
  for (let i = 0; i < data.length; i++) {
    var date = new Date(data[i].timeStamp);
    modalData += '<div class="receipt-modal-body">';
    modalData += '<p>Services Performed:</p>';
    for (let x = 0; x < data[i].services.length; x++) {
      modalData += `<p class="serviceDisplay">${data[i].services[x]}:</p>`;
      modalData += `<p class="subserviceDisplay">${data[i].subservices[x]}</p>`;
    }
    modalData += `<p class="comment">Comment: ${data[i].comment}</p>`;
    modalData += `<p class="timestampLabel">Time: ${date.toString()}</p>`;
    modalData += '</div>';
  }
  modalContent.innerHTML = modalData;
};

document.querySelector('.delete').addEventListener('click', e => {
  e.preventDefault();
  modal.classList.remove('is-active');
});
