class FloatingElements {
    constructor() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.container = document.querySelector('.floating-elements');
            if (!this.container) {
                console.error('Floating elements container not found!');
                return;
            }
            
            this.imageList = [
                'float_dice.png',
                'float_dice_2.png',
                'float_gold_chips.png',
                'float_poker_chips.png',
                'float_poker_chips_2.png'
            ];

            // Define grid
            this.grid = {
                columns: 6,  // 6 columns
                rows: 4,     // 4 rows
                cells: []    // Will store occupied cells
            };

            this.init();
        });
    }

    init() {
        // Initialize grid cells as unoccupied
        for (let i = 0; i < this.grid.rows * this.grid.columns; i++) {
            this.grid.cells.push(false);
        }

        // Create elements in grid pattern
        this.createGridElements();
        
        // Add side elements last
        this.createSideElement('left', 65);
        this.createSideElement('left', 90);
        this.createSideElement('right', 65);
        this.createSideElement('right', 90);
    }

    getRandomUnoccupiedCell() {
        const unoccupiedCells = this.grid.cells
            .map((occupied, index) => ({ occupied, index }))
            .filter(cell => !cell.occupied);

        if (unoccupiedCells.length === 0) return null;

        const randomCell = unoccupiedCells[Math.floor(Math.random() * unoccupiedCells.length)];
        this.grid.cells[randomCell.index] = true;
        
        const row = Math.floor(randomCell.index / this.grid.columns);
        const col = randomCell.index % this.grid.columns;
        
        return { row, col };
    }

    createGridElements() {
        // Create 16 elements (less than total grid cells to ensure spacing)
        for (let i = 0; i < 16; i++) {
            const cell = this.getRandomUnoccupiedCell();
            if (cell) {
                this.createFloatingElement(cell);
            }
        }
    }

    createFloatingElement(cell) {
        const element = document.createElement('img');
        
        const randomImage = this.imageList[Math.floor(Math.random() * this.imageList.length)];
        element.src = `assets/images/${randomImage}`;
        element.classList.add('floating-element');
        
        const isMedium = Math.random() < 0.3;
        const size = isMedium 
            ? Math.random() * 60 + 90   // 90-150px for medium
            : Math.random() * 30 + 50;  // 50-80px for small
            
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        // Calculate position based on grid cell
        const cellWidth = 100 / this.grid.columns;
        const cellHeight = 70 / this.grid.rows; // Using only top 70% of screen
        
        // Add some randomness within the cell
        const x = (cell.col * cellWidth) + (Math.random() * (cellWidth * 0.6) + cellWidth * 0.2);
        const y = (cell.row * cellHeight) + (Math.random() * (cellHeight * 0.6) + cellHeight * 0.2);
        
        element.style.position = 'absolute';
        element.style.left = `${x}%`;
        element.style.top = `${y}%`;
        
        if (randomImage.includes('dice')) {
            element.classList.add('rotate-element');
        } else {
            element.classList.add('hover-element');
        }
        
        element.style.animationDelay = `${Math.random() * 2}s`;
        
        this.container.appendChild(element);
    }

    createSideElement(side, verticalOffset) {
        const element = document.createElement('img');
        const chipImages = this.imageList.filter(img => img.includes('chips'));
        const randomChip = chipImages[Math.floor(Math.random() * chipImages.length)];
        element.src = `assets/images/${randomChip}`;
        element.classList.add('floating-element', 'hover-element');
        element.style.width = '200px';
        element.style.height = '200px';
        element.style[side] = '40px';
        element.style.top = `${verticalOffset}%`;
        this.container.appendChild(element);
    }
}

// Add smooth animations
const style = document.createElement('style');
style.textContent = `
    .floating-elements {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2; /* Between background (1) and content (3) */
    }

    .floating-element {
        position: absolute;
        pointer-events: none;
        opacity: 0.8;
    }

    .rotate-element {
        animation: smoothRotate 8s linear infinite;
    }

    .hover-element {
        animation: smoothHover 4s ease-in-out infinite;
    }

    @keyframes smoothRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes smoothHover {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
    }
`;
document.head.appendChild(style);

// Create instance
new FloatingElements();