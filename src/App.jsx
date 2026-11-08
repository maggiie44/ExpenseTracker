import { useState, createContext, useContext, useEffect } from "react";
import "./App.css";
import Firstsec from "./component/firstsec";
import Result from "./component/result";
import Form from "./component/form";
import Transaction from "./component/transaction";
import Edit from "./component/edit";
import DataContext from "./component/context";
import OcrApp from "./component/ocrsec";
import SlipAmountOCR from "./component/slipAmountOCR";


function App() {
  const mockdata = [
    {
      id: 1,
      description: "Grocery shopping",
      amount: 100,
      type: "expense",
      category: "Food",
      date: "2023-10-01",
    },
    {
      id: 2,
      description: "Salary",
      amount: 2000,
      type: "income",
      category: "Food",
      date: "2023-10-01",
    },
    {
      id: 3,
      description: "Dinner out",
      amount: 50,
      type: "expense",
      category: "Food",
      date: "2023-10-02",
    },
  ];

  const [transactions, setTransactions] = useState(mockdata);
  const [editId, setEditId] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const [reportIncome, setReportIncome] = useState(0);
  const [reportExpense, setReportExpense] = useState(0)
  const [reportAvg, setReportAvg] = useState(0)
  const [entrie, setEntrie] = useState('')
  const [balnce, setBalnce] = useState(0)
//  const [ocrResult, setOcrResult] = useState('');
  const onAddTransaction = (transaction) => {
    setTransactions((prevTransactions) => [transaction, ...prevTransactions]);
  };

  const startEdit = (transaction) => {
    setEditId(transaction);
  };

  const saveEdit = (updateTran) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === updateTran.id ? updateTran : item)),
    );
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const startRemove = (tran) => {
    const newtrans = transactions.filter((item) => item.id !== tran.id);
    setTransactions(newtrans);
  };

  useEffect(()=>{
    const typeamount = transactions.map (item=> item.type)
    const income = transactions.filter((item)=> item.type === "income").reduce((sum,item)=> sum+item.amount,0)
    const expense = transactions.filter((item) => item.type === "expense").reduce((sum, item)=> sum + item.amount,0)
    const filterexpense = transactions.filter((item)=> item.type === "expense")
    const expenseAVG =  expense / filterexpense.length
    const reportEnrie = transactions.length
    const balnce = income - expense

    console.log(filterexpense)
    setReportIncome(income)
    setReportExpense(expense) 
    setReportAvg(expenseAVG)
    setEntrie(reportEnrie)
    setBalnce(balnce)
  },[transactions])


  return (
    <DataContext.Provider 
      value={{
        income : reportIncome,
        expense : reportExpense,
        reportAvg : reportAvg,
        entrie : entrie,
        balnce : balnce
      }}>
      <div className="App">
        <Firstsec />  
        <Result />

        {editId ? (
          <Edit
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            transactions={transactions}
            editId={editId}
          />
        ) : (
          <Form onAddTransaction={onAddTransaction} />
        )}
        <Transaction
          transactions={transactions}
          startEdit={startEdit}
          startRemove={startRemove}
        />
        <SlipAmountOCR></SlipAmountOCR>
      </div>
    </DataContext.Provider>
  );
}

export default App;
