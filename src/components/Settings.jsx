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
            direction: 'up',
            visible: false,
            difficulty: 6,
            intervals: []
        };
    }

    intervalDissonanceArr = [
        7, //Fifth
        12,//Octave 
        5, //Fourth
        4, //Major Third
        9, //Major Sixth
        2, //Major Second
        11,//Major Seventh
        3, //Minor Third
        8, //Minor Sixth
        1, //Minor Second
        10,//Minor Seventh
        6  //Tritone
    ]

    onDirectionChange = e => {
        this.setState({
            direction: e.target.value,
        });
    };

    onDifficultyChange = value => {
        let probabilities = []
        if(this.state.direction === 'both'){
            probabilities = Array(value * 2).map((o, i) => {
                if(i % 2 == 0){
                    return {semitones: this.intervalDissonanceArr[i], probability: 1/(2*value)}
                }
                else {
                    return {semitones: -1 * this.intervalDissonanceArr[i-1], probability: 1/(2*value)}
                }
                
            })
        }
        else{
            probabilities = Array(value).map((o, i) => {
                return {semitones: (this.state.direction == 'down' ? -1 : 1) * this.intervalDissonanceArr[i], probability: 1/value}
            })
        }

        this.setState({
            difficulty: value,
            intervals: probabilities
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
                    <Radio.Group onChange={this.onDirectionChange} value={this.state.direction}>
                        <Radio value={'up'}>Ascending</Radio>
                        <Radio value={'down'}>Descending</Radio>
                        <Radio value={'both'}>Both</Radio>
                    </Radio.Group>

                    <Slider min={3} max={12} onChange={this.onDifficultyChange} value={this.state.difficulty} />

                </Modal>
            </div>
        )
    }
}

export default Settings