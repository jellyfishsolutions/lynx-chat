import { ADD_MESSAGE, INIT } from './actionTypes'

const initialMessageState = {
    messages: [],
    conversations: []
}

export default function (state = initialMessageState, action) {
    switch (action.type) {
        case INIT: {
            return ({
                ...state,
                messages: action.payload,
            });
        }
        case ADD_MESSAGE: {
            let messages = [...state.messages];
            if (messages.filter(function(m) { return m.id === action.payload.id; }).length === 0) {
                messages.push(action.payload)
            }
            return ({
                ...state,
                messages: messages,
            });
        }
        default:
            return state;
    }
}
