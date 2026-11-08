import React,{useState , useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';

import './form.css'




const form = (props) =>{
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [isBtnActive, setIsBtnActive] = useState(false);


    const handleSubmit =(e)=>{
        e.preventDefault();
        
          const newtransaction = {
            id:uuidv4(),
            description: description,
            amount : parseInt(amount),
            category : category || 'other',
            type : type
          }
  

          props.onAddTransaction(newtransaction)
          setDescription('')
          setAmount('')
          setCategory('')
          setType('')
         

    }



    const isFormValid = () =>{
        const valid = description.trim() !== '' && amount > 0  && type !==''
        setIsBtnActive(valid)
        return valid;
    }


    useEffect(() =>{
        isFormValid()
    },[description,amount,type,category])




    
    return(
        <>
            <form className='form' onSubmit={handleSubmit}>
                <h1>'New Transaction'</h1>
                <div className='form-header'>
                    <button type="button" className={type === 'income' ? 'type-active' : 'form-btn'} onClick={()=>{setType('income')}}>Money In</button>
                    <button type="button" className={type === 'expense' ? 'type-active' : 'form-btn'} onClick={()=>{setType('expense')}}>Money Out</button>
                </div>
                <h2>Description</h2>
                <input type="text" placeholder="Expense Description" value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
                <h2>Amount</h2>
                <input type="text" placeholder="Amount" value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
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
                <button type="submit"className='form-btn' disabled={!isBtnActive} >Add Expense</button>
            </form>
        </>
    )
}
export default form