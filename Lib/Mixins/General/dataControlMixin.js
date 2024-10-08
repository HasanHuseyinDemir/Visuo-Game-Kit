export function dataControlMixin(initialData, controlFunc, onError = () => {}) {
    let data = initialData;
    if (!controlFunc(data)) {
        onError('invalidData', 'Initial data does not meet the criteria.',data);
    }
    return {
        set(newData) {
            if (controlFunc(newData)) {
                data = newData;
            } else {
                onError('invalidData', 'New data does not meet the criteria.',newData);
            }
        },
        get() {
            return data;
        },
        setMethod(func){
            controlFunc=func
        }
    };
}
