import React,{useState,useEffect} from "react";
import { Link } from 'react-router-dom';
import Navbar from '../nav-components/navbar/Navbar'
import './chat.css'
import io from "socket.io-client";
import NewToDo from "./NewToDo";
import DragDrop from "./DragDrop";

// menu-nav icons import
import ListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CloseIcon from '@material-ui/icons/Close';

let socket;
const PORT = 'http://localhost:5000/';

const Chat = (props) => {
  const id = props.location.pathname
  var n = id.indexOf("/", 6);
  var res = id.slice(6, n);
  const length = id.length
  const boardName = id.slice(n+1,length)
  
  const[chats,setChats]=useState('')
  const[change,setChange]=useState(true)
  const [edit,setEdit] = useState('')
  // const [addList,setAddList] = useState(false)
  const [addInputTodo,setAddInputtodo] = useState(false)
  const [addNewInput,setAddNewInput] = useState('')

  useEffect(() => {
    const id = props.location.pathname
    const n = id.indexOf("/", 6);
    const res = id.slice(6, n);
    const length = id.length
    const chatroom = id.slice(n+1,length)

    socket = io(PORT)
    // setRoom(chatroom)
    socket.emit("join", (chatroom))
    socket.on("oldmessage", (boardDetails) => {
      console.log(boardDetails)

        // setChatcardID(boardDetails)
        // setDB(boardDetails)
        setChats(boardDetails)
    })
}, [PORT,change])

  const addTodo = (e,InputValues,i,setAddtodo,chatroom) => {
    console.log(e,'aaa');
    const values = {e,InputValues,i,chatroom}
    setAddtodo(false)

    console.log('front');

    socket.emit('newTodoValue',values)
    setChange(!change)
    socket.on('value',(value)=>{
      console.log(value,'awsfresfsgsg');
    })
    
    socket.on('boards',(boards)=>{
      console.log(boards,'sfdsgdsgfsg');
    })
    
  }

  return (
    <div className='chat-bg'>
        <nav className='menu-nav'>
          <div>
            <ListIcon className='listicon'></ListIcon>
            <Link to={`/dashboard/${res}`}><HomeIcon className='homeicon'></HomeIcon></Link>
            <DashboardIcon className='dashboardicon'></DashboardIcon>
            <SearchIcon className='searchicon'></SearchIcon>
          </div> 
          <h4 className='trello'>Trello</h4>
          <div>
            <AddIcon className='addicon'></AddIcon>
            <InfoIcon className='infoicon'></InfoIcon>
            <NotificationsNoneIcon className='notifyicon'></NotificationsNoneIcon>
            <AccountCircleIcon className='avataricon'></AccountCircleIcon>
          </div>
        </nav>
        <Navbar boardName={boardName}/>

        {chats && chats.map(e=>{
          return(
            <Grid
            container
            direction="row"
            alignItems="flex-start"
            >
            {e.message.map((e,i)=>{
              console.log(e)
            return(
                <div className='todo_card'>
                  <div className='todo_card_title'>
                    <h4>{e.topic}</h4>
                    <MoreHorizIcon className='more_icon'></MoreHorizIcon>
                  </div>
                  {e.message.map((e)=>{
                    console.log(e);
                    return(
                      <input className='card_input' onChange={e => setEdit(e.target.value)} value={e}/>
                    )
                  })}
                  <NewToDo i={i} addTodo={addTodo} />
                </div>
            )
            })}
            {addInputTodo ? 
            <div>
              <div className='input__div'><input className='card_input2' onChange={e => setAddNewInput(e.target.value)}/>
                <div className='btn_close'>
                  <button className='add_btn'>Add</button>
                  <div className='closeicon'><CloseIcon  onClick={()=>{setAddInputtodo(false)}}></CloseIcon></div>
                </div>
              </div>
            </div>
            :
            <div className='add_list'>
              <button className='card__plus' onClick={()=>setAddInputtodo(true)}><span>+</span> Add another card</button>
            </div>

          }
             
          </Grid>
          )
        })}
      {/* <DragDrop/> */}
    </div>
  );
}

export default Chat;
