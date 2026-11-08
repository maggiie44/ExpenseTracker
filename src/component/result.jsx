import React, { useContext } from 'react'
import './result.css'
import DataContext from './context'

const result = () => {

    const {income,expense,reportAvg,entrie} = useContext(DataContext)



    return (
        <div className="result">
            <div className="result-item">
                Total Income
                <p>{income}</p>
                </div>
            <div className="result-item">
                Total Expense
                <p>{expense}</p>
            </div>
            <div className="result-item">
                Average Expense
                <p>{reportAvg}</p>
            </div>
            <div className="result-item">
                Entries
                <p>{entrie}</p>
            </div>
        </div>
    )
}

export default result