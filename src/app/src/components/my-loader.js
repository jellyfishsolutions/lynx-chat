import React, { Component } from 'react'
import { connect } from 'react-redux'
import MessageList from './message-list'
import { init } from '../redux/actions'
import { services } from '../services'
import Loader from 'react-loader-spinner'

class MyLoader extends Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
        };
    }

    init() {
        services.messages(true).then(data => {
            if (data.data.messages) {
                this.props.init(data.data.messages);
                setTimeout(() => {
                    this.setState({
                        loaded: true
                    })
                }, 1000);
            }
        });
    }

    render() {
        return (
            this.state.loaded
                ? <MessageList />
                : <div className='loader d-flex' onLoad={ this.init() }>
                    <Loader
                        type="Grid"
                        color="#4e73df"
                        height={ 100 }
                        width={ 100 }
                    />
                </div>
        )
    }
}

export default connect(null, { init })(MyLoader);