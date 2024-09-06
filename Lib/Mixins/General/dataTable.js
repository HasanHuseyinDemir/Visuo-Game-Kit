export function createDataTable() {
    const data = [];
    let onAddCallback = null;
    let onDataChangeCallback = null;
    return {
        add(array) {
            if (Array.isArray(array)) {
                array.forEach((item, index) => {
                    if (data[index] === undefined) {
                        data[index] = [];
                    }
                    data[index].push(item);
                });
                if (onAddCallback) {
                    onAddCallback(array);
                }
            } else {
                throw new Error("Input must be an array");
            }
        },
        get(type, index) {
            if (type === "column") {
                if (index >= 0 && index < data.length) {
                    return data[index];
                } else {
                    throw new Error("Column index out of bounds");
                }
            } else if (type === "row") {
                if (index >= 0 && data[0] && index < data[0].length) {
                    return data.map(column => column[index] !== undefined ? column[index] : undefined);
                } else {
                    throw new Error("Row index out of bounds");
                }
            } else {
                throw new Error("Type must be 'column' or 'row'");
            }
        },
        change(columnIndex, rowIndex, value) {
            if (columnIndex >= 0 && columnIndex < data.length) {
                if (rowIndex >= 0 && rowIndex < data[columnIndex].length) {
                    data[columnIndex][rowIndex] = value;
                    if (onDataChangeCallback) {
                        onDataChangeCallback(columnIndex, rowIndex, value);
                    }
                } else {
                    throw new Error("Row index out of bounds");
                }
            } else {
                throw new Error("Column index out of bounds");
            }
        },
        remove(rowIndex) {
            if (rowIndex >= 0 && data[0] && rowIndex < data[0].length) {
                data.forEach(column => {
                    if (column) {
                        column.splice(rowIndex, 1);
                    }
                });
            } else {
                throw new Error("Row index out of bounds");
            }
        },
        onAdd(callback) {
            if (typeof callback === 'function') {
                onAddCallback = callback;
            } else {
                throw new Error("Callback must be a function");
            }
        },
        onDataChange(callback) {
            if (typeof callback === 'function') {
                onDataChangeCallback = callback;
            } else {
                throw new Error("Callback must be a function");
            }
        },
        searchByValue(type, value) {
            if (type === "column") {
                const results = [];
                data.forEach(column => {
                    if (column.includes(value)) {
                        results.push(...column)
                    }
                });
                return results;
            } else if (type === "row") {
                const rowResults = [];
                data.forEach((column, colIndex) => {
                    column.forEach((item, rowIndex) => {
                        if (item === value) {
                            rowResults.push(this.get("row", rowIndex));
                        }
                    });
                });
                return rowResults;
            } else {
                throw new Error("Type must be 'column' or 'row'");
            }
        }
    };
}
