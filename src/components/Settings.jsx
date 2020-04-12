import React from 'react'
import {
    Button,
    Modal, 
    Radio,
    Slider 
} from 'antd'

class Settings extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value: 1,
            visible: false,
        };
    }

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    openModal = () => {
        this.setState(() => ({visible: true}))
    }

    closeModal = () => {
        this.setState(() => ({visible: false}), () => {
            this.props.updateSettings(this.state)
        })
    }
    
    render() {
        return (
            <div>
                <Button shape="round" icon="setting" onClick={this.openModal} />
                <Modal
                    visible={this.state.visible}
                    footer={<Button onClick={this.closeModal} >Ok</Button>}
                >
                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>A</Radio>
                        <Radio value={2}>B</Radio>
                        <Radio value={3}>C</Radio>
                    </Radio.Group>



                </Modal>
            </div>
        )
    }
}

export default Settings