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
const clearInput = document.getElementById("clearInput"); // nút X mới

const placeholders = {
  vi: "Nhập văn bản cần dịch...",
  ko: "번역할 텍스트를 입력하세요..."
};

// Đếm ký tự + hiện nút X khi có chữ
inputText.addEventListener("input", () => {
  count.textContent = inputText.value.length;
  clearInput.style.display = inputText.value.length > 0 ? "block" : "none";
});

// Bấm nút X để xóa ô nhập
clearInput.addEventListener("click", () => {
  inputText.value = "";
  count.textContent = "0";
  clearInput.style.display = "none";
});

// Cập nhật giao diện theo ngôn ngữ
function updateUI() {
  langLabel.textContent = langFrom.options[langFrom.selectedIndex].text;
  inputText.placeholder = placeholders[langFrom.value] || "Nhập văn bản...";
  targetLabel.textContent = langTo.options[langTo.selectedIndex].text;

  sendBtn.textContent = langFrom.value === "ko" ? "번역" : "Dịch";
}

langFrom.addEventListener("change", updateUI);
langTo.addEventListener("change", updateUI);

// Hoán đổi ⇄ ngôn ngữ
swapBtn.addEventListener("click", () => {
  const temp = langFrom.value;
  langFrom.value = langTo.value;
  langTo.value = temp;
  updateUI();
});

// Gửi yêu cầu dịch
sendBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) {
    alert("Vui lòng nhập văn bản!");
    return;
  }

  const payload = {
    text,
    sourceLang: langFrom.value,
    targetLang: langTo.value
  };

  sendBtn.textContent = "⏳";
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
    console.error("Client Error:", err);
    translatedText.value = "⚠️ Connect server!";
    resultBox.style.display = "block";
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = langFrom.value === "ko" ? "번역" : "Dịch";
  }
});

// Copy kết quả dịch
copyBtn.addEventListener("click", () => {
  translatedText.select();
  document.execCommand("copy");
  alert("✅ Đã copy kết quả vào clipboard!");
});

// Khởi tạo giao diện ban đầu
updateUI();
