import React from 'react'
import {
    Button,
    Modal, 
    Radio,
    Slider,
    Checkbox,
    Switch,
    Typography,
    Space,
    Popover
} from 'antd'

import {
    SettingOutlined,
    InfoCircleOutlined
} from '@ant-design/icons'

import Cookies from 'js-cookie'

import * as interval from '../lib/interval.js'

class Settings extends React.Component{
    constructor(props){
        super(props)
        let cookieIntervals
        try {
            cookieIntervals = JSON.parse(Cookies.get('intervals'))
        } catch(e) {
            cookieIntervals = undefined
        }
        this.state = {
            visible: false,
            direction: Cookies.get('direction') || 'up',
            difficulty: parseInt(Cookies.get('difficulty')) || 6,
            intervals: cookieIntervals || Settings.intervalArr('up', 6),
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

            let dir;
            if(state.intervals.every(i => Math.sign(i) === 1)){
                dir = "up"
            }
            else if(state.intervals.every(i => Math.sign(i) === -1)){
                dir = "down"
            }
            else {
                dir = 'both'
            }

            return { intervals: state.intervals, direction: dir, difficulty: Math.ceil(state.intervals.length / 2) }
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

    increaseDifficulty = () => {
        console.log("IncREASE", this.state.intervals)
        for(let i of Settings.intervalDissonanceArr){
            const pIndex = this.state.intervals.findIndex(o => o === i)
            const nIndex = this.state.intervals.findIndex(o => o === -1 * i)
            if(pIndex == -1){
                this.onCheckChange({target: {checked: true}}, i)
                break;
            }
            else if(nIndex == -1){
                this.onCheckChange({target: {checked: true}}, -1 * i)
                break;
            }
            else{
                continue
            }
        }
    }

    openModal = () => {
        this.setState(() => ({visible: true}))
    }

    closeModal = () => {
        this.setState(() => ({visible: false}))
    }

    renderCheckbox(isAscending){
        const sIndex = isAscending ? 12 : 0;
        return [...interval.intervals].slice(sIndex,sIndex+12).reverse().map(i => {
            return (
                <Checkbox onChange= {(e) => {this.onCheckChange(e,i.semitones)}} checked={this.state.intervals.includes(i.semitones)} >{`${i.name}`}</Checkbox>
            )
        })
    }
    
    render() {
        return (
            <Popover content = {<Typography>Settings</Typography>} title={null} trigger="hover" >
                <Button shape="round" icon={<SettingOutlined />} onClick={this.openModal} />
                <Modal
                    closable={true}
                    visible={this.state.visible}
                    footer={<Button onClick={this.closeModal} >Ok</Button>}
                    onCancel={this.closeModal}
                    maskClosable
                >

                    <Typography.Title level={2}>Settings</Typography.Title>

                    <Space direction={'vertical'} style={{width: "100%"}}>
                        <Space style={{width: "100%"}}>
                            <Space direction={'vertical'} style={{textAlign: 'left'}}>
                                <Typography.Text strong>Direction</Typography.Text>
                                <Radio.Group onChange={this.onDirectionChange} value={this.state.direction}>
                                    <Radio value={'up'}>Ascending</Radio>
                                    <Radio value={'down'}>Descending</Radio>
                                    <Radio value={'both'}>Both</Radio>
                                </Radio.Group>
                            </Space>
                            <Space direction={'vertical'} style={{textAlign: 'left'}}> 
                                <Space>
                                    <Typography.Text strong>Speed Mode</Typography.Text>
                                    <Popover content = {<Typography>{`Next interval will play automatically\n once you get the correct answer.`}</Typography>} title={null} trigger="hover">
                                        <InfoCircleOutlined />
                                    </Popover>
                                </Space>
                                <Switch checkedChildren="On" unCheckedChildren="Off" onChange={this.onSwitchChange} checked = {this.state.speed === 'on'} />
                            </Space>
                        </Space>

                        <div>
                            <Typography.Text strong>Difficulty</Typography.Text>
                            <Slider min={1} max={12} onChange={this.onDifficultyChange} value={this.state.difficulty} />
                        </div>
                    </Space>
                   
                    <br />
                    <hr />
                    <br /> 

                    <div style={{textAlign: 'center'}}>
                        <Space direction={'vertical'} >
                            <Space>
                               <Typography.Text strong>Intervals</Typography.Text>
                                <Popover content = {<Typography>{`Select custom intervals you want to add/remove.`}</Typography>} title={null} trigger="hover">
                                    <InfoCircleOutlined />
                                </Popover> 
                            </Space>
                            
                            <Space>
                                <div style={{textAlign: 'left'}}>
                                    <Space direction={"vertical"}>
                                        <Typography>Ascending</Typography>
                                        {this.renderCheckbox(true)}
                                    </Space>
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <Space direction={"vertical"}>
                                        <Typography>Descending</Typography>
                                        {this.renderCheckbox(false)}
                                    </Space>
                                </div>
                            </Space>
                        </Space>
                    </div>
                   

                </Modal>
            </Popover>
        )
    }
}

export default Settings