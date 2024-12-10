const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const modals = document.querySelectorAll(".modal");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileNewButton = document.querySelector(".profile__new-button");
const addModal = document.querySelector("#add-modal");
const popupModal = document.querySelector("#popup-modal");
const closeButtons = document.querySelectorAll(".modal__close-button");
const popupModalImage = popupModal.querySelector(".modal__image");
const popupModalCaption = popupModal.querySelector(".modal__caption");
const editModal = document.querySelector("#edit-modal");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const modalNameInput = editModal.querySelector("#profile-name-input");
const modalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editFormElement = document.forms["edit-profile"];
const addFormElement = document.forms["new-post"];
const addLinkInput = addModal.querySelector("#add-image-link-input");
const addCaptionInput = addModal.querySelector("#add-caption-input");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const addModalSubmitButton = addModal.querySelector(".modal__submit-button");
const editModalSubmitButton = editModal.querySelector(".modal__submit-button");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardLinkElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardLinkElement.src = data.link;
  cardLinkElement.alt = data.name + " image";

  cardLinkElement.addEventListener("click", () => {
    popupModalImage.src = data.link;
    popupModalImage.alt = data.name + " image";
    popupModalCaption.textContent = data.name;

    popupModalImage.onload = function () {
      popupModalImage.classList.remove(
        "modal__image_type_landscape",
        "modal__image_type_portrait"
      );

      if (this.width > this.height) {
        popupModalImage.classList.add("modal__image_type_landscape");
      } else {
        popupModalImage.classList.add("modal__image_type_portrait");
      }
    };

    openModal(popupModal);
  });

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

function handleEditProfileFormSubmit(evt) {
  profileName.textContent = modalNameInput.value;
  profileDescription.textContent = modalDescriptionInput.value;
  disableButton(editModalSubmitButton, settings);
  closeModal(editModal);
}

function handleAddProfileFormSubmit(evt) {
  const inputValues = { name: addCaptionInput.value, link: addLinkInput.value };
  renderCard(inputValues);

  evt.target.reset();
  disableButton(addModalSubmitButton, settings);
  closeModal(addModal);
}

function fillProfileForm() {
  modalNameInput.value = profileName.textContent;
  modalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editModal, [modalNameInput, modalDescriptionInput], settings);
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", escapeModal);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", escapeModal);
}

profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  openModal(editModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => {
    closeModal(popup);
  });
});

function escapeModal(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    closeModal(activeModal);
  }
}

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (!evt.target.closest(".modal__container")) {
      closeModal(modal);
    }
  });
});

editFormElement.addEventListener("submit", handleEditProfileFormSubmit);

addFormElement.addEventListener("submit", handleAddProfileFormSubmit);

profileNewButton.addEventListener("click", () => {
  openModal(addModal);
});

function renderCard(card, method = "prepend") {
  const cardElement = getCardElement(card);
  cardsList[method](cardElement);
}

initialCards.forEach((card) => {
  renderCard(card);
});
