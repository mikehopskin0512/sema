export const observerMiddleware = (store) => (next) => async (action) => {
    if (action.type === 'REMOVE_MUTATION_OBSERVER') {
        const { observer } = store.getState();
        observer.disconnect();
    }
    next(action);
};
