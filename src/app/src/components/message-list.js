import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextMessage from '../widgets/messages/text-message'
import FileMessage from '../widgets/messages/file-message'
import { getMessagesList } from '../redux/selectors'
import SendForm from './send-form'
import { services } from '../services'
import { addMessage } from '../redux/actions'

class MessageList extends Component {
        
    handleScroll = () => {
        this.textInput.scrollIntoView(false)
        this.textInput.scrollTo(0, this.textInput.scrollHeight)                   
    }

    componentDidMount() {
        this.handleScroll();
        this.interval = setInterval(() => this.checkMessages(), 1000);
    }  

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    checkMessages = () => {
        services.checkMessages().then(data => {
            data.data.messages.forEach((msg) => {
                this.props.addMessage(msg);
                this.handleScroll();
            })
        });
        services.messages();
    }

    render() {
        return (
            <div className="list-container">
                <div ref={ (e) => { this.textInput = e; } } className="message-list d-flex flex-column">
                    {this.props.messages.map((msg) => {
                        if (msg.type === 'text')
                            return <TextMessage key={ msg.id } msg={ msg }/>
                        else
                            return <FileMessage key={ msg.id } msg={ msg }/>
                    })}
                </div>
                <SendForm scroll={ () => this.handleScroll() } />
            </div>
        )
    }
}


const mapStateToProps = state => {
    return { 
        messages: getMessagesList(state)
    };
}

export default connect(mapStateToProps, { addMessage })(MessageList);