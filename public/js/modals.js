window.openModal = function() {
  var modal = document.getElementById('modal');
  modal.style.display = 'block';
};

window.populateModal = function(data) {
  modalData = '';
  modalContent = document.getElementById('recordBody');
  for (let i = 0; i < data.length; i++) {
    modalData += '<div>';
    modalData += '<div>Services Performed:</div>';
    for (let x = 0; x < data[i].services.length; x++) {
      modalData += `<div class="serviceDisplay">${data[i].services[x]}:</div>`;
      modalData += `<div class="subserviceDisplay">${data[i].subservices[x]}</div>`;
    }
    modalData += '<div class="seperator">---------------------</div>';
    modalData += `<div class="comment">${data[i].comment}</div>`;
    modalData += '<div class="timestampLabel">Time:</div>';
    modalData += `<div class="timestamp">${data[i].timeStamp}</div>`;
    modalData += '<div class="seperator">---------------------</div>';
    modalData += '<div class="seperator">---------------------</div>';
    modalData += '<div class="seperator">---------------------</div>';
    modalData += '</div>';
  }
  modalContent.innerHTML = modalData;
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
