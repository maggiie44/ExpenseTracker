import React, { useContext } from 'react'
import './firstsec.css'
import DataContext from './context'

const firstsec = () => {

    const {balnce} = useContext(DataContext)
    return (
        <div className="firstsec">
            <div className="name-app">Expense Tracker</div>
            <div className="balance">
                <h3>
                    balnce
                </h3>
                <p>{balnce}</p>
            </div>
        </div>
    )
}

export default firstsec