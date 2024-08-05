import React,{useEffect, useState} from 'react';

import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App(){
    const [isCompleteScreen,setIsCompleteScreen] = useState(false); // State to toggle between todo list and completed tasks view
    const [allTodos, setTodos] =useState([]); // State for managing all todos and completed todos
    const [newTitle,setNewTitle]=useState(""); // State for the new todo title input
    const [newDescription,setNewDescription]=useState("");// State for the new todo description input
    const [completedTodos,setCompletedTodos]=useState([]);
    const [currentEdit,setCurrentEdit]=useState("");
    const [currentEditedItem, setCurrentEditedItem]=useState("");
    // function to add a new task 
    const handleAddTodo=()=>{
        let newTodoItem={
            title:newTitle,
            description:newDescription
        }
        // update the tools array with the new todo items
        let updatedTodoArr=[...allTodos];
        updatedTodoArr.push(newTodoItem);
        setTodos(updatedTodoArr);

        // save the updated todos array to local storage
        localStorage.setItem('todolist',JSON.stringify(updatedTodoArr))
    };

    // function to delete a todo task
    const handleDeleteTodo=(index)=>{
        // remove the todo item at the specified index
        let reducedTodo=[...allTodos];
        reducedTodo.splice(index,1)

        // update the local storage and state with the modified todos array
        localStorage.setItem('todolist',JSON.stringify(reducedTodo));
        setTodos(reducedTodo)
    }

    // function to handle completes task
    const handleCompleted=(index)=>{
        // fetching the system date and time
        let now=new Date();
        let dd=now.getDate();
        let mm=now.getMonth()+1; // adjust month to be 1-indexed
        let yyyy=now.getFullYear();
        let h=now.getHours();
        let m=now.getMinutes();
        let s=now.getSeconds();
        
        // Format the completion timestamp
        let completedOn =dd+'-'+mm+'-'+yyyy+' at '+h+':'+m+':'+s;

        // Create a new item with completion timestamp
        let filteredItem={
            ...allTodos[index], // ... is used to destruture 
            completedOn: completedOn
        }

        // Create a new array of completed todos with the newly completed item added
        let updatedCompletedArr=[...completedTodos];
        updatedCompletedArr.push(filteredItem);

         // Update state and local storage with the new completed todos array
        setCompletedTodos(updatedCompletedArr);
        handleDeleteTodo(index); // remove the todo from the same list
        localStorage.setItem('completedTodos',JSON.stringify(updatedCompletedArr))
    }

    // function to delete completed task
    const handleDeleteCompletedTodo=(index)=>{
        let reducedTodo=[...completedTodos]; // making a copy of completed todos in reduced todo 
        reducedTodo.splice(index,1);

        localStorage.setItem('completedTodos',JSON.stringify(reducedTodo));
        setCompletedTodos(reducedTodo);

    }

    // fetch saved todos and completed todos from local storage
    useEffect(()=>{
        // Retrieve and parse saved tools and completed tools from local storage
        let savedTodo=JSON.parse(localStorage.getItem('todolist')) // convert the local storage (JSON) string into an array  
        let savedCompletedTodos=JSON.parse(localStorage.getItem('completedTodos')) // convert the local storage (JSON) string into an array
        
        // Update state with retrieved data if available
        if(savedTodo){
            setTodos(savedTodo);
        }
        if(savedCompletedTodos){
            setCompletedTodos(savedCompletedTodos)
        }
    },[]) //  Empty dependency array means this runs once after the initial render

    // function to handle the edit of created task
    const handleEdit=(index,item)=>{
        setCurrentEdit(index);
        setCurrentEditedItem(item);
    }

    // function to update the title
    const handleUpdateTitle=(value)=>{
        setCurrentEditedItem((prev)=>{
            return{...prev,title:value}
        })
        
    }

    // function to update the description
    const handleUpdateDescription=(value)=>{
        setCurrentEditedItem((prev)=>{
            return{...prev,description:value}
        })
    }

    // function to update the edit in the task list
    const handleUpdateTodo=()=>{
        let newTodo=[...allTodos];
        newTodo[currentEdit]=currentEditedItem;
        setTodos(newTodo);
        setCurrentEdit("");
    }

    return(
        <div className="App">
            <h1>ToDo-List</h1>

            <div className='todo-wrapper'>
                <div className='todo-input'>
                    <div className='todo-input-item'>
                        <label>Title</label>
                        <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="New ToDo"/>
                    </div>
                    <div className='todo-input-item'>
                        <label>Description</label>
                        <input type="text" value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder="Description.."/>
                    </div>
                    <div className='todo-input-item'>
                        <button type='button' onClick={handleAddTodo} className='primaryBtn'>Add</button>
                    </div>
                    </div>
                    <div className='btn-area'>
                        <button type='button' className={`secondaryBtn ${isCompleteScreen===false && 'active'}`} onClick={()=>setIsCompleteScreen(false)} >ToDo</button>
                        <button type='button' className={`secondaryBtn ${isCompleteScreen===true && 'active'}`} onClick={()=>setIsCompleteScreen(true)}>Completed</button>
                    </div>
                    <div className='todo-list'>
                        {isCompleteScreen===false && allTodos.map((item,index)=>{

                            if (currentEdit===index){
                                return(
                                    <div className='edit_wrapper'>
                                        <input placeholder='Updated Title'onChange={(e)=>handleUpdateTitle(e.target.value)} value={currentEditedItem.title}/>
                                        <textarea placeholder='Updated Title'rows={4} onChange={(e)=>handleUpdateDescription(e.target.value)} value={currentEditedItem.description}/>
                                        <button type='button' onClick={handleUpdateTodo} className='primaryBtn'>Update</button>
                                    </div>
                                )
                            }
                            else{
                            return(
                                <div className='todo-item-list' key={index}>
                                    <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    </div>
                                    <div>
                                        <AiOutlineDelete className='icon' onClick={()=>handleDeleteTodo(index)} title='Delete?'></AiOutlineDelete>
                                        <BsCheckLg className='check-icon' onClick={()=>handleCompleted(index)} title='Complete?' ></BsCheckLg>
                                        <AiOutlineEdit className="edit-icon" onClick={()=>handleEdit(index,item)} title='Edit?'/>
                                    </div>
                                </div>
                            );}
                        })}

                        {isCompleteScreen===true && completedTodos.map((item,index)=>{
                            return(
                                <div className='todo-item-list' key={index}>
                                    <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <p><small>Completed on: {item.completedOn}</small></p>
                                    </div>
                                    <div>
                                        <AiOutlineDelete className='icon' onClick={()=>handleDeleteCompletedTodo(index)} title='Delete?'></AiOutlineDelete>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
            </div>
        </div>
    );
}

export default App;
