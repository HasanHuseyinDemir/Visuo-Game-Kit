export function slotMixin(initialSize, onError = () => {}) {
    if (initialSize < 1) {
        throw new Error("Slot size must be greater than 1.");
    }
    let slots = new Array(initialSize).fill(null);
    let maxSize = initialSize;

    function resize(newSize) {
        if (newSize < 1) {
            throw new Error("New slot size must be greater than 1.");
        }
        if (newSize > maxSize) {
            slots.length = newSize;
            slots.fill(null, maxSize);
        } else {
            slots.length = newSize;
        }
        maxSize = newSize;
    }
    function isSlotOccupied(index) {
        return slots[index] !== null;
    }
    return {
        add(index, item) {
            if (index >= 0 && index < maxSize) {
                if (typeof item === 'function') {
                    if (slots[index] === null) {
                        slots[index] = item;
                    } else {
                        onError('slotOccupied', `Error: Slot ${index} is already occupied.`);
                    }
                } else {
                    onError('itemNotFunction', `Error: Item at slot ${index} must be a function.`);
                }
            } else {
                onError('indexOutOfBounds', `Invalid slot index: ${index}. Slot range: 0 - ${maxSize - 1}`);
            }
        },
        get(index) {
            if (index === undefined) {
                return slots;
            }
            if (index >= 0 && index < maxSize) {
                return slots[index];
            } else {
                onError('indexOutOfBounds', `Invalid slot index: ${index}. Slot range: 0 - ${maxSize - 1}`);
                return null;
            }
        },
        list() {
            return slots.map((item, index) => ({
                slot: index,
                item: item === null ? 'Empty' : 'Function'
            }));
        },
        clear(index) {
            if (index >= 0 && index < maxSize) {
                slots[index] = null;
            } else {
                onError('indexOutOfBounds', `Invalid slot index: ${index}. Slot range: 0 - ${maxSize - 1}`);
            }
        },
        setMaxSize(newSize) {
            resize(newSize);
        },
        getMaxSize() {
            return maxSize;
        },
        isFull() {
            return slots.every(isSlotOccupied);
        }
    };
}