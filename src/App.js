import React, {useState, useEffect} from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
// uuid cria id's dinamicos
import {v4 as uuidv4} from 'uuid';

// initialExpenses aqui foi utilizado somente para desenvolvermos o App
/* const initialExpenses = [
  {
    id: uuidv4(),
    charge:"rent",
    amount: 1600},
  {
    id: uuidv4(),
    charge:"car payment",
    amount: 400},
  {
    id: uuidv4(),
    charge:"credit card bill",
    amount: 1200},
]
*/
// Capturando os itens para localStorage
const initialExpenses = localStorage.getItem("expenses") ?
JSON.parse(localStorage.getItem("expenses")) : [];

function App() {

  // ***** state values *****
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense -> state charge sera modificado pelo input do form
  const [charge, setCharge] = useState('');
  // single amount -> state amount sera modificado pelo input do form
  const [amount, setAmount] = useState('');
  
  // alert
  const [alert, setAlert] = useState({show: false});
  // edit
  const [edit, setEdit] = useState(false);
  // edit item
  const [id, setId] = useState(0);

  // ***** useEffect *****
  useEffect(() => {
    console.log('we called useEffect');
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  // ***** functionality *****

  // handle charge
  const handleCharge = (e) => {
    // console.log(`charge : ${e.target.value}`);
    setCharge(e.target.value);
  };

  // handle amount
  const handleAmount = (e) => {
    // console.log(`amount : ${e.target.value}`);
    setAmount(e.target.value);
  };

  // handle alert
  const handleAlert = ({type, text}) => {
    setAlert({show: true, type, text});
    setTimeout(() => {
      setAlert({show: false});
    },2000)
  }

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(charge,amount);
    if(amount > 0 && charge !== '') {
      if(edit) {
        let tempExpenses = expenses.map((exp) => {
          return exp.id === id ? {...exp, charge: charge, amount: amount }
          : exp
        });
        setExpenses(tempExpenses);
        // setEdit come back to false
        setEdit(false);
        handleAlert({type: 'success', text: 'item edited'});
      } else {
        const singleExpense = { id: uuidv4(), charge, amount };
          setExpenses([...expenses, singleExpense]);
          handleAlert({type: 'success', text: 'item added'})
      }

      setCharge('');
      setAmount('');
    } else {
      // handle alert called
      handleAlert({type: 'danger', text: `charge can't be empty value
      and amount value has to be bigger than zero`})
    }

  }

  // clear all items
  const clearItems = () => {
    // console.log('cleared items');
    setExpenses([]);
    handleAlert({type: 'danger', text: 'all items deleted'});
  };
  // handle delete
  const handleDelete = (id) => {
    // console.log(`item deleted : ${id}`);
    let tempExpenses = expenses.filter((exp) => 
      exp.id !== id
    );
    // console.log(tempExpenses);
    setExpenses(tempExpenses);
    handleAlert({type: 'danger', text: 'item deleted'});
  };
  // handle edit
  const handleEdit = (id) => {
    // console.log(`item edited : ${id}`);
    let expenseEdit = expenses.find((exp) =>
    exp.id === id);
    // console.log(expenseEdit);
    let {charge, amount} = expenseEdit;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }

  return (
    <>
      {alert.show && <Alert type={alert.type}
      text={alert.text} />}
      <Alert />
      <h1>Andre's calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList 
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        total spending :{""}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
