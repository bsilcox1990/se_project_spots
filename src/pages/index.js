import {
  settings,
  disableButton,
  enableValidation,
  resetValidation,
} from "../scripts/validation.js";

import "./index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

/*
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
*/
//all modals
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal__close-button");

//profile stuff
const profileEditButton = document.querySelector(".profile__edit-button");
const profileNewButton = document.querySelector(".profile__new-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//avatar stuff
const profileAvatar = document.querySelector(".profile__avatar");
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarModal = document.querySelector("#edit-avatar");
const editAvatarForm = document.forms["edit-avatar"];
const editAvatarInput = editAvatarModal.querySelector("#avatar-link-input");
const editAvatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit-button"
);

//preview window modal
const popupModal = document.querySelector("#popup-modal");
const popupModalImage = popupModal.querySelector(".modal__image");
const popupModalCaption = popupModal.querySelector(".modal__caption");

//add new card stuff
const addModal = document.querySelector("#add-modal");
const addFormElement = document.forms["new-post"];
const addLinkInput = addModal.querySelector("#add-image-link-input");
const addCaptionInput = addModal.querySelector("#add-caption-input");
const addModalSubmitButton = addModal.querySelector(".modal__submit-button");

//edit profile stuff
const editModal = document.querySelector("#edit-modal");
const modalNameInput = editModal.querySelector("#profile-name-input");
const modalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editFormElement = document.forms["edit-profile"];
const editModalSubmitButton = editModal.querySelector(".modal__submit-button");

//card stuff
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//delete card stuff
const deleteModal = document.querySelector("#delete-modal");
const deleteModalSubmitButton = deleteModal.querySelector(
  ".modal__submit-button"
);
const deleteForm = document.forms["delete-card"];
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__submit-button_type_cancel"
);

let selectedCard, selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "688c9307-1ad5-4d00-8cf7-8ff6067c0470",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      renderCard(card, "append");
    });
    profileAvatar.src = user.avatar;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
  })
  .catch((err) => {
    console.error(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardLinkElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.toggle("card__like-button_liked");
  }

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

  cardLikeButton.addEventListener("click", (evt) => {
    handleLikeButton(evt, data._id);
  });

  cardDeleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data)
  );

  return cardElement;
}

editAvatarButton.addEventListener("click", () => {
  openModal(editAvatarModal);
});

editAvatarForm.addEventListener("submit", (evt) => handleAvatarSubmit(evt));

function handleAvatarSubmit(evt) {
  setButtonText(editAvatarSubmitButton, true);
  api
    .editAvatar(editAvatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      evt.target.reset();
      disableButton(editAvatarSubmitButton, settings);
      closeModal(editAvatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(editAvatarSubmitButton, false);
    });
}

function handleLikeButton(evt, id) {
  const isLiked = evt.isLiked;

  api
    .toggleLike(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit() {
  setButtonText(deleteModalSubmitButton, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(deleteModalSubmitButton, false, "Delete");
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleEditProfileFormSubmit() {
  setButtonText(editModalSubmitButton, true);
  api
    .editUserInfo({
      name: modalNameInput.value,
      about: modalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      disableButton(editModalSubmitButton, settings);
      closeModal(editModal);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      setButtonText(editModalSubmitButton, false);
    });
}

function handleAddProfileFormSubmit(evt) {
  const inputValues = { name: addCaptionInput.value, link: addLinkInput.value };
  setButtonText(addModalSubmitButton, true);
  api
    .addNewcard(inputValues)
    .then((data) => {
      renderCard(data);
      evt.target.reset();
      disableButton(addModalSubmitButton, settings);
      closeModal(addModal);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setButtonText(addModalSubmitButton, false);
    });
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

/*
initialCards.forEach((card) => {
  renderCard(card);
});
*/

enableValidation(settings);
