import React, {useState} from 'react'
import Styles from "./Sleeper.module.css"


interface ISeat 
{
    numb: number
    seatNumber: string
    seatStatus: string
    seatType: string
    seatId: string
    setSeatid: (seatId: string) => void
}




function Sleeper({ numb, seatNumber, seatStatus, seatType, seatId, setSeatid } :ISeat ) {


const [bo, setBo] = useState<boolean>(false)
const [clr, setClr] = useState<string>("white")

const book = () => {
    setBo(bo => !bo)
    if(clr=="white")
    {
        setClr("green")
    }
    else{
        setClr("white")
    } 

    setSeatid(seatId)
}


    return (
        <div className={Styles.main}>
              {(seatStatus != "vacant")? (
                 <p  style={{backgroundColor:"gray"}}>{numb}</p>
            ):(
                <p  style={{backgroundColor:`${clr}`}} onClick={() => book()}>{numb}</p>
            )}
           
        </div>
    )
}

export default Sleeper
