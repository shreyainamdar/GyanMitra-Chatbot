document.addEventListener("DOMContentLoaded", () => {
    let userInput = document.querySelector("#prompt");
    let btn = document.querySelector("#btn");
    let container = document.querySelector(".container");
    let chatContainer = document.querySelector(".chat-container");
    let API_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBznv_cw6o7Ou4kx5NZO0YbCjMG0-KRIs4';

    function createChatBox(html, className) {
        let div = document.createElement("div");
        div.classList.add(className);
        div.innerHTML = html;
        return div;
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function getApiResponse(userMessage, aiChatBox) {

        let textElement=aiChatBox.querySelector(".text")
        try {
            const payload = {
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }]
            };

            console.log("Sending payload:", JSON.stringify(payload));

            let response = await fetch(API_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'No message'}`);
            }

            let data = await response.json();
            let apiresponse=data?.candidates[0].content.parts[0].text.trim();
            console.log("API response data:", apiresponse);

            // Check if candidates exist and have text
            if (data.candidates && data.candidates.length > 0) {
               textElement.innerText = apiresponse ; // Update with actual response text
            } else {
                textElement.innerText = "No candidates found.";
            }
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching API response:", error);
        }
        finally{
            aiChatBox.querySelector(".loading").style.display="none"
        }
        
    }

    function showLoad(userMessage) { // Accept userMessage as an argument
        let html = `
            <div class="img">
                <img src="ai.png" alt="AI" width="50">
            </div>
            <p class="text"></p>
            <img class="loading" src="loading.gif" alt="Loading..." height="50">
        `;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        getApiResponse(userMessage, aiChatBox); // Pass the userMessage to getApiResponse
        scrollToBottom();
    }



    function sendMessage(){
        let userMessage = userInput.value; // Get the user message
            if(userMessage==""){
                container.style.display="flex"
            }{
                container.style.display="none"
            }
            if (!userMessage) return;
    
            let html = `
                <div class="img">
                    <img src="user.png" alt="user" width="50">
                </div>
                <p class="text"></p>`;
    
            let userChatBox = createChatBox(html, "user-chat-box");
            userChatBox.querySelector(".text").innerText = userMessage;
            chatContainer.appendChild(userChatBox);
    
            userInput.value = '';
    
            // Call showLoad after displaying user message, passing userMessage
            setTimeout(() => showLoad(userMessage), 500);
            scrollToBottom();
    }



    btn.addEventListener("click", () => {
        
        sendMessage();
    });

    
userInput.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        e.preventDefault();
        
        sendMessage();
    }
})
});

