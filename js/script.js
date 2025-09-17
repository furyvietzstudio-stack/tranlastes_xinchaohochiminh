const inputText = document.getElementById("inputText");
const count = document.getElementById("count");
const sendBtn = document.getElementById("sendBtn");
const langFrom = document.getElementById("langFrom");
const langTo = document.getElementById("langTo");
const langLabel = document.getElementById("langLabel");
const swapBtn = document.getElementById("swapBtn");
const resultBox = document.getElementById("resultBox");
const translatedText = document.getElementById("translatedText");
const copyBtn = document.getElementById("copyBtn");
const targetLabel = document.getElementById("targetLabel");

const placeholders = {
  vi: "Nhập văn bản cần dịch...",
  ko: "번역할 텍스트를 입력하세요...",
  en: "Enter text to translate..."
};

// Đếm ký tự
inputText.addEventListener("input", () => {
  count.textContent = inputText.value.length;
});

// Cập nhật giao diện
function updateUI() {
  langLabel.textContent = langFrom.options[langFrom.selectedIndex].text;
  inputText.placeholder = placeholders[langFrom.value];
  targetLabel.textContent = langTo.options[langTo.selectedIndex].text;
}

langFrom.addEventListener("change", updateUI);
langTo.addEventListener("change", updateUI);

// Swap ⇄
swapBtn.addEventListener("click", () => {
  const temp = langFrom.value;
  langFrom.value = langTo.value;
  langTo.value = temp;
  updateUI();
});

// Gửi dịch
sendBtn.addEventListener("click", async () => {
  if (!inputText.value.trim()) {
    alert("Vui lòng nhập văn bản!");
    return;
  }

  const payload = {
    text: inputText.value,
    sourceLang: langFrom.value, // dùng value (vi, ko, en)
    targetLang: langTo.value
  };

  sendBtn.textContent = "⏳ Đang dịch...";
  sendBtn.disabled = true;

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.translated) {
      translatedText.value = data.translated;
    } else {
      translatedText.value = "❌ Dịch thất bại: " + (data.error || "Không rõ nguyên nhân");
    }

    resultBox.style.display = "block";
  } catch (err) {
    console.error(err);
    translatedText.value = "⚠️ Có lỗi kết nối tới server!";
    resultBox.style.display = "block";
  } finally {
    sendBtn.textContent = "Dịch";
    sendBtn.disabled = false;
  }
});

// Copy kết quả
copyBtn.addEventListener("click", () => {
  translatedText.select();
  document.execCommand("copy");
  alert("✅ Đã copy kết quả vào clipboard!");
});

// Khởi tạo UI
updateUI();
