export function showModal({ title, description, closeCb, confirmCb }) {
  const modalContainer = document.querySelector(".modal-wrapper");

  modalContainer.innerHTML = `
  <div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
  <div class="modal__overlay" tabindex="-1">
    <div
      class="modal__container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-1-title"
    >
      <header class="modal__header">
        <h2 class="modal__title" id="modal-1-title">${title}</h2>
        <button
          class="modal__close"
          aria-label="Close modal"
          data-micromodal-close
        ></button>
      </header>
      <main class="modal__content" id="modal-1-content">
      <ul class="result-list">
      
      </ul>
      <div id="loading">
      <div class="spinner"></div>
      </div>
      </main>
      <footer class="modal__footer">
        <button class="modal__btn modal__btn-primary confirm__btn">Confirm</button>
        <button
          class="modal__btn"
          data-micromodal-close
          aria-label="Close this dialog window"
        >
          Close
        </button>
      </footer>
    </div>
  </div>
</div>
  `;
  MicroModal.show("modal-1", {
    onClose: () => (closeCb ? closeCb() : null), // [2]
  });
  const confirmBtn = modalContainer.querySelector(".confirm__btn");
  confirmBtn.addEventListener("click", confirmCb);
}

export function getUserLocation() {
  return new Promise(function (resolve, reject) {
    window.flutter_inappwebview
      .callHandler("getLocation")
      .then((res) => {
        resolve(JSON.parse(res));
      })
      .catch((err) => {
        console.log("err", err);
        reject(null);
      });
  });
}

export function closeModal() {
  const modalContainer = document.querySelector(".modal-wrapper");
  modalContainer.innerHTML = "";
}

export function backKeyClicked() {
  console.log("heheheh");
  return "false";
}
