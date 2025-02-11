import {
  settings,
  disableButton,
  enableValidation,
  resetValidation,
} from "../scripts/validation.js";

import "./index.css";
import Api from "../utils/Api.js";

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
const profileAvatar = document.querySelector(".profile__avatar");

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
let selectedCard;
let selectedCardId;

//delete card stuff
const deleteModal = document.querySelector("#delete-modal");
const cancelDeleteButton = document.querySelector(
  ".modal__submit-button_type_cancel"
);
const deleteForm = document.forms["delete-card"];

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
      renderCard(card);
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

  cardDeleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data)
  );

  return cardElement;
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit() {
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);
cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleEditProfileFormSubmit() {
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
    .catch((err) => console.error(err));
}

function handleAddProfileFormSubmit(evt) {
  const inputValues = { name: addCaptionInput.value, link: addLinkInput.value };
  api
    .addNewcard(inputValues)
    .then(() => {
      renderCard(inputValues);
      evt.target.reset();
      disableButton(addModalSubmitButton, settings);
      closeModal(addModal);
    })
    .catch((err) => console.log(err));
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
