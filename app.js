const STORAGE_KEY = "familyDebtExpenseTracker.v1";
const AUTH_TOKEN_KEY = "familyDebtExpenseTracker.authToken";
const AUTH_USER_KEY = "familyDebtExpenseTracker.authUser";

const palette = [
  "#ffe66d",
  "#ff7675",
  "#74b9ff",
  "#55efc4",
  "#a29bfe",
  "#fdcb6e",
  "#fab1a0",
  "#81ecec",
  "#e84393",
  "#00b894"
];

const categoryDefaults = {
  Bills: ["bills", "#74b9ff"],
  Clothes: ["clothes", "#a29bfe"],
  Food: ["food", "#ff7675"],
  Travel: ["travel", "#55efc4"],
  "Online shopping": ["online", "#fd79a8"],
  Gadgets: ["gadget", "#81ecec"],
  Grocery: ["grocery", "#00b894"],
  Transportation: ["transport", "#fdcb6e"],
  Shopping: ["cart", "#fab1a0"],
  Grab: ["car", "#55efc4"],
  Medical: ["medical", "#ff7675"],
  School: ["school", "#74b9ff"],
  Gift: ["gift", "#ffe66d"]
};

const defaultState = {
  owners: [
    { id: "owner-parent-1", name: "Parent 1", icon: "crown", color: "#ffe66d" },
    { id: "owner-parent-2", name: "Parent 2", icon: "user", color: "#a29bfe" },
    { id: "owner-family", name: "Family", icon: "heart", color: "#55efc4" }
  ],
  wallets: [
    { id: "wallet-bdo", name: "BDO Credit Card", icon: "credit-card", color: "#74b9ff" },
    { id: "wallet-rcbc", name: "RCBC Credit Card", icon: "bank", color: "#fdcb6e" }
  ],
  currency: "PHP",
  categories: Object.entries(categoryDefaults).map(([name, [icon, color]]) => ({
    id: slugId("category", name),
    name,
    icon,
    color,
    isDefault: true
  })),
  budgets: [],
  expenses: []
};

const icons = {
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.2 2.2 0 0 1-3.11 3.11l-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.65V21.5a2.2 2.2 0 0 1-4.4 0v-.08a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-1.98.36l-.05.05a2.2 2.2 0 0 1-3.11-3.11l.05-.05A1.8 1.8 0 0 0 3.34 15a1.8 1.8 0 0 0-1.65-1.1H1.6a2.2 2.2 0 0 1 0-4.4h.08a1.8 1.8 0 0 0 1.65-1.1 1.8 1.8 0 0 0-.36-1.98l-.05-.05a2.2 2.2 0 0 1 3.11-3.11l.05.05a1.8 1.8 0 0 0 1.98.36 1.8 1.8 0 0 0 1.1-1.65V1.9a2.2 2.2 0 0 1 4.4 0v.08a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 1.98-.36l.05-.05a2.2 2.2 0 0 1 3.11 3.11l-.05.05a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.65 1.1h.08a2.2 2.2 0 0 1 0 4.4h-.08A1.8 1.8 0 0 0 19.4 15Z"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-7"/><path d="M15 7h4v4"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
  crown: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m3 8 4 3 5-7 5 7 4-3-2 11H5L3 8Z"/><path d="M5 19h14"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2Z"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M19 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"/><path d="M16 14h.01"/></svg>',
  "credit-card": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  bank: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m3 10 9-7 9 7"/><path d="M5 10h14v10H5z"/><path d="M8 14v3M12 14v3M16 14v3M3 20h18"/></svg>',
  cash: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  currency: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
  tags: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r=".5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  balance: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 3v18M5 6h14"/><path d="m6 6-3 7h6L6 6ZM18 6l-3 7h6l-3-7Z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  percent: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M19 5 5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><ellipse cx="8" cy="7" rx="5" ry="3"/><path d="M3 7v5c0 1.66 2.24 3 5 3s5-1.34 5-3V7"/><path d="M13 9.3c2.9.4 5 1.6 5 3.2 0 1.9-2.7 3.5-6 3.5-1 0-2-.15-2.8-.42"/><path d="M18 12.5v4c0 1.9-2.7 3.5-6 3.5-2.6 0-4.8-1-5.6-2.4"/></svg>',
  pie: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 12A9 9 0 1 1 12 3v9Z"/><path d="M12 3a9 9 0 0 1 9 9h-9Z"/></svg>',
  forecast: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/><path d="M3 21h18"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/><path d="M10 11v6M14 11v6"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>',
  budget: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M15 12h2M7 16h3M14 16h3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M20 16v4H4v-4"/></svg>',
  bills: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M7 3h10v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  clothes: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M8 4 4 7l3 4v9h10v-9l3-4-4-3a4 4 0 0 1-8 0Z"/></svg>',
  food: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M6 2v8M10 2v8M6 6h4M8 10v12"/><path d="M17 2v20M14 2h3a4 4 0 0 1 0 8h-3V2Z"/></svg>',
  travel: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 16 22 8l-9 14-2-7-7-2Z"/></svg>',
  online: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M8 10h8"/></svg>',
  gadget: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2M10 6h4"/></svg>',
  grocery: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M6 6h15l-2 8H8L6 3H3"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>',
  transport: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M6 17h12l1-5-2-5H7l-2 5 1 5Z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/><path d="M7 11h10"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M6 6h15l-2 8H8L6 3H3"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M5 16h14l-1-5-2-3H8l-2 3-1 5Z"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/></svg>',
  medical: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 3v18M3 12h18"/><rect x="4" y="4" width="16" height="16" rx="4"/></svg>',
  school: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m3 8 9-5 9 5-9 5-9-5Z"/><path d="M7 10v5c3 2 7 2 10 0v-5"/><path d="M21 8v7"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M12 8H8a2.5 2.5 0 1 1 2.5-2.5L12 8Zm0 0h4a2.5 2.5 0 1 0-2.5-2.5L12 8Z"/></svg>'
};

let state = loadState();
let editingExpenseId = null;
let uploadedCategoryIcon = "";
let uploadedOwnerIcon = "";
let uploadedWalletIcon = "";
let syncEnabled = false;
let authToken = localStorage.getItem(AUTH_TOKEN_KEY) || "";
let currentUser = localStorage.getItem(AUTH_USER_KEY) || "";
let authMode = "login";
let syncTimer = null;
let pushTimer = null;
const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  setDefaultDates();
  render();
  initSync();
});

function cacheElements() {
  Object.assign(els, {
    activeCurrency: document.querySelector("#activeCurrency"),
    syncStatus: document.querySelector("#syncStatus"),
    authScreen: document.querySelector("#authScreen"),
    authForm: document.querySelector("#authForm"),
    authTitle: document.querySelector("#authTitle"),
    authHelp: document.querySelector("#authHelp"),
    authUsername: document.querySelector("#authUsername"),
    authPassword: document.querySelector("#authPassword"),
    authSubmitButton: document.querySelector("#authSubmitButton"),
    authToggleButton: document.querySelector("#authToggleButton"),
    authError: document.querySelector("#authError"),
    tabButtons: document.querySelectorAll(".tab-button"),
    tabPanels: document.querySelectorAll(".tab-panel"),
    ownerForm: document.querySelector("#ownerForm"),
    ownerName: document.querySelector("#ownerName"),
    ownerIcon: document.querySelector("#ownerIcon"),
    ownerColor: document.querySelector("#ownerColor"),
    ownerIconUpload: document.querySelector("#ownerIconUpload"),
    ownerList: document.querySelector("#ownerList"),
    walletForm: document.querySelector("#walletForm"),
    walletName: document.querySelector("#walletName"),
    walletIcon: document.querySelector("#walletIcon"),
    walletColor: document.querySelector("#walletColor"),
    walletIconUpload: document.querySelector("#walletIconUpload"),
    walletList: document.querySelector("#walletList"),
    currencySelect: document.querySelector("#currencySelect"),
    categoryForm: document.querySelector("#categoryForm"),
    categoryName: document.querySelector("#categoryName"),
    categoryCustomIcon: document.querySelector("#categoryCustomIcon"),
    categoryIconUpload: document.querySelector("#categoryIconUpload"),
    categoryColor: document.querySelector("#categoryColor"),
    customCategoryList: document.querySelector("#customCategoryList"),
    defaultCategoryList: document.querySelector("#defaultCategoryList"),
    budgetForm: document.querySelector("#budgetForm"),
    budgetOwner: document.querySelector("#budgetOwner"),
    budgetMonth: document.querySelector("#budgetMonth"),
    budgetAmount: document.querySelector("#budgetAmount"),
    budgetList: document.querySelector("#budgetList"),
    accountForm: document.querySelector("#accountForm"),
    newAccountUsername: document.querySelector("#newAccountUsername"),
    newAccountPassword: document.querySelector("#newAccountPassword"),
    accountList: document.querySelector("#accountList"),
    expenseFormTitle: document.querySelector("#expenseFormTitle"),
    expenseForm: document.querySelector("#expenseForm"),
    expenseOwner: document.querySelector("#expenseOwner"),
    expenseOwnerPreview: document.querySelector("#expenseOwnerPreview"),
    expenseWallet: document.querySelector("#expenseWallet"),
    expenseWalletPreview: document.querySelector("#expenseWalletPreview"),
    quickWalletButton: document.querySelector("#quickWalletButton"),
    expenseDate: document.querySelector("#expenseDate"),
    expenseCategory: document.querySelector("#expenseCategory"),
    expenseCategoryPreview: document.querySelector("#expenseCategoryPreview"),
    expenseDescription: document.querySelector("#expenseDescription"),
    expenseAmount: document.querySelector("#expenseAmount"),
    isInstallment: document.querySelector("#isInstallment"),
    totalTenor: document.querySelector("#totalTenor"),
    installmentFields: document.querySelector("#installmentFields"),
    previewRemaining: document.querySelector("#previewRemaining"),
    previewTotal: document.querySelector("#previewTotal"),
    previewOutstanding: document.querySelector("#previewOutstanding"),
    expenseSubmitButton: document.querySelector("#expenseSubmitButton"),
    cancelEditButton: document.querySelector("#cancelEditButton"),
    activeExpenseOnly: document.querySelector("#activeExpenseOnly"),
    expenseTable: document.querySelector("#expenseTable"),
    filterMonth: document.querySelector("#filterMonth"),
    filterOwner: document.querySelector("#filterOwner"),
    filterWallet: document.querySelector("#filterWallet"),
    filterInstallment: document.querySelector("#filterInstallment"),
    summaryAvatar: document.querySelector("#summaryAvatar"),
    summaryTitle: document.querySelector("#summaryTitle"),
    metricOutstanding: document.querySelector("#metricOutstanding"),
    metricAverageTenor: document.querySelector("#metricAverageTenor"),
    metricPaidPercent: document.querySelector("#metricPaidPercent"),
    metricMonthly: document.querySelector("#metricMonthly"),
    metricMonthLabel: document.querySelector("#metricMonthLabel"),
    metricBudgetFill: document.querySelector("#metricBudgetFill"),
    metricBudgetPercent: document.querySelector("#metricBudgetPercent"),
    categoryBreakdown: document.querySelector("#categoryBreakdown"),
    forecastList: document.querySelector("#forecastList"),
    expenseTrendGraph: document.querySelector("#expenseTrendGraph")
  });
}

function bindEvents() {
  els.authForm.addEventListener("submit", handleAuthSubmit);
  els.authToggleButton.addEventListener("click", () => {
    authMode = authMode === "login" ? "setup" : "login";
    els.authError.textContent = "";
    updateAuthMode();
  });

  els.tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  els.ownerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addNamedItem(
      "owners",
      els.ownerName.value,
      uploadedOwnerIcon || els.ownerIcon.value,
      els.ownerColor.value,
      "owner"
    );
    uploadedOwnerIcon = "";
    els.ownerForm.reset();
  });

  els.walletForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addNamedItem(
      "wallets",
      els.walletName.value,
      uploadedWalletIcon || els.walletIcon.value,
      els.walletColor.value,
      "wallet"
    );
    uploadedWalletIcon = "";
    els.walletForm.reset();
  });

  bindIconUpload(els.ownerIconUpload, (value) => {
    uploadedOwnerIcon = value;
  });

  bindIconUpload(els.walletIconUpload, (value) => {
    uploadedWalletIcon = value;
  });

  els.categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = normalizeName(els.categoryName.value);
    if (!name) return;
    if (!state.categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      const customIcon = normalizeName(els.categoryCustomIcon.value);
      state.categories.push({
        id: slugId("category", name),
        name,
        icon: uploadedCategoryIcon || (customIcon ? `emoji:${customIcon}` : "tags"),
        color: els.categoryColor.value,
        isDefault: false
      });
      saveAndRender();
    }
    uploadedCategoryIcon = "";
    els.categoryForm.reset();
  });

  bindIconUpload(els.categoryIconUpload, (value) => {
    uploadedCategoryIcon = value;
    if (value) els.categoryCustomIcon.value = "";
  });

  els.budgetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const ownerId = els.budgetOwner.value;
    const month = els.budgetMonth.value;
    const amount = Number(els.budgetAmount.value) || 0;
    const existing = state.budgets.find((budget) => budget.ownerId === ownerId && budget.month === month);
    if (existing) {
      existing.amount = amount;
    } else {
      state.budgets.push({ id: uniqueId("budget"), ownerId, month, amount });
    }
    els.budgetAmount.value = "";
    saveAndRender();
  });

  els.accountForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!syncEnabled) {
      alert("Open the app from the shared server URL to add login accounts.");
      return;
    }
    try {
      await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify({
          username: normalizeName(els.newAccountUsername.value),
          password: els.newAccountPassword.value
        })
      });
      els.accountForm.reset();
      await renderAccounts();
    } catch (error) {
      alert(error.message || "Could not add account.");
    }
  });

  els.currencySelect.addEventListener("change", () => {
    state.currency = els.currencySelect.value;
    saveAndRender();
  });

  els.quickWalletButton.addEventListener("click", () => {
    const name = prompt("New wallet name");
    const normalized = normalizeName(name || "");
    if (!normalized) return;
    addNamedItem("wallets", normalized, "credit-card", "#74b9ff", "wallet");
    els.expenseWallet.value = state.wallets[state.wallets.length - 1].id;
  });

  els.isInstallment.addEventListener("change", () => {
    els.installmentFields.classList.toggle("visible", els.isInstallment.checked);
    els.totalTenor.required = els.isInstallment.checked;
    updateInstallmentPreview();
  });

  [els.expenseDate, els.expenseAmount, els.totalTenor].forEach((input) => {
    input.addEventListener("input", updateInstallmentPreview);
    input.addEventListener("change", updateInstallmentPreview);
  });

  [els.expenseOwner, els.expenseWallet, els.expenseCategory].forEach((select) => {
    select.addEventListener("change", updateExpenseSelectPreviews);
  });

  els.expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const installment = els.isInstallment.checked;
    const nextExpense = {
      id: editingExpenseId || uniqueId("expense"),
      ownerId: els.expenseOwner.value,
      walletId: els.expenseWallet.value,
      date: els.expenseDate.value,
      categoryId: els.expenseCategory.value,
      description: normalizeName(els.expenseDescription.value),
      installment,
      amount: Number(els.expenseAmount.value),
      totalTenor: installment ? Math.max(1, Number(els.totalTenor.value)) : 1
    };

    if (editingExpenseId) {
      state.expenses = state.expenses.map((expense) =>
        expense.id === editingExpenseId ? nextExpense : expense
      );
    } else {
      state.expenses.unshift(nextExpense);
    }

    resetExpenseForm();
    saveAndRender();
  });

  els.cancelEditButton.addEventListener("click", () => {
    resetExpenseForm();
    renderExpenseFormState();
  });

  els.expenseTable.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-expense]");
    if (editButton) {
      startEditingExpense(editButton.dataset.editExpense);
      return;
    }

    const deleteButton = event.target.closest("[data-delete-expense]");
    if (!deleteButton) return;
    if (editingExpenseId === deleteButton.dataset.deleteExpense) resetExpenseForm();
    state.expenses = state.expenses.filter((expense) => expense.id !== deleteButton.dataset.deleteExpense);
    saveAndRender();
  });

  els.activeExpenseOnly.addEventListener("change", renderExpenseTable);

  els.ownerList.addEventListener("click", handleChipDelete("owners", "owner"));
  els.walletList.addEventListener("click", handleChipDelete("wallets", "wallet"));
  els.customCategoryList.addEventListener("click", handleChipDelete("categories", "category"));
  els.defaultCategoryList.addEventListener("click", handleChipDelete("categories", "category"));
  els.budgetList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-budget]");
    if (!button) return;
    state.budgets = state.budgets.filter((budget) => budget.id !== button.dataset.deleteBudget);
    saveAndRender();
  });

  els.filterMonth.addEventListener("change", renderDashboard);
  els.filterOwner.addEventListener("change", renderDashboard);
  els.filterWallet.addEventListener("change", renderDashboard);
  els.filterInstallment.addEventListener("change", renderDashboard);
}

function render() {
  els.currencySelect.value = state.currency;
  els.activeCurrency.textContent = state.currency;
  renderSettings();
  renderExpenseFormOptions();
  renderExpenseTable();
  renderExpenseFormState();
  renderDashboard();
  updateInstallmentPreview();
  updateExpenseSelectPreviews();
  renderIcons();
}

function renderSettings() {
  renderTiles(els.ownerList, state.owners, "owner");
  renderTiles(els.walletList, state.wallets, "wallet");
  renderCategoryTiles();
  renderBudgetList();
  renderAccounts();
}

function renderCategoryTiles() {
  const defaults = state.categories.filter((category) => category.isDefault);
  const custom = state.categories.filter((category) => !category.isDefault);
  renderTiles(els.customCategoryList, custom, "category");
  renderTiles(els.defaultCategoryList, defaults, "category", { locked: true });
}

function renderBudgetList() {
  if (!state.budgets.length) {
    els.budgetList.innerHTML = '<p class="empty-state">No monthly budgets yet.</p>';
    return;
  }

  els.budgetList.innerHTML = [...state.budgets]
    .sort((a, b) => b.month.localeCompare(a.month))
    .map((budget) => {
      const owner = findById(state.owners, budget.ownerId);
      return `
        <div class="budget-row">
          ${iconBadge(owner?.icon || "user", owner?.color || palette[0])}
          <div>
            <strong>${escapeHtml(owner?.name || "Unknown")}</strong>
            <span>${formatMonth(budget.month)}</span>
          </div>
          <b>${formatCurrency(budget.amount)}</b>
          <button type="button" class="delete-button" title="Delete budget" data-delete-budget="${budget.id}">
            <span class="icon" data-icon="trash"></span>
          </button>
        </div>
      `;
    })
    .join("");
}

async function renderAccounts() {
  if (!syncEnabled) {
    els.accountList.innerHTML = '<p class="empty-state">Use the shared server URL to manage login accounts.</p>';
    return;
  }
  try {
    const result = await apiRequest("/api/users");
    els.accountList.innerHTML = result.users
      .map((user) => `
        <div class="budget-row">
          ${iconBadge("user", "#ffe66d")}
          <div>
            <strong>${escapeHtml(user.username)}</strong>
            <span>${user.username === currentUser ? "Current account" : "Family login"}</span>
          </div>
        </div>
      `)
      .join("");
    renderIcons();
  } catch {
    els.accountList.innerHTML = '<p class="empty-state">Accounts unavailable.</p>';
  }
}

function renderExpenseFormOptions() {
  fillSelect(els.expenseOwner, state.owners, "Add owner in Settings");
  fillSelect(els.expenseWallet, state.wallets, "Add wallet in Settings");
  fillSelect(els.expenseCategory, state.categories, "Add category in Settings");
  fillSelect(els.budgetOwner, state.owners, "Add owner in Settings");

  const ownerOptions = [{ id: "all", name: "All owners" }, ...state.owners];
  const walletOptions = [{ id: "all", name: "All wallets" }, ...state.wallets];
  fillSelect(els.filterOwner, ownerOptions);
  fillSelect(els.filterWallet, walletOptions);
}

function renderExpenseTable() {
  const visibleExpenses = els.activeExpenseOnly.checked
    ? state.expenses.filter((expense) => expense.installment && calculateExpense(expense).remaining > 0)
    : state.expenses;

  if (!visibleExpenses.length) {
    els.expenseTable.innerHTML = '<tr><td colspan="9" class="empty-state">No expenses yet.</td></tr>';
    return;
  }

  els.expenseTable.innerHTML = visibleExpenses
    .map((expense) => {
      const calc = calculateExpense(expense);
      const owner = findById(state.owners, expense.ownerId);
      const wallet = findById(state.wallets, expense.walletId);
      const category = findById(state.categories, expense.categoryId);
      return `
        <tr class="${editingExpenseId === expense.id ? "editing-row" : ""}">
          <td>${formatDate(expense.date)}</td>
          <td>${tileCell(owner, "user")}</td>
          <td>${tileCell(wallet, "wallet")}</td>
          <td>${tileCell(category, "tags")}</td>
          <td>${expense.description ? escapeHtml(expense.description) : '<span class="muted-cell">-</span>'}</td>
          <td>${formatCurrency(expense.amount)}</td>
          <td>${expense.installment ? `${calc.remaining} months` : '<span class="muted-cell">One-time</span>'}</td>
          <td>${expense.installment ? formatCurrency(calc.outstanding) : '<span class="muted-cell">-</span>'}</td>
          <td>
            <div class="row-actions">
              <button class="edit-button" type="button" title="Edit expense" data-edit-expense="${expense.id}">
                <span class="icon" data-icon="edit"></span>
              </button>
              <button class="delete-button" type="button" title="Delete expense" data-delete-expense="${expense.id}">
                <span class="icon" data-icon="trash"></span>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderExpenseFormState() {
  const editing = Boolean(editingExpenseId);
  els.expenseFormTitle.textContent = editing ? "Edit Expense" : "Add Expense";
  els.expenseSubmitButton.innerHTML = `<span class="icon" data-icon="save"></span>${editing ? "Update Expense" : "Save Expense"}`;
  els.cancelEditButton.hidden = !editing;
}

function renderDashboard() {
  const selectedMonth = els.filterMonth.value || monthISO(new Date());
  const selectedOwner = els.filterOwner.value || "all";
  const selectedWallet = els.filterWallet.value || "all";
  const selectedInstallment = els.filterInstallment.value || "installment";
  const selectedDate = monthStart(selectedMonth);
  const scoped = state.expenses.filter((expense) => {
    const ownerMatch = selectedOwner === "all" || expense.ownerId === selectedOwner;
    const walletMatch = selectedWallet === "all" || expense.walletId === selectedWallet;
    const installmentMatch =
      selectedInstallment === "all" ||
      (selectedInstallment === "installment" && expense.installment) ||
      (selectedInstallment === "one-time" && !expense.installment);
    if (!ownerMatch || !walletMatch || !installmentMatch) return false;
    if (!expense.installment) return isSameMonth(expense.date, selectedDate);
    return isInstallmentActiveInMonth(expense, selectedDate);
  });

  const rows = scoped.map((expense) => ({ expense, calc: calculateExpense(expense, selectedDate) }));
  const totalOutstanding = rows.reduce((sum, row) => sum + row.calc.outstanding, 0);
  const totalAmount = rows.reduce((sum, row) => sum + row.calc.total, 0);
  const totalRemaining = rows.reduce((sum, row) => sum + row.calc.remaining, 0);
  const installmentRows = rows.filter((row) => row.expense.installment);
  const totalMonthly = rows.reduce((sum, row) => sum + row.expense.amount, 0);
  const averageTenor = installmentRows.length ? totalRemaining / installmentRows.length : 0;
  const paidPercent = totalAmount ? ((totalAmount - totalOutstanding) / totalAmount) * 100 : 0;
  const budget = getBudgetTotal(selectedOwner, selectedMonth);
  const budgetPercent = budget ? (totalMonthly / budget) * 100 : 0;
  const owner = selectedOwner === "all" ? null : findById(state.owners, selectedOwner);

  els.summaryTitle.textContent = `Summary for ${owner ? owner.name : "All Owners"}:`;
  els.summaryAvatar.innerHTML = iconBadge(owner?.icon || "users", owner?.color || "#ffe66d", "summary-avatar-badge");
  els.metricOutstanding.textContent = formatCurrency(totalOutstanding);
  els.metricAverageTenor.textContent = `${formatNumber(averageTenor, 1)} average tenor`;
  els.metricPaidPercent.textContent = `${formatNumber(paidPercent, 0)}% paid`;
  els.metricMonthly.textContent = formatCurrency(totalMonthly);
  els.metricMonthLabel.textContent = `As of ${formatMonth(selectedMonth)}`;
  els.metricBudgetPercent.textContent = budget ? `${formatNumber(budgetPercent, 0)}%` : "No budget";
  els.metricBudgetFill.style.width = `${Math.min(100, Math.max(0, budgetPercent))}%`;

  renderCategoryBreakdown(rows, totalOutstanding);
  renderForecast(selectedMonth, selectedOwner, selectedWallet, selectedInstallment);
  renderExpenseTrend(selectedMonth, selectedOwner, selectedWallet, selectedInstallment);
  renderIcons();
}

function renderCategoryBreakdown(rows, totalOutstanding) {
  if (!rows.length) {
    els.categoryBreakdown.innerHTML = '<p class="empty-state">No active installment balances for this filter.</p>';
    return;
  }

  const totals = new Map();
  rows.forEach(({ expense, calc }) => {
    const category = findById(state.categories, expense.categoryId);
    const key = category?.id || "unknown";
    const current = totals.get(key) || { category, amount: 0 };
    current.amount += calc.outstanding;
    totals.set(key, current);
  });

  els.categoryBreakdown.innerHTML = [...totals.values()]
    .sort((a, b) => b.amount - a.amount)
    .map(({ category, amount }) => {
      const percent = totalOutstanding ? (amount / totalOutstanding) * 100 : 0;
      return `
        <div class="breakdown-row">
          <div class="row-top">
            <span class="named-icon">${iconBadge(category?.icon || "tags", category?.color || palette[1])}${escapeHtml(category?.name || "Uncategorized")}</span>
            <span>${formatCurrency(amount)}</span>
          </div>
          <div class="progress" aria-hidden="true"><span style="width:${Math.max(4, percent)}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function renderForecast(startMonth, ownerId, walletId, installmentFilter) {
  const start = monthStart(startMonth || monthISO(new Date()));
  const months = Array.from({ length: 6 }, (_, index) => addMonths(start, index));
  const maxMonthly = Math.max(
    1,
    ...months.map((month) => forecastMonthlyTotal(month, ownerId, walletId, installmentFilter))
  );

  els.forecastList.innerHTML = months
    .map((month) => {
      const total = forecastMonthlyTotal(month, ownerId, walletId, installmentFilter);
      const width = (total / maxMonthly) * 100;
      return `
        <div class="forecast-row">
          <div class="forecast-month">${month.toLocaleDateString(undefined, { month: "short", year: "numeric" })}</div>
          <div class="progress" aria-hidden="true"><span style="width:${Math.max(3, width)}%"></span></div>
          <div class="forecast-amount">${formatCurrency(total)}</div>
        </div>
      `;
    })
    .join("");
}

function forecastMonthlyTotal(monthDate, ownerId, walletId, installmentFilter) {
  return state.expenses
    .filter((expense) => {
      if (ownerId !== "all" && expense.ownerId !== ownerId) return false;
      if (walletId !== "all" && expense.walletId !== walletId) return false;
      if (installmentFilter === "one-time") return !expense.installment && isSameMonth(expense.date, monthDate);
      if (installmentFilter === "all" && !expense.installment) return isSameMonth(expense.date, monthDate);
      if (!expense.installment) return false;
      return isInstallmentActiveInMonth(expense, monthDate);
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
}

function renderExpenseTrend(startMonth, ownerId, walletId, installmentFilter) {
  const end = monthStart(startMonth || monthISO(new Date()));
  const months = Array.from({ length: 6 }, (_, index) => addMonths(end, index - 5));
  const totals = months.map((month) => ({
    month,
    total: activeMonthExpenseTotal(month, ownerId, walletId, installmentFilter)
  }));
  const max = Math.max(1, ...totals.map((item) => item.total));
  const points = totals.map((item, index) => {
    const x = 36 + index * 78;
    const y = 180 - (item.total / max) * 128;
    return { ...item, x, y };
  });

  els.expenseTrendGraph.innerHTML = `
    <svg class="trend-svg" viewBox="0 0 460 230" role="img" aria-label="Expense trend for last six months">
      <path class="trend-grid" d="M30 52H438M30 116H438M30 180H438" />
      ${points
        .map((point) => {
          const height = Math.max(4, 180 - point.y);
          return `<rect class="trend-bar" x="${point.x - 18}" y="${180 - height}" width="36" height="${height}" rx="10" />`;
        })
        .join("")}
      <polyline class="trend-line" points="${points.map((point) => `${point.x},${point.y}`).join(" ")}" />
      ${points
        .map(
          (point) => `
          <circle class="trend-dot" cx="${point.x}" cy="${point.y}" r="5" />
          <text class="trend-value" x="${point.x}" y="${Math.max(18, point.y - 12)}">${compactCurrency(point.total)}</text>
          <text class="trend-label" x="${point.x}" y="210">${point.month.toLocaleDateString(undefined, { month: "short" })}</text>
        `
        )
        .join("")}
    </svg>
  `;
}

function activeMonthExpenseTotal(monthDate, ownerId, walletId, installmentFilter) {
  return state.expenses
    .filter((expense) => {
      if (ownerId !== "all" && expense.ownerId !== ownerId) return false;
      if (walletId !== "all" && expense.walletId !== walletId) return false;
      if (installmentFilter === "installment" && !expense.installment) return false;
      if (installmentFilter === "one-time" && expense.installment) return false;
      if (!expense.installment) return isSameMonth(expense.date, monthDate);
      return isInstallmentActiveInMonth(expense, monthDate);
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
}

function startEditingExpense(id) {
  const expense = findById(state.expenses, id);
  if (!expense) return;
  editingExpenseId = id;
  els.expenseOwner.value = expense.ownerId;
  els.expenseWallet.value = expense.walletId;
  els.expenseDate.value = expense.date;
  els.expenseCategory.value = expense.categoryId;
  els.expenseDescription.value = expense.description || "";
  els.expenseAmount.value = expense.amount;
  els.isInstallment.checked = expense.installment;
  els.totalTenor.value = expense.installment ? expense.totalTenor : "";
  els.totalTenor.required = expense.installment;
  els.installmentFields.classList.toggle("visible", expense.installment);
  updateInstallmentPreview();
  updateExpenseSelectPreviews();
  renderExpenseFormState();
  switchTab("expenses");
  els.expenseForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetExpenseForm() {
  editingExpenseId = null;
  els.expenseForm.reset();
  els.expenseDate.value = todayISO();
  els.isInstallment.checked = false;
  els.installmentFields.classList.remove("visible");
  els.totalTenor.required = false;
  updateInstallmentPreview();
}

function addNamedItem(collection, rawName, icon, color, prefix) {
  const name = normalizeName(rawName);
  if (!name) return;
  if (state[collection].some((item) => item.name.toLowerCase() === name.toLowerCase())) return;
  state[collection].push({ id: uniqueId(prefix), name, icon, color });
  saveAndRender();
}

function bindIconUpload(input, onLoad) {
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) {
      onLoad("");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      onLoad(`image:${reader.result}`);
    });
    reader.readAsDataURL(file);
  });
}

function handleChipDelete(collection, prefix) {
  return (event) => {
    const button = event.target.closest(`[data-delete-${prefix}]`);
    if (!button) return;
    const id = button.dataset[`delete${capitalize(prefix)}`];
    if (isItemUsed(prefix, id)) {
      alert("This item is used by an expense and cannot be deleted.");
      return;
    }
    if (prefix === "owner") {
      state.budgets = state.budgets.filter((budget) => budget.ownerId !== id);
    }
    state[collection] = state[collection].filter((item) => item.id !== id);
    saveAndRender();
  };
}

function renderTiles(container, items, prefix, options = {}) {
  if (!items.length) {
    container.innerHTML = '<p class="empty-state">No items yet.</p>';
    return;
  }

  container.innerHTML = items
    .map((item) => `
      <span class="icon-tile ${options.locked ? "locked-tile" : ""}">
        ${iconBadge(item.icon || "tags", item.color || palette[0])}
        <span>${escapeHtml(item.name)}</span>
        ${
          options.locked
            ? '<span class="default-tag">Default</span>'
            : `<button type="button" title="Delete ${escapeHtml(item.name)}" data-delete-${prefix}="${item.id}">
                <span class="icon" data-icon="x"></span>
              </button>`
        }
      </span>
    `)
    .join("");
}

function fillSelect(select, items, emptyText = "No options") {
  const currentValue = select.value;
  if (!items.length) {
    select.innerHTML = `<option value="">${emptyText}</option>`;
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = items
    .map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`)
    .join("");
  if (items.some((item) => item.id === currentValue)) select.value = currentValue;
}

function updateInstallmentPreview() {
  const installment = els.isInstallment.checked;
  const amount = Number(els.expenseAmount.value) || 0;
  const totalTenor = Math.max(0, Number(els.totalTenor.value) || 0);
  const date = els.expenseDate.value || todayISO();
  const calc = calculateExpense({ date, amount, totalTenor, installment });

  els.previewRemaining.textContent = `${calc.remaining} months`;
  els.previewTotal.textContent = formatCurrency(calc.total);
  els.previewOutstanding.textContent = formatCurrency(calc.outstanding);
}

function updateExpenseSelectPreviews() {
  const owner = findById(state.owners, els.expenseOwner.value);
  const wallet = findById(state.wallets, els.expenseWallet.value);
  const category = findById(state.categories, els.expenseCategory.value);
  els.expenseOwnerPreview.innerHTML = owner ? iconBadge(owner.icon, owner.color) : "";
  els.expenseWalletPreview.innerHTML = wallet ? iconBadge(wallet.icon, wallet.color) : "";
  els.expenseCategoryPreview.innerHTML = category ? iconBadge(category.icon, category.color) : "";
  renderIcons();
}

function calculateExpense(expense, asOf = new Date()) {
  if (!expense.installment) {
    return { monthsElapsed: 0, remaining: 0, total: Number(expense.amount) || 0, outstanding: 0 };
  }

  const totalTenor = Math.max(0, Number(expense.totalTenor) || 0);
  const amount = Number(expense.amount) || 0;
  const start = monthStart(expense.date);
  const current = monthStart(asOf);
  const monthsElapsed = Math.max(0, monthDiff(start, current));
  const remaining = Math.max(0, totalTenor - monthsElapsed);
  return {
    monthsElapsed,
    remaining,
    total: amount * totalTenor,
    outstanding: remaining * amount
  };
}

function isInstallmentActiveInMonth(expense, monthDate) {
  if (!expense.installment) return false;
  const totalTenor = Math.max(0, Number(expense.totalTenor) || 0);
  const elapsed = monthDiff(monthStart(expense.date), monthStart(monthDate));
  return elapsed >= 0 && elapsed < totalTenor;
}

function getBudgetTotal(ownerId, month) {
  return state.budgets
    .filter((budget) => budget.month === month && (ownerId === "all" || budget.ownerId === ownerId))
    .reduce((sum, budget) => sum + Number(budget.amount || 0), 0);
}

function isItemUsed(prefix, id) {
  const keyMap = { owner: "ownerId", wallet: "walletId", category: "categoryId" };
  return state.expenses.some((expense) => expense[keyMap[prefix]] === id);
}

function switchTab(tabName) {
  els.tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
  els.tabPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `${tabName}Panel`));
}

function setDefaultDates() {
  const month = monthISO(new Date());
  els.expenseDate.value = todayISO();
  els.filterMonth.value = month;
  els.budgetMonth.value = month;
}

function saveAndRender() {
  saveState();
  render();
}

async function initSync() {
  if (!["http:", "https:"].includes(window.location.protocol)) {
    setSyncStatus("Local mode");
    return;
  }

  try {
    await publicApiRequest("/api/bootstrap");
  } catch {
    setSyncStatus("API unavailable");
    showAuthScreen();
    els.authError.textContent = "Signup needs the Netlify API functions. Redeploy with netlify.toml and netlify/functions included.";
    return;
  }
  authMode = "login";
  updateAuthMode();
  try {
    if (!authToken) throw new Error("Unauthorized");
    const remote = await apiRequest("/api/state");
    state = migrateState(remote);
    saveLocalState();
    syncEnabled = true;
    hideAuthScreen();
    setSyncStatus(currentUser ? `Synced: ${currentUser}` : "Synced");
    render();
    syncTimer = setInterval(refreshFromServer, 4000);
    await renderAccounts();
  } catch (error) {
    clearAuth();
    showAuthScreen();
    setSyncStatus("Login required");
  }
}

function updateAuthMode() {
  const setup = authMode === "setup";
  els.authTitle.textContent = setup ? "Create Family Account" : "Family Login";
  els.authHelp.textContent = setup
    ? "Set the first username and password for this family app."
    : "Use your family app username and password.";
  els.authSubmitButton.textContent = setup ? "Create Account" : "Login";
  els.authToggleButton.textContent = setup ? "I already have an account" : "Create an account";
  els.authPassword.autocomplete = setup ? "new-password" : "current-password";
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  els.authError.textContent = "";
  const username = normalizeName(els.authUsername.value);
  const password = els.authPassword.value;
  try {
    const endpoint = authMode === "setup" ? "/api/register" : "/api/login";
    const result = await publicApiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    authToken = result.token;
    currentUser = result.username;
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    localStorage.setItem(AUTH_USER_KEY, currentUser);
    hideAuthScreen();
    syncEnabled = true;
    const remote = await apiRequest("/api/state");
    state = migrateState(remote);
    saveLocalState();
    setSyncStatus(`Synced: ${currentUser}`);
    render();
    clearInterval(syncTimer);
    syncTimer = setInterval(refreshFromServer, 4000);
  } catch (error) {
    els.authError.textContent = error.message;
  }
}

async function publicApiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  return parseJsonResponse(response);
}

function showAuthScreen() {
  els.authScreen.hidden = false;
  renderIcons();
}

function hideAuthScreen() {
  els.authScreen.hidden = true;
  els.authForm.reset();
}

function clearAuth() {
  authToken = "";
  currentUser = "";
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

async function refreshFromServer() {
  if (!syncEnabled) return;
  try {
    const remote = await apiRequest("/api/state");
    state = migrateState(mergeStates(remote, state, false));
    saveLocalState();
    setSyncStatus(currentUser ? `Synced: ${currentUser}` : "Synced");
    render();
  } catch {
    setSyncStatus("Offline");
  }
}

function pushStateToServer() {
  if (!syncEnabled) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      const remote = await apiRequest("/api/state");
      const merged = mergeStates(remote, state, true);
      await apiRequest("/api/state", {
        method: "PUT",
        body: JSON.stringify(merged)
      });
      setSyncStatus(currentUser ? `Synced: ${currentUser}` : "Synced");
    } catch {
      setSyncStatus("Sync failed");
    }
  }, 250);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
      ...(options.headers || {})
    }
  });
  return parseJsonResponse(response);
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  if (!contentType.includes("application/json")) {
    throw new Error("Netlify API is not deployed. /api is returning the website HTML instead of JSON.");
  }
  const payload = text ? JSON.parse(text) : {};
  if (response.status === 401) throw new Error(payload.error || "Unauthorized");
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

function mergeStates(remoteRaw, localRaw, preferLocal) {
  const remote = migrateState(remoteRaw || {});
  const local = migrateState(localRaw || {});
  return {
    ...remote,
    currency: preferLocal ? local.currency : remote.currency || local.currency,
    owners: mergeById(remote.owners, local.owners, preferLocal),
    wallets: mergeById(remote.wallets, local.wallets, preferLocal),
    categories: mergeById(remote.categories, local.categories, preferLocal),
    budgets: mergeById(remote.budgets, local.budgets, preferLocal),
    expenses: mergeById(remote.expenses, local.expenses, preferLocal)
  };
}

function mergeById(remoteItems, localItems, preferLocal) {
  const map = new Map();
  remoteItems.forEach((item) => map.set(item.id, item));
  localItems.forEach((item) => {
    map.set(item.id, preferLocal ? { ...map.get(item.id), ...item } : { ...item, ...map.get(item.id) });
  });
  return [...map.values()];
}

function setSyncStatus(text) {
  els.syncStatus.textContent = text;
  els.syncStatus.dataset.status = text.toLowerCase().replace(/\s+/g, "-");
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const base = saved ? { ...clone(defaultState), ...saved } : clone(defaultState);
    return migrateState(base);
  } catch {
    return clone(defaultState);
  }
}

function migrateState(rawState) {
  const next = {
    ...clone(defaultState),
    ...rawState,
    owners: rawState.owners?.length ? rawState.owners : clone(defaultState.owners),
    wallets: rawState.wallets?.length ? rawState.wallets : clone(defaultState.wallets),
    categories: rawState.categories?.length ? rawState.categories : clone(defaultState.categories),
    budgets: Array.isArray(rawState.budgets) ? rawState.budgets : [],
    expenses: Array.isArray(rawState.expenses) ? rawState.expenses : []
  };

  next.owners = next.owners.map((owner, index) => ({
    ...owner,
    icon: owner.icon || (index === 0 ? "crown" : "user"),
    color: owner.color || palette[index % palette.length]
  }));
  next.wallets = next.wallets.map((wallet, index) => ({
    ...wallet,
    icon: wallet.icon || "credit-card",
    color: wallet.color || palette[(index + 2) % palette.length]
  }));
  Object.entries(categoryDefaults).forEach(([name, [icon, color]]) => {
    if (!next.categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      next.categories.push({ id: slugId("category", name), name, icon, color, isDefault: true });
    }
  });

  next.categories = next.categories.map((category, index) => {
    const defaults = categoryDefaults[category.name] || ["tags", palette[index % palette.length]];
    const isDefault =
      typeof category.isDefault === "boolean"
        ? category.isDefault
        : Boolean(categoryDefaults[category.name] && category.id === slugId("category", category.name));
    return {
      ...category,
      icon: category.icon || defaults[0],
      color: category.color || defaults[1],
      isDefault
    };
  });
  next.budgets = next.budgets.map((budget) => ({
    id: budget.id || uniqueId("budget"),
    ownerId: budget.ownerId,
    month: budget.month,
    amount: Number(budget.amount) || 0
  }));
  next.expenses = next.expenses.map((expense) => ({
    ...expense,
    description: expense.description || ""
  }));
  return next;
}

function saveState() {
  saveLocalState();
  pushStateToServer();
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderIcons() {
  document.querySelectorAll(".icon[data-icon]").forEach((element) => {
    element.innerHTML = icons[element.dataset.icon] || icons.tags;
  });
}

function iconBadge(icon, color, className = "") {
  if (String(icon).startsWith("image:")) {
    return `<span class="icon-badge ${className}" style="--badge-color:${color}"><img class="uploaded-icon" src="${escapeHtml(String(icon).slice(6))}" alt="" /></span>`;
  }
  if (String(icon).startsWith("emoji:")) {
    return `<span class="icon-badge ${className}" style="--badge-color:${color}"><span class="custom-emoji">${escapeHtml(String(icon).slice(6))}</span></span>`;
  }
  return `<span class="icon-badge ${className}" style="--badge-color:${color}"><span class="icon" data-icon="${icon}"></span></span>`;
}

function tileCell(item, fallbackIcon) {
  return `<span class="table-entity">${iconBadge(item?.icon || fallbackIcon, item?.color || palette[0])}<span>${escapeHtml(item?.name || "Unknown")}</span></span>`;
}

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ");
}

function uniqueId(prefix) {
  const random =
    window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

function slugId(prefix, value) {
  return `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function findById(items, id) {
  return items.find((item) => item.id === id);
}

function todayISO() {
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function monthISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function monthStart(value) {
  const date = typeof value === "string" ? new Date(`${value.slice(0, 7)}-01T00:00:00`) : value;
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function monthDiff(start, end) {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function isSameMonth(value, monthDate) {
  const date = monthStart(value);
  const month = monthStart(monthDate);
  return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
}

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: state.currency,
    maximumFractionDigits: 2
  }).format(value || 0);
}

function compactCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
    currency: state.currency,
    style: "currency"
  }).format(value || 0);
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value || 0);
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatMonth(value) {
  return monthStart(value).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
