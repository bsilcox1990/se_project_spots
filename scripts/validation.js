const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  modalInputErrorClass: ".modal__input_type_error",
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = document.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add("modal__input_type_error");
  errorElement.textContent = errorMessage;
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = document.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove("modal__input_type_error");
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const setEventListeners = (formElement) => {
  const inputList = document.querySelectorAll(".modal__input");

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");

  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement);
  });
};

enableValidation();
