import React from 'react'
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    withRouter,
} from 'react-router-dom';
import * as interval from '../lib/interval.js'

import {
    Button,
    Progress,
    Layout,
    Space,
    Popconfirm,
    Popover,
    Typography,
    message
} from 'antd'

import {
    ArrowRightOutlined,
    PlayCircleOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    RedoOutlined,
    CloseOutlined,
    CheckOutlined,
    SoundOutlined,
    NotificationOutlined,
    LeftCircleOutlined
} from '@ant-design/icons'

import Settings from './Settings.jsx'
import Results from './Results.jsx'
import Cookies from 'js-cookie'

class Quiz extends React.Component{
    constructor(props){
        super(props)

        interval.setProbability(interval.createProbabilityArr(JSON.parse(Cookies.get('intervals')) || Settings.intervalArr('up', 6)))
        
        this.state = {
            playing: false,
            firstPlay: true,
            numberOfQuestions: 1,
            numberCorrect: 0,
            correctInARow: 0,
            firstAttempt: true,
            playable: true,
            nextable: false,
            currentRoot: interval.randomInteger(150, 500),
            currentInterval: interval.randomInterval(),
            correctnessDistribution: interval.currentDistribution(),
            incorrectGuesses: [],
            correct: false,
            goBack: false,
            speed: false
        }
        this.settings = React.createRef()
        console.log(this.state.correctnessDistribution)
    }

    playInterval = () => {
        if(!this.state.playing) {
           this.setState(() => ({ playing: true }), () => {
                interval.playInterval(this.state.currentRoot, interval.findInterval(this.state.currentInterval).ratio, () => {
                    this.setState(() => ({ playing: false, firstPlay: false }))
                })
            })  
        }
    }

    nextInterval = () => {
        this.setState(() => ({
            firstPlay: true,
            firstAttempt: true,
            nextable: false,
            playable: true,
            currentInterval: interval.randomInterval(),
            currentRoot: interval.randomInteger(150, 500),
            incorrectGuesses: [],
            correct: false
        }), () =>{
            this.playInterval()
        })
    }

    sendAnswer = (semitones) => {
        console.log(this.state)
        console.log(semitones)
        if(semitones === this.state.currentInterval){
            if(this.state.firstAttempt){
                this.setState((state) => {
                    const index = state.correctnessDistribution.findIndex(i => semitones === i.semitones)
                    state.correctnessDistribution[index].correct++
                    state.correctnessDistribution[index].percent = 100 * state.correctnessDistribution[index].correct / (state.correctnessDistribution[index].correct + state.correctnessDistribution[index].incorrect)
                    if(state.correctInARow === 6){
                        this.settings.current.increaseDifficulty()
                        message.success('Difficulty Increased');
                    }
                    return {
                        numberCorrect: state.numberCorrect+1,
                        correctInARow: (state.correctInARow >= 6 ? 0 : state.correctInARow+1),
                        correctnessDistribution: state.correctnessDistribution,
                        numberOfQuestions: state.numberOfQuestions+1, 
                        nextable: true,
                        firstAttempt: false,
                        correct: true,
                    }
                }, () => {
                    setTimeout(() => {
                        if(this.state.speed === 'on'){
                            this.nextInterval()
                        }
                    }, 500)
                })
            }
            else{
                this.setState((state) => ({
                    nextable: true,
                    correct: true,
                }), () => {
                    setTimeout(() => {
                        if(this.state.speed === 'on'){
                            this.nextInterval()
                        }
                    }, 500)
                })
            }
        }
        else{
            if(this.state.firstAttempt){
                this.setState((state) => { 
                    state.incorrectGuesses.push(semitones)
                    const index = state.correctnessDistribution.findIndex(i => this.state.currentInterval === i.semitones)
                    state.correctnessDistribution[index].incorrect++
                    state.correctnessDistribution[index].percent = 100 * state.correctnessDistribution[index].correct / (state.correctnessDistribution[index].correct + state.correctnessDistribution[index].incorrect)
                    return {
                        numberOfQuestions: state.numberOfQuestions+1, 
                        correctInARow: 0,
                        firstAttempt: false,
                        incorrectGuesses: state.incorrectGuesses 
                    }    
                })
            }
            else{
                this.setState((state) => { 
                    state.incorrectGuesses.push(semitones)
                    return {
                        incorrectGuesses: state.incorrectGuesses 
                    }    
                })
            }
        }
    }

    renderButtons(isAscending){
        const sIndex = isAscending ? 12 : 0;
        return [...interval.intervals].slice(sIndex,sIndex+12).reverse().map(i => {
            return (
                <Button 
                    danger={this.state.incorrectGuesses.includes(i.semitones)} 
                    shape="round" 
                    icon={this.state.incorrectGuesses.includes(i.semitones) ? <CloseOutlined /> : (this.state.correct && i.semitones === this.state.currentInterval ? <CheckOutlined /> : (i.direction === 'ascending' ? <CaretUpOutlined /> : <CaretDownOutlined /> ))} 
                    onClick={() => {this.sendAnswer(i.semitones)}}
                    style={this.state.correct && i.semitones === this.state.currentInterval ? { color: "green", borderColor: "green" } : {}}
                >
                    {i.name}
                </Button>
            )
        })
    }

        
    render() {
        return (
            <Layout style={{ minHeight: '100vh', height:'100vh' }}>
                <Layout.Header>
                    <span>
                        <div style={{float: 'left', display: 'inline-block'}}>
                            <Popover content = {<Typography>Back</Typography>} title={null} trigger="hover"> 
                                <Popconfirm
                                    title="You sure? Your test progress will be erased."
                                    onConfirm={() => {this.setState(() => ({goBack: true}))}}
                                    onCancel={() => {this.setState(() => ({goBack: false}))}}
                                    okText = {'yes'}
                                    cancelText = {'no'}
                                    placement={'bottomLeft'}
                                >
                                    {this.state.goBack ? <Redirect to="/" /> : null}
                                    <Button shape="round" icon={<LeftCircleOutlined />} />
                                </Popconfirm>
                            </Popover>
                        </div>
                        <div style={{float: 'right', display: 'inline-block'}}>
                            <Results 
                                results = {this.state.correctnessDistribution}
                                numberCorrect = {this.state.numberCorrect}
                                numberOfQuestions={this.state.numberOfQuestions}
                            /> 
                            <Settings ref={this.settings} updateSettings={(settings) => {
                                this.setState(() => ({speed: settings.speed}))
                                console.log(settings)
                                interval.setProbability(interval.createProbabilityArr(settings.intervals))
                            }} /> 
                        </div>
                    </span>
                </Layout.Header>
                
                <Layout.Content style={{textAlign: 'center'}}>
                    
                        <Space direction={"vertical"} style={{ transform: `scale(${1.3})`, transformOrigin: 'top'}} >
                            <Space >
                                {this.state.playing ? <SoundOutlined style={{ fontSize: '16px' }}/> : <NotificationOutlined style={{ fontSize: '16px' }}/>}
                            </Space>

                            <Space direction={'horizontal'}>
                                <Button shape="round" disabled={!this.state.playable} icon={this.state.firstPlay ? <PlayCircleOutlined /> : <RedoOutlined />} onClick={this.playInterval} />
                                <Button shape="round" disabled={!this.state.nextable} icon={<ArrowRightOutlined />} onClick={this.nextInterval} />
                            </Space>

                            {/* <Typography>
                                {`${Math.round( 
                                    this.state.numberCorrect/this.state.numberOfQuestions*100 
                                *100)/100}% Correct`}
                            </Typography> */}
                            <Typography>
                                {`Correct: ${this.state.numberCorrect}/${this.state.numberOfQuestions}`}
                            </Typography>
                            <Progress
                                percent={this.state.numberCorrect/this.state.numberOfQuestions*100}
                                showInfo={false} 
                                type="line"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                trailColor={"#dddddd"}
                            />


                            <Space>
                                <div style={{textAlign: 'left'}}>
                                    <Space direction={"vertical"}>
                                        <Typography>Ascending</Typography>
                                        {this.renderButtons(true)}
                                    </Space>
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <Space direction={"vertical"}>
                                        <Typography>Descending</Typography>
                                        {this.renderButtons(false)}
                                    </Space>
                                </div>
                            </Space>                           
                        </Space>
                    
                </Layout.Content>
                
            </Layout>
        )
    }
}

export default Quiz