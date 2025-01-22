class EyeTracking {
    constructor() {
        this.eyes = document.querySelectorAll('.eye');
        this.eyeContainers = document.querySelectorAll('.eye-container');
        this.updateBounds();

        // Bind events
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.updateBounds.bind(this));
        window.addEventListener('scroll', this.updateBounds.bind(this));

        // Initial position
        this.handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    }

    updateBounds() {
        this.bounds = Array.from(this.eyeContainers).map(container => {
            const rect = container.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                radius: Math.min(rect.width, rect.height) / 2
            };
        });
    }

    handleMouseMove(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        this.eyes.forEach((eye, index) => {
            if (!this.bounds[index]) return;

            const dx = mouseX - this.bounds[index].x;
            const dy = mouseY - this.bounds[index].y;
            
            // Calculate angle in radians
            const angle = Math.atan2(dy, dx);
            
            // Convert to degrees and add 180 to invert
            let degrees = (angle * (180 / Math.PI)) + 180;
            
            // Normalize the degrees to 0-360 range
            degrees = (degrees + 360) % 360;

            // Apply rotation
            eye.style.transform = `rotate(${degrees}deg)`;
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EyeTracking();
}); 