import * as Tone from "tone";

//create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth().toMaster();
const semitone = Math.pow(2, 1/12)

let intervals = [
    {semitones: -12, ratio: Math.pow(semitone, -12), probability: 0, cProbability: 0, direction: "descending", name: "octave"},
    {semitones: -11, ratio: Math.pow(semitone, -11), probability: 0, cProbability: 0, direction: "descending", name: "major seventh"},
    {semitones: -10, ratio: Math.pow(semitone, -10), probability: 0, cProbability: 0, direction: "descending", name: "minor seventh"},
    {semitones: -9, ratio: Math.pow(semitone, -9), probability: 0, cProbability: 0, direction: "descending", name: "major sixth"},
    {semitones: -8, ratio: Math.pow(semitone, -8), probability: 0, cProbability: 0, direction: "descending", name: "minor sixth"},
    {semitones: -7, ratio: Math.pow(semitone, -7), probability: 0, cProbability: 0, direction: "descending", name: "perfect fifth"},
    {semitones: -6, ratio: Math.pow(semitone, -6), probability: 0, cProbability: 0, direction: "descending", name: "tritone"},
    {semitones: -5, ratio: Math.pow(semitone, -5), probability: 0, cProbability: 0, direction: "descending", name: "perfect fourth"},
    {semitones: -4, ratio: Math.pow(semitone, -4), probability: 0, cProbability: 0, direction: "descending", name: "major third"},
    {semitones: -3, ratio: Math.pow(semitone, -3), probability: 0, cProbability: 0, direction: "descending", name: "minor third"},
    {semitones: -2, ratio: Math.pow(semitone, -2), probability: 0, cProbability: 0, direction: "descending", name: "major second"},
    {semitones: -1, ratio: Math.pow(semitone, -1), probability: 0, cProbability: 0, direction: "descending", name: "minor second"},
    {semitones: 1, ratio: Math.pow(semitone, 1), probability: 0, cProbability: 0, direction: "ascending", name: "minor second"},
    {semitones: 2, ratio: Math.pow(semitone, 2), probability: 0, cProbability: 0, direction: "ascending", name: "major second"},
    {semitones: 3, ratio: Math.pow(semitone, 3), probability: 0, cProbability: 0, direction: "ascending", name: "minor third"},
    {semitones: 4, ratio: Math.pow(semitone, 4), probability: 0, cProbability: 0, direction: "ascending", name: "major third"},
    {semitones: 5, ratio: Math.pow(semitone, 5), probability: 0, cProbability: 0, direction: "ascending", name: "perfect fourth"},
    {semitones: 6, ratio: Math.pow(semitone, 6), probability: 0, cProbability: 0, direction: "ascending", name: "tritone"},
    {semitones: 7, ratio: Math.pow(semitone, 7), probability: 0, cProbability: 0, direction: "ascending", name: "perfect fifth"},
    {semitones: 8, ratio: Math.pow(semitone, 8), probability: 0, cProbability: 0, direction: "ascending", name: "minor sixth"},
    {semitones: 9, ratio: Math.pow(semitone, 9), probability: 0, cProbability: 0, direction: "ascending", name: "major sixth"},
    {semitones: 10, ratio: Math.pow(semitone, 10), probability: 0, cProbability: 0, direction: "ascending", name: "minor seventh"},
    {semitones: 11, ratio: Math.pow(semitone, 11), probability: 0, cProbability: 0, direction: "ascending", name: "major seventh"},
    {semitones: 12, ratio: Math.pow(semitone, 12), probability: 0, cProbability: 1, direction: "ascending", name: "octave"},
]

function cumulativeThreshold() {
    let c = 0
    for(let i of intervals){
        i.cProbability = i.probability + c
        c += i.probability
    }
    if(c < 1){
        intervals[23].cProbability = 1
    }
}

export function setProbability(probArray){
    for(let i of intervals){
        i.probability = 0
    }
    for(let p of probArray){
        intervals.find(i => i.semitones === p.semitones).probability = p.probability
    }
    cumulativeThreshold()
}


export function blankDistribution(){
    return intervals.map(i => {return {interval: `${i.direction} ${i.name}`, semitones: i.semitones, probability: -1}})
}

export function createProbabilityArr(direction, numberOfIntervals, intervalDissonanceArr){
    let probabilities = []
    if(direction === 'both'){
        probabilities = Array(numberOfIntervals * 2).fill(0).map((o, i) => {
            if(i % 2 == 0){
                return {semitones: intervalDissonanceArr[i/2], probability: 1/(2*numberOfIntervals)}
            }
            else {
                return {semitones: -1 * intervalDissonanceArr[(i-1)/2], probability: 1/(2*numberOfIntervals)}
            }
            
        })
    }
    else{
        probabilities = Array(numberOfIntervals).fill(0).map((o, i) => {
            return {semitones: (direction == 'down' ? -1 : 1) * intervalDissonanceArr[i], probability: 1/numberOfIntervals}
        })
    }
    return probabilities
}

export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomInterval(){
    console.log(intervals)
    const r = Math.random()
    
    for(let i of intervals){
        if(r < i.cProbability){
            console.log(r, i.semitones)
            return i.semitones
        }
    }
}

export function findInterval (semitones){
    return intervals.find(i => i.semitones === semitones)
}

export function playInterval (root, interval, callback){    
    synth.triggerAttackRelease(root, "8n");
    setTimeout(() => {
        synth.triggerAttackRelease(root * interval, "8n");
        callback()
    }, 500)
}


