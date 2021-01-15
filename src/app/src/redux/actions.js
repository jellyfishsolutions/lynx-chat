import { ADD_MESSAGE, INIT } from './actionTypes';

export const addMessage = (msg) => (
    {
        type: ADD_MESSAGE,
        payload: msg
    }
)

export const init = (msg) => (
    {
        type: INIT,
        payload: msg
    }
)

