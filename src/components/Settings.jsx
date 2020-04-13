import React from 'react'
import {
    Button,
    Modal, 
    Radio,
    Slider,
    Checkbox
} from 'antd'

const intervalDissonanceArr = [
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

const intervalArr = (direction, numberOfIntervals) => {
    let probabilities = []
    if(direction === 'both'){
        probabilities = Array(numberOfIntervals * 2).fill(0).map((o, i) => {
            if(i % 2 == 0){
                return intervalDissonanceArr[i/2]
            }
            else {
                return -1 * intervalDissonanceArr[(i-1)/2]
            }
            
        })
    }
    else{
        probabilities = Array(numberOfIntervals).fill(0).map((o, i) => {
            return (direction == 'down' ? -1 : 1) * intervalDissonanceArr[i]
        })
    }
    return probabilities
}

class Settings extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            direction: 'up',
            visible: false,
            difficulty: 6,
            intervals: intervalArr('up', 6)
        };
        this.props.updateSettings(this.state)
    }

    onDirectionChange = e => {
        this.setState({
            direction: e.target.value,
            intervals: intervalArr(e.target.value, this.state.difficulty)
        }, () => {
            this.props.updateSettings(this.state)
        });
    };

    onDifficultyChange = value => {
        this.setState({
            difficulty: value,
            intervals: intervalArr(this.state.direction, value)
        }, () => {
            this.props.updateSettings(this.state)
        });
    };

    onCheckChange = (e, semitones) => {
        console.log(e.target.checked)
        this.setState((state) => {
            if(e.target.checked){
                state.intervals.push(semitones)
            }
            else{
                state.intervals = state.intervals.filter(i => i != semitones)
            }
            return { intervals: state.intervals }
        }, () => {
            this.props.updateSettings(this.state)
        })
    }

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

                    <br />
                    <hr />
                    <br /> 
                    
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,12)}} checked={this.state.intervals.includes(12)} >Octave</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,11)}} checked={this.state.intervals.includes(11)} >Major Seventh</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,10)}} checked={this.state.intervals.includes(10)} >Minor Seventh</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,9)}} checked={this.state.intervals.includes(9)} >Major Sixth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,8)}} checked={this.state.intervals.includes(8)} >Minor Sixth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,7)}} checked={this.state.intervals.includes(7)} >Perfect Fifth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,6)}} checked={this.state.intervals.includes(6)} >Tritone</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,5)}} checked={this.state.intervals.includes(5)} >Perfect Fourth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,4)}} checked={this.state.intervals.includes(4)} >Major Third</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,3)}} checked={this.state.intervals.includes(3)} >Minor Third</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,2)}} checked={this.state.intervals.includes(2)} >Major Second</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,1)}} checked={this.state.intervals.includes(1)} >Minor Second</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-12)}} checked={this.state.intervals.includes(-12)} >Octave</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-11)}} checked={this.state.intervals.includes(-11)} >Major Seventh</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-10)}} checked={this.state.intervals.includes(-10)} >Minor Seventh</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-9)}} checked={this.state.intervals.includes(-9)} >Major Sixth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-8)}} checked={this.state.intervals.includes(-8)} >Minor Sixth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-7)}} checked={this.state.intervals.includes(-7)} >Perfect Fifth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-6)}} checked={this.state.intervals.includes(-6)} >Tritone</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-5)}} checked={this.state.intervals.includes(-5)} >Perfect Fourth</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-4)}} checked={this.state.intervals.includes(-4)} >Major Third</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-3)}} checked={this.state.intervals.includes(-3)} >Minor Third</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-2)}} checked={this.state.intervals.includes(-2)} >Major Second</Checkbox>
                    <Checkbox onChange= {(e) => {this.onCheckChange(e,-1)}} checked={this.state.intervals.includes(-1)} >Minor Second</Checkbox>

                </Modal>
            </div>
        )
    }
}

export default Settings