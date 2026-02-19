'use strict';


// ================================
// Firebase init (Auth + Firestore) - compat SDK
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyAQlLh2Abk92sZVCSsYSCxvps4Uld3C1Lk",
  authDomain: "bibonrat.firebaseapp.com",
  databaseURL: "https://bibonrat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bibonrat",
  storageBucket: "bibonrat.firebasestorage.app",
  messagingSenderId: "78759159251",
  appId: "1:78759159251:web:3e40d7d5a2aa762f01bb26"
};

if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = (typeof firebase !== "undefined") ? firebase.auth() : null;
const db = (typeof firebase !== "undefined") ? firebase.firestore() : null;




// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}


// ================================
// Admin login (Firebase Auth) + Links page
// ================================
// Если хочешь ограничить доступ только определённым email, добавь их сюда:
// пример: const ADMIN_EMAILS = ["admin@site.kz"];
const ADMIN_EMAILS = [];

let isAdminState = false;
let currentUser = null;

const adminNavItem = document.getElementById("adminNavItem");
const adminLoginBtn = document.getElementById("adminLoginBtn");

const adminModal = document.getElementById("adminModal");
const adminModalOverlay = document.getElementById("adminModalOverlay");
const adminModalClose = document.getElementById("adminModalClose");

const adminDoLoginBtn = document.getElementById("adminDoLoginBtn");
const adminLoginInput = document.getElementById("adminLoginInput");
const adminPassInput = document.getElementById("adminPassInput");
const adminLoginError = document.getElementById("adminLoginError");

const adminLogoutBtn = document.getElementById("adminLogoutBtn");

const copyToast = document.getElementById("copyToast");

let toastTimer = null;
const showToast = (msg) => {
  if (!copyToast) return;
  copyToast.textContent = msg;
  copyToast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => copyToast.classList.remove("show"), 1600);
};

const openAdminModal = () => {
  if (!adminModal) return;
  if (adminLoginError) adminLoginError.textContent = "";
  adminModal.classList.add("active");
  adminModal.setAttribute("aria-hidden", "false");
  setTimeout(() => adminLoginInput && adminLoginInput.focus(), 0);
};

const closeAdminModal = () => {
  if (!adminModal) return;
  adminModal.classList.remove("active");
  adminModal.setAttribute("aria-hidden", "true");
};

const isAllowedAdmin = (user) => {
  if (!user) return false;
  if (!Array.isArray(ADMIN_EMAILS) || ADMIN_EMAILS.length === 0) return true;
  return ADMIN_EMAILS.includes(String(user.email || "").toLowerCase());
};

const setAdminUIFromUser = (user) => {
  currentUser = user || null;
  const signedIn = !!currentUser;
  const isAdmin = isAllowedAdmin(currentUser);
  isAdminState = isAdmin;

  if (adminNavItem) adminNavItem.style.display = isAdmin ? "" : "none";
  if (adminLogoutBtn) adminLogoutBtn.style.display = signedIn ? "flex" : "none";

  if (adminLoginBtn) {
    adminLoginBtn.textContent = signedIn ? "Logout" : "Admin";
  }
};

const logoutAdmin = async () => {
  try {
    if (auth) await auth.signOut();
  } catch (e) {
    console.error(e);
  }
  showToast("Вы вышли");
};

// Copy helper (secure-context + fallback)
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* ignore */ }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
};

// Attach copy handlers
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.getAttribute("data-copy") || "";
    const ok = await copyToClipboard(text);
    showToast(ok ? "Скопировано" : "Не получилось скопировать");
  });
});

const tryAdminLogin = async () => {
  const email = (adminLoginInput && adminLoginInput.value || "").trim();
  const pass = (adminPassInput && adminPassInput.value || "").trim();

  if (!email || !pass) {
    if (adminLoginError) adminLoginError.textContent = "Введите email и пароль";
    return;
  }

  if (!auth) {
    if (adminLoginError) adminLoginError.textContent = "Firebase Auth не подключен";
    return;
  }

  if (adminDoLoginBtn) adminDoLoginBtn.setAttribute("disabled", "true");

  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    const user = cred && cred.user ? cred.user : null;

    if (!isAllowedAdmin(user)) {
      if (adminLoginError) adminLoginError.textContent = "Этот аккаунт не имеет доступа";
      await auth.signOut();
      return;
    }

    closeAdminModal();
    showToast("Admin OK");

    // auto open the Links page
    const adminNavLink = adminNavItem ? adminNavItem.querySelector("[data-nav-link]") : null;
    if (adminNavLink) adminNavLink.click();

  } catch (e) {
    console.error(e);
    const code = String(e && e.code || "");
    let msg = "Ошибка входа";
    if (code.includes("auth/wrong-password")) msg = "Неверный пароль";
    else if (code.includes("auth/user-not-found")) msg = "Пользователь не найден";
    else if (code.includes("auth/invalid-email")) msg = "Неверный email";
    else if (code.includes("auth/too-many-requests")) msg = "Слишком много попыток, попробуй позже";
    if (adminLoginError) adminLoginError.textContent = msg;
  } finally {
    if (adminDoLoginBtn) adminDoLoginBtn.removeAttribute("disabled");
  }
};

// Modal events
if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", () => {
    if (currentUser) logoutAdmin();
    else openAdminModal();
  });
}

if (adminModalOverlay) adminModalOverlay.addEventListener("click", closeAdminModal);
if (adminModalClose) adminModalClose.addEventListener("click", closeAdminModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAdminModal();
});

if (adminDoLoginBtn) adminDoLoginBtn.addEventListener("click", tryAdminLogin);

if (adminLoginInput) adminLoginInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryAdminLogin();
});

if (adminPassInput) adminPassInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryAdminLogin();
});

if (adminLogoutBtn) adminLogoutBtn.addEventListener("click", logoutAdmin);

// Restore session from Firebase Auth
if (auth) {
  auth.onAuthStateChanged((user) => {
    setAdminUIFromUser(user);
  });
} else {
  setAdminUIFromUser(null);
}

