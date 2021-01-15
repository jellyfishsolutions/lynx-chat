import React from 'react'
import { connect } from 'react-redux'
import { services } from '../../services'
import moment from 'moment'
import 'moment/locale/it'
moment.locale('it')

class TextMessage extends React.Component {  
    
    render() {
        var msg = 'left align-self-start';
        var text = 'left-text';
        var sender = this.props.msg.sender._name || this.props.msg.sender.user.nickName;
        if (this.props.msg.sender.id === services.senderId) {
            msg = 'right align-self-end';
            text = 'right-text';
            sender = '';
        }

        var date = moment(new Date(this.props.msg.createdAt)).format('D MMM HH:mm');
        if (moment(new Date()).isSame(this.props.msg.createdAt, 'day')) {
            date = moment(new Date(this.props.msg.createdAt)).format('HH:mm');
        }
        
        return (
            <div className={ msg + ' message wordwrap' }>
                <div className={ text + ' message-text d-flex flex-column' }>
                    <div className="name-text align-self-start">{ sender }</div>
                    <div>{ this.props.msg.text }</div>
                    <div className="date-text align-self-end">
                        { date }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null)(TextMessage);