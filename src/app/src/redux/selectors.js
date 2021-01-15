export const getComponentsState = store => {
    return store.messages;
}
export const getMessagesList = store => {
    return getComponentsState(store) ? getComponentsState(store) : [];
}