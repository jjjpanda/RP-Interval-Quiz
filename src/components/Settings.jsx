import React from 'react'
import {
    Button,
    Modal, 
    Radio,
    Slider,
    Checkbox,
    Switch,
    Space
} from 'antd'

import {
    SettingOutlined
} from '@ant-design/icons'

import Cookies from 'js-cookie'

import * as interval from '../lib/interval.js'

class Settings extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            direction: Cookies.get('direction') || 'up',
            difficulty: Cookies.get('difficulty') || 6,
            intervals: JSON.parse(Cookies.get('intervals')) || Settings.intervalArr('up', 6),
            speed: Cookies.get('speed') || "off"
        };
        console.log(this.state)
        Cookies.set('direction', this.state.direction, { expires: 21 })
        Cookies.set('difficulty', this.state.difficulty, { expires: 21 })
        Cookies.set('intervals', this.state.intervals, { expires: 21 })
        Cookies.set('speed', this.state.speed, { expires: 21 }) 
        this.props.updateSettings(this.state)
    }

    static intervalDissonanceArr = [
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

    static intervalArr = (direction, numberOfIntervals) => {
        let probabilities = []
        if(direction === 'both'){
            probabilities = Array(numberOfIntervals * 2).fill(0).map((o, i) => {
                if(i % 2 == 0){
                    return Settings.intervalDissonanceArr[i/2]
                }
                else {
                    return -1 * Settings.intervalDissonanceArr[(i-1)/2]
                }
                
            })
        }
        else{
            probabilities = Array(numberOfIntervals).fill(0).map((o, i) => {
                return (direction == 'down' ? -1 : 1) * Settings.intervalDissonanceArr[i]
            })
        }
        return probabilities
    }

    onDirectionChange = e => {
        this.setState((state) => ({
            direction: e.target.value,
            intervals: Settings.intervalArr(e.target.value, state.difficulty)
        }), () => {
            Cookies.set('direction', this.state.direction, { expires: 21 })
            Cookies.set('intervals', this.state.intervals, { expires: 21 }) 
            this.props.updateSettings(this.state)
        });
    };

    onDifficultyChange = value => {
        this.setState((state) => ({
            difficulty: value,
            intervals: Settings.intervalArr(state.direction, value)
        }), () => {
            Cookies.set('difficulty', this.state.difficulty, { expires: 21 })
            Cookies.set('intervals', this.state.intervals, { expires: 21 }) 
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
            Cookies.set('intervals', this.state.intervals, { expires: 21 })
            this.props.updateSettings(this.state)
        })
    }

    onSwitchChange = (checked) => {
        console.log(checked)
        this.setState(() => ({ 
            speed: (checked ? "on" : "off") 
        }), () => {
            Cookies.set('speed', this.state.speed, { expires: 21 })
            this.props.updateSettings(this.state)
        })
    }

    openModal = () => {
        this.setState(() => ({visible: true}))
    }

    closeModal = () => {
        this.setState(() => ({visible: false}))
    }

    renderAscendingCheckbox() {
        return [...interval.intervals].slice(12,24).map(i => {
            return (
                <Checkbox onChange= {(e) => {this.onCheckChange(e,i.semitones)}} checked={this.state.intervals.includes(i.semitones)} >{`${i.direction} ${i.name}`}</Checkbox>
            )
        })
    }

    renderDescendingCheckbox() {
        return [...interval.intervals].slice(0,12).reverse().map(i => {
            return (
                <Checkbox onChange= {(e) => {this.onCheckChange(e,i.semitones)}} checked={this.state.intervals.includes(i.semitones)} >{`${i.direction} ${i.name}`}</Checkbox>
            )
        })
    }   
    
    render() {
        return (
            <div>
                <Button shape="round" icon={<SettingOutlined />} onClick={this.openModal} />
                <Modal
                    closable={false}
                    visible={this.state.visible}
                    footer={<Button onClick={this.closeModal} >Ok</Button>}
                >
                    <Space>
                        Speed Mode:
                        <Switch checkedChildren="On" unCheckedChildren="Off" onChange={this.onSwitchChange} checked = {this.state.speed === 'on'} />
                        
                    </Space>

                    <br />

                    <Radio.Group onChange={this.onDirectionChange} value={this.state.direction}>
                        <Radio value={'up'}>Ascending</Radio>
                        <Radio value={'down'}>Descending</Radio>
                        <Radio value={'both'}>Both</Radio>
                    </Radio.Group>

                    <Slider min={3} max={12} onChange={this.onDifficultyChange} value={this.state.difficulty} />

                    <br />
                    <hr />
                    <br /> 

                    <Space direction={"vertical"}>
                        {this.renderAscendingCheckbox()}
                    </Space>
                    <Space direction={"vertical"}>
                        {this.renderDescendingCheckbox()}
                    </Space>

                </Modal>
            </div>
        )
    }
}

export default Settings