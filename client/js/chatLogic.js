class TogiChat {
    constructor() {
        this.messagesContainer = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input');
        this.sendButton = document.querySelector('.send-button');
        
        this.setupEventListeners();
        this.welcomeMessage();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    welcomeMessage() {
        const welcomeMessages = [
            "Hey there! I'm TOGI, your crypto gaming companion! Ready to explore and win big together? 🎲",
            "Welcome to the future of gaming! I'm TOGI, and I'm here to help you navigate our platform! 🚀",
            "What's up! TOGI here, your AI buddy for all things crypto gaming! Let's make some magic happen! 💫"
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        this.addMessage(randomMessage, false);
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Clear input
        this.input.value = '';

        // Add user message
        this.addMessage(message, true);

        // Show loading state
        const loadingId = this.addLoadingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            // Remove loading indicator
            this.removeLoadingIndicator(loadingId);

            if (data.success) {
                this.addMessage(data.response, false);
            } else {
                this.addErrorMessage();
            }

        } catch (error) {
            console.error('Chat Error:', error);
            this.removeLoadingIndicator(loadingId);
            this.addErrorMessage();
        }
    }

    addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user-message' : 'ai-message');
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        const id = Date.now();
        loadingDiv.id = `loading-${id}`;
        loadingDiv.classList.add('message', 'ai-message', 'loading');
        loadingDiv.textContent = 'TOGI is thinking... 🤔';
        this.messagesContainer.appendChild(loadingDiv);
        this.scrollToBottom();
        return id;
    }

    removeLoadingIndicator(id) {
        const loadingDiv = document.getElementById(`loading-${id}`);
        if (loadingDiv) loadingDiv.remove();
    }

    addErrorMessage() {
        this.addMessage("Oops! Something went wrong. Let's try that again! 🔄", false);
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TogiChat();
}); 