import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addMessage } from '../redux/actions'
import { services } from '../services'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'

class SendForm extends Component {
    constructor() {
        super();
        this.state = {
            message: ''
        };
    }

    handleChange = (e) => {
        this.setState({
            message: e.target.value
        });
    }

    handleSubmit = (e) => {
        var str = e.target.value.trim();
        if (e.which === 13 && str.length === 0) {
            e.preventDefault()
            this.setState({
                message: ''
            })
        }

        if (e.which === 13 && str.length > 0) {
            this.submitMsg();
        }
    }

    submitMsg = () => {
        if (!this.state.message.trim()) {
            this.setState({
                message: ''
            })
            return;
        }
        var msg = {
            sender: {},
            type: 'text',
            text: this.state.message
        }
        services.sendMessage(msg).then(res => {
            if (res) {
                this.props.addMessage(res);
                    
                this.setState({
                    message: ''
                })
                setTimeout(() => {this.props.scroll();})
            }
        })
    }

    submitFile = () => {
        var file = {
            sender: {},
            type: 'file',
            text: ''
        }
        services.sendFile(file).then(res => {
            if (res) {
                this.props.addMessage(res);
                setTimeout(() => {this.props.scroll();})
            }
        })
    }

    render() {
        return (
            <form className="send-message-form">
                <div className="d-flex">
                        <textarea
                        placeholder="Digita un messaggio e premi INVIO"
                        onChange={ this.handleChange }
                        onKeyDown={ this.handleSubmit }
                        value={ this.state.message }/>
                        
                        <button type="button" onClick={ this.submitMsg } className="btn btn-outline-primary m-3">
                            <FontAwesomeIcon icon={ faPaperPlane } />
                        </button>
                        <button type="button" onClick={ () => { this.fileUpload.click() } } className="btn btn-outline-primary mt-3 mb-3 mr-3 file-button">
                            <FontAwesomeIcon icon={faPaperclip}/>
                        </button>
                        <input hidden type="file" ref={ (e) => { this.fileUpload = e; } } onChange={ this.submitFile }></input>
                </div>
            </form>
        )
    }
}

export default connect(null, { addMessage })(SendForm);