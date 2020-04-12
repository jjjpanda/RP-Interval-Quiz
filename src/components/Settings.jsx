import React from 'react'
import {
    Button,
    Modal, 
    Radio,
    Slider,
    Checkbox
} from 'antd'

import * as interval from '../lib/interval.js'

class Settings extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            direction: 'up',
            visible: false,
            difficulty: 6,
            intervals: interval.createProbabilityArr('up', 6, this.intervalDissonanceArr)
        };
        this.props.updateSettings(this.state)
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
            intervals: interval.createProbabilityArr(e.target.value, this.state.difficulty, this.intervalDissonanceArr)
        }, () => {
            this.props.updateSettings(this.state)
        });
    };

    onDifficultyChange = value => {
        this.setState({
            difficulty: value,
            intervals: interval.createProbabilityArr(this.state.direction, value, this.intervalDissonanceArr)
        }, () => {
            this.props.updateSettings(this.state)
        });
    };

    openModal = () => {
        this.setState(() => ({visible: true}))
    }

    closeModal = () => {
        this.setState(() => ({visible: false}))
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
                    
                    {/* <Checkbox onChange={onChange} >Octave</Checkbox>
                    <Checkbox onChange={onChange} >Major Seventh</Checkbox>
                    <Checkbox onChange={onChange} >Minor Seventh</Checkbox>
                    <Checkbox onChange={onChange} >Major Sixth</Checkbox>
                    <Checkbox onChange={onChange} >Minor Sixth</Checkbox>
                    <Checkbox onChange={onChange} >Perfect Fifth</Checkbox>
                    <Checkbox onChange={onChange} >Tritone</Checkbox>
                    <Checkbox onChange={onChange} >Perfect Fourth</Checkbox>
                    <Checkbox onChange={onChange} >Major Third</Checkbox>
                    <Checkbox onChange={onChange} >Minor Third</Checkbox>
                    <Checkbox onChange={onChange} >Major Second</Checkbox>
                    <Checkbox onChange={onChange} >Minor Second</Checkbox>

                    <Checkbox onChange={onChange} >Octave</Checkbox>
                    <Checkbox onChange={onChange} >Major Seventh</Checkbox>
                    <Checkbox onChange={onChange} >Minor Seventh</Checkbox>
                    <Checkbox onChange={onChange} >Major Sixth</Checkbox>
                    <Checkbox onChange={onChange} >Minor Sixth</Checkbox>
                    <Checkbox onChange={onChange} >Perfect Fifth</Checkbox>
                    <Checkbox onChange={onChange} >Tritone</Checkbox>
                    <Checkbox onChange={onChange} >Perfect Fourth</Checkbox>
                    <Checkbox onChange={onChange} >Major Third</Checkbox>
                    <Checkbox onChange={onChange} >Minor Third</Checkbox>
                    <Checkbox onChange={onChange} >Major Second</Checkbox>
                    <Checkbox onChange={onChange} >Minor Second</Checkbox> */}

                </Modal>
            </div>
        )
    }
}

export default Settings