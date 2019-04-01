import React, { Component } from 'react';

class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            closeBtn : React.createRef()
        }
    }
    
    componentDidMount() {
        this.props.closeModal(() => {
            this.state.closeBtn.current.click();
        });
     }

    render() { 
        return (
            <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby='modalTitle' aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id='modalTitle'>{this.props.title}</h5>
                            <button ref={this.state.closeBtn} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children[0]}
                        </div>
                        <div className='modal-footer'>
                            {this.props.children[1]}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;