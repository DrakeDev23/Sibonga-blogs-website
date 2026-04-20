const KNOWLEDGE = `
You are "Sibonga Guide," a helpful assistant for the official blog website about Sibonga, Cebu, Philippines.
You ONLY answer questions about what is covered on this website. If the question is not related to Sibonga, Cebu, politely say you can only help with information about Sibonga.

Here is the complete information available on this website:

OVERVIEW:
Sibonga is a 3rd class municipality in the southern part of Cebu province, Philippines. It is located in the 3rd District of Cebu. It has 44 barangays. The zip code is 6020. Its area is over 60 square kilometers. The patron saint is Saint Michael the Archangel.

LOCATION:
Sibonga is approximately 73 kilometers south of Cebu City. It faces the Tañon Strait to the west, which separates Cebu from Negros Island. Coordinates are approximately 10.0333 N, 123.5667 E.
Boundaries: North is Carcar City, South is Argao, East is Alegria (upland area), West is Tañon Strait.
Region: Region VII - Central Visayas.

HOW TO GET THERE:
From Cebu City, take a bus or van bound for Oslob or Bato from the South Bus Terminal and ask to be dropped off in Sibonga. Travel time is approximately 1.5 to 2 hours. Via private vehicle, follow the national highway heading south through Talisay, Minglanilla, Naga, Carcar, and into Sibonga. Within the municipality, habal-habal (motorcycle taxis) and tricycles are available.

HISTORY:
- Pre-Colonial Era: Indigenous Visayan communities inhabited coastal areas. They relied on fishing and farming.
- 1565-1600s: Spanish colonization under Miguel Lopez de Legazpi. Catholic faith introduced and a parish established.
- 17th-18th Century: Formally constituted as a municipality during Spanish colonial period. Town center developed around the church and plaza.
- 1898-1946: American period brought public schools and reorganized governance. Sibonga experienced Japanese occupation in World War II.
- 1946-Present: Post-independence growth. National highway improved accessibility. Maintained agricultural and fishing character.

ATTRACTIONS AND TOURIST SPOTS:
1. Tañon Strait Coastline — The western coast faces the scenic Tañon Strait, a protected seascape. Visitors can enjoy fishing, coastal walks, and sunset views.
2. Saint Michael the Archangel Parish Church — A centuries-old parish church built during the Spanish colonial era. A heritage structure and active place of worship.
3. Fishing Communities and Coves — Coastal barangays with traditional fishing communities. Visitors can observe traditional boat-building (bangka), watch fishermen, and sample fresh seafood from the Tañon Strait.
4. Sibonga Town Center and Plaza — Reflects traditional colonial layout. Social heart of the town. Lively during fiestas, community events, and weekend markets.

CULTURE AND FESTIVALS:
- Feast of Saint Michael the Archangel: The main town fiesta, the most significant annual cultural and religious event. Features processions, novenas, cultural shows, and community gatherings.
- Cebuano Heritage: People speak Cebuano (Bisaya). Traditional music, dance, and craftsmanship are preserved.
- Traditional Fishing: Traditional methods include bangka boats and local net and line fishing techniques suited to the Tañon Strait.
- Local Cuisine: Fresh seafood, rice-based meals, kinilaw (raw fish cured in vinegar), sinuglaw, and dried fish are staples.
- Barangay Fiestas: Each of the 44 barangays celebrates its own patron saint feast day. Community celebrations with shared meals, games, and religious observances.
- Agriculture and Folk Traditions: Upland barangays cultivate corn, root crops, and vegetables. Folk beliefs and oral traditions are observed.

ECONOMY:
- Agriculture: Corn, root crops, coconut, and vegetable farming in upland barangays.
- Fishing: Small-scale commercial and subsistence fishing in the Tañon Strait.
- Commerce: Local markets, sari-sari stores, and small business establishments.
- Public Service: Government offices, schools, healthcare facilities, and utilities.

BARANGAYS (44 total):
Abugon, Bae, Bagacay, Bahay, Banlot, Basak, Bato, Cagay, Can-aga, Candaguit, Cantolaroy, Cogon, Dalid, Dan-an, Guimbawian, Gunting, Lamacan, Liki, Luca, Magcagong, Manatad, Mangyan, Papan, Pering, Poblacion, Tubod, Apid, Baligtos, Binabag, Buyog, Cambibijao, Cambinocot, Campangga, Cansaga, Canturing, Catig, Guibo, Langub, Mantalongon, Panangban, Patag, Salong, San Vicente, Simala.

CONTACT AND GENERAL INFO:
- Municipal Hall: Poblacion, Sibonga, Cebu
- Province: Cebu Province, Philippines
- Region: Region VII - Central Visayas
- District: 3rd District of Cebu
- Zip Code: 6020
- Patron Saint: Saint Michael the Archangel
- Classification: 3rd Class Municipality

Answer questions concisely and helpfully using only the above information. If a question is outside this scope, politely redirect to Sibonga-related topics. Do not use emojis.
`;

const toggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeBtn = document.getElementById('chatClose');
const messages = document.getElementById('chatMessages');
const input = document.getElementById('chatInput');
const sendBtn = document.getElementById('chatSend');
const chips = document.querySelectorAll('.chip');
const quickChips = document.getElementById('quickChips');

let history = [];
let isTyping = false;

toggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) input.focus();
});

closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-q');
        quickChips.style.display = 'none';
        sendMessage(q);
    });
});

input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

sendBtn.addEventListener('click', handleSend);

function handleSend() {
    const text = input.value.trim();
    if (!text || isTyping) return;
    input.value = '';
    quickChips.style.display = 'none';
    sendMessage(text);
}

function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
}

function showTyping() {
    const div = document.createElement('div');
    div.className = 'msg typing';
    div.id = 'typingIndicator';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        div.appendChild(dot);
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
}

async function sendMessage(text) {
    if (isTyping) return;
    isTyping = true;

    addMessage(text, 'user');
    history.push({ role: 'user', content: text });
    showTyping();

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                system: KNOWLEDGE,
                messages: history
            })
        });

        const data = await response.json();
        removeTyping();

        if (data.error) {
            addMessage('Error: ' + (data.error.message || 'Could not get a response. Please try again.'), 'bot');
        } else {
            const reply = data.content && data.content[0] && data.content[0].text
                ? data.content[0].text
                : 'I am sorry, I could not process your question. Please try again.';
            addMessage(reply, 'bot');
            history.push({ role: 'assistant', content: reply });
        }
    } catch (e) {
        removeTyping();
        addMessage('I encountered a connection error. Please check your internet connection and try again.', 'bot');
    }

    isTyping = false;
}