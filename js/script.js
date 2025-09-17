const inputText = document.getElementById("inputText");
const count = document.getElementById("count");
const sendBtn = document.getElementById("sendBtn");
const langFrom = document.getElementById("langFrom");
const langTo = document.getElementById("langTo");
const langLabel = document.getElementById("langLabel");
const swapBtn = document.querySelector(".swap");

// Placeholder theo ngôn ngữ
const placeholders = {
  vi: "Nhập văn bản cần dịch...",
  ko: "번역할 텍스트를 입력하세요...",
  en: "Enter text to translate..."
};

// Đếm ký tự
inputText.addEventListener("input", () => {
  count.textContent = inputText.value.length;
});

// Hàm cập nhật label + placeholder
function updateUI() {
  langLabel.textContent = langFrom.options[langFrom.selectedIndex].text;
  inputText.placeholder = placeholders[langFrom.value];
}

// Khi đổi ngôn ngữ nguồn
langFrom.addEventListener("change", updateUI);

// 👉 Sự kiện bấm nút hoán đổi
swapBtn.addEventListener("click", () => {
  let temp = langFrom.value;
  langFrom.value = langTo.value;
  langTo.value = temp;

  updateUI();
});

// Gửi dữ liệu
sendBtn.addEventListener("click", () => {
  if (!inputText.value.trim()) {
    alert("Vui lòng nhập văn bản!");
    return;
  }

  alert(`Gửi từ [${langFrom.value}] sang [${langTo.value}]:\n${inputText.value}`);
});

// Khởi tạo lần đầu
updateUI();
