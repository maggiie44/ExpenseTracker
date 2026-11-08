import React, { useEffect } from 'react'
import { useState } from 'react';
import transaction from './transaction';
import './edit.css'




const Edit = ({ saveEdit,cancelEdit,transactions,editId }) => {

        const [description, setDescription] = useState(editId.description);
        const [amount, setAmount] = useState(editId.amount);
        const [category, setCategory] = useState(editId.category);
        const [type, setType] = useState(editId.type);
        const [editBtnActive, setEditBtnActive] = useState(false);

 
    const isEditValid = () =>{
        const valid = description.trim() !== '' && amount > 0 && category !== ''
        setEditBtnActive(valid)
        return valid;
    }

    useEffect(()=>{

        isEditValid()
    },[description, amount, category])


       const handleSubmit =(e)=>{
        e.preventDefault();
            const newtransaction = {
                    ...editId,
                    description,
                    amount:Number(amount),
                    category,
                    type
            }
        saveEdit(newtransaction)
    }

    return (
        <>
            <form className='form' onSubmit={handleSubmit}>
                <h1>'Edit'</h1>
                <div className='form-header'>
                    <button type="button" className={type === 'income' ? 'type-active' : 'form-btn'} onClick={()=>{setType('income')}}>Money In</button>
                    <button type="button" className={type === 'expense' ? 'type-active' : 'form-btn'} onClick={()=>{setType('expense')}}>Money Out</button>
                </div>
                <h2>Description</h2>
                <input type="text" placeholder="Expense Description" value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
                <h2>Amount</h2>
                <input type="number" placeholder="Amount" value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
                <label>Category</label>
                <div className='category'>
                    <button type="button" className={category === 'food' ? "active" : "pill"} onClick={()=>{setCategory('food')}}>Food</button>
                    <button type="button" className={category === 'transport' ? "active" : "pill"} onClick={()=>{setCategory('transport')}}>Transport</button>
                    <button type="button" className={category === 'shopping' ? "active" : "pill"} onClick={()=>{setCategory('shopping')}}>Shopping</button>
                    <button type="button" className={category === 'entertainment' ? "active" : "pill"} onClick={()=>{setCategory('entertainment')}}>Entertainment</button>
                    <button type="button" className={category === 'health' ? "active" : "pill"} onClick={()=>{setCategory('health')}}>Health</button>
                    <button type="button" className={category === 'education' ? "active" : "pill"} onClick={()=>{setCategory('education')}}>Education</button>
                    <button type="button" className={category === 'bills' ? "active" : "pill"} onClick={()=>{setCategory('bills')}}>Bills</button>
                    <button type="button" className={category === 'other' ? "active" : "pill"} onClick={()=>{setCategory('other')}}>Other</button>
                </div>
                <button type="submit"className='form-btn' disabled = {!editBtnActive}  >Done Edit</button>
                <button type="submit"className='form-btn' onClick={()=>cancelEdit()}>Cancel</button>
            </form>
        </>
    
    )
}

export default Edit
