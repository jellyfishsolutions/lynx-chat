import React from 'react'
import { connect } from 'react-redux'
import { services } from '../../services'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'
import 'moment/locale/it'
moment.locale('it')

class FileMessage extends React.Component {

    constructor() {
        super();
        this.state = {
            color: "white" 
        };
    }
    
    downloadFile = () => {
        services.getFile(JSON.parse(this.props.msg.text).id).then((res) => console.log(res));
    }
    
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
                    <div>
                        <a type="button" className="btn btn-outline-light m-2" 
                            href={ services.getHref(JSON.parse(this.props.msg.text).id) }
                            download={ JSON.parse(this.props.msg.text).name }
                            onMouseOver={ () => this.setState({ color: "#4e73df" }) }
                            onMouseLeave={ () => this.setState({ color: "white" }) }
                            onClick={ this.downloadFile }>
                            <FontAwesomeIcon icon={ faFileDownload } style={{ color: this.state.color }}/>
                        </a>
                        { JSON.parse(this.props.msg.text).name }
                    </div>
                    <div className="date-text align-self-end">
                        { date }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null)(FileMessage);