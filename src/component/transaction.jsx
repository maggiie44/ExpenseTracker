import React, { useState } from 'react'
import './transaction.css'

const transaction = ({transactions,startEdit,startRemove}) => {


  const [itemCat, setItemCat] = useState('all')


  const filterite = itemCat === 'all' ? transactions : transactions.filter(item => item.type === itemCat)



  return (
    <div className="transaction">
      <h2>Transaction</h2>
      <div className="pill-container">
        <button className={itemCat === "all" ? 'active' : 'pill'} onClick={()=>{setItemCat("all")}}>All</button>
        <button className={itemCat === "income" ? 'active' : 'pill'} onClick={()=>{setItemCat("income")}}>Income</button>
        <button className={itemCat === "expense" ? 'active' : 'pill'} onClick={()=>{setItemCat("expense")}}>Expenses</button>
      </div>
      <div className="transaction-list">
  
        {filterite.map((item) => (
          <div className={item.type} key={item.id}>
            <div className="item-description">
              <h3>{item.description}</h3>
              <span className="pill-type">{item.category ?? item.catagory ?? 'Uncategorized'}</span>
              <span>{item.date}</span>
            </div>
            <div className="item-amount">
              <h3>${item.amount}</h3>
              <button className="transaction-btn" onClick={() => startEdit(item)}>Edit</button>
              <button className="transaction-btn"onClick={()=>startRemove(item)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default transaction