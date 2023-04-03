const formSignUp = document.forms.signUp;
const showPasswordButtons = document.querySelectorAll(".form__eye-button");
const dateInput = document.querySelector('input[type="date"]');
const today = `${new Date().getFullYear()}-${String(
  new Date().getMonth() + 1
).padStart(2, 0)}-${String(new Date().getDate()).padStart(2, 0)}`;

dateInput.setAttribute("max", today);

const show_hide_password = (e) => {
  const button = e.currentTarget;
  const passwordField = button.parentElement.querySelector(".form__input");
  const yeyClosed = button.querySelector(".form__eye--closed");
  const yeyOpen = button.querySelector(".form__eye--open");

  if (passwordField.getAttribute("type") === "password") {
    yeyClosed.classList.toggle("hidden");
    yeyOpen.classList.toggle("hidden");
    passwordField.setAttribute("type", "text");
  } else {
    yeyOpen.classList.toggle("hidden");
    yeyClosed.classList.toggle("hidden");
    passwordField.setAttribute("type", "password");
  }
};

for (button of showPasswordButtons) {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    show_hide_password(e);
  });
}

const clearError = (element) => {
  const inputBox = element.parentElement;
  const errorDisplay = inputBox.querySelector(".error");
  const input = inputBox.querySelector("input");

  errorDisplay.innerText = "";
  input.classList.remove("form__input--invalid");
};

const setError = (element, message) => {
  const inputBox = element.parentElement;
  const errorDisplay = inputBox.querySelector(".error");
  const input = inputBox.querySelector("input");

  errorDisplay.innerText = message;
  input.classList.add("form__input--invalid");
};

const validateInput = (element) => {
  const value = element.value;
  const passwordValue = formSignUp.elements.password.value;
  const emailRegExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const passwordRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}/;

  if (value === "") {
    setError(element, "Field is required");
    return;
  }

  if (element.name === "userName" || element.name === "userLastName") {
    if (value.length < 2) {
      setError(element, "Name is too short");
    } else if (value.length > 25) {
      setError(element, "Enter less than 25 characters");
    }
  }

  if (element.name === "email") {
    if (!emailRegExp.test(value)) {
      setError(element, "Enter correct email");
    }
  }

  if (element.name === "password") {
    if (value.length < 8) {
      setError(element, "Password must contain at least 8 characters");
    } else if (!passwordRegExp.test(value)) {
      setError(element, "Use number, uppercase and special symbol");
    }
  }

  if (element.name === "passwordСonfirmation") {
    if (value !== passwordValue) {
      setError(element, "Passwords don't match");
    }
  }

  if (element.name === "userBirthDate") {
    if (new Date(value) > new Date(today)) {
      setError(element, "Are you sure of your date of birth?");
      element.value = "";
    }
  }
};

for (field of formSignUp) {
  if (field.type !== "submit") {
    const formElement = formSignUp.elements[field.name];

    formElement.addEventListener("blur", () => validateInput(formElement));

    formElement.addEventListener("focus", () => {
      clearError(formElement);
    });
  }
}

formSignUp.addEventListener("submit", (e) => {
  e.preventDefault();

  for (field of formSignUp) {
    if (field.type !== "submit") {
      const formElement = formSignUp.elements[field.name];
      validateInput(formElement);
    }
  }

  let isValidForm = true;
  const validationsErrors = document.getElementsByClassName("error");
  for (let error of validationsErrors) {
    console.log(error);
    if (error.innerText !== "") isValidForm = false;
  }

  const values = {};

  for (let field of formSignUp) {
    const { name } = field;
    if (name) {
      const { value } = field;
      values[name] = value;
    }
  }

  if (isValidForm) {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const successMessage = document.querySelector(".success");
        successMessage.classList.toggle("hidden");

        setTimeout(() => {
          successMessage.classList.toggle("hidden");
        }, 3000);

        e.target.reset();
        console.log(json);
      });
  }
});
