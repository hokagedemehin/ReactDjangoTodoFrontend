import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'

function App(props) {
  const [todoList, setTodoList] = useState([])
  const [activeItem, setActiveItem] = useState({id: null, title: '', completed: false})
  const [editing, setEditing] = useState(false)

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  useEffect(() => {
    fetchTask()
    // return () => {
    //   cleanup
    // }
  }, [])
  function fetchTask(){
    // console.log('fetching...')
    // axios.get(`http://127.0.0.1:8000/api/task-list/`)
    axios.get(`https://ibkreactdjango.herokuapp.com/api/task-list/`)
    .then( res => {
      // console.log(res.data)
    setTodoList(res.data)}
    )
    // .then(data => console.log(data))

    // fetch('http://127.0.0.1:8000/api/task-list/')
    // .then(response => response.json())
    // .then(data => 
    //   console.log(data)
    //   )
  };

  const handleChange = (e) => {
    // var name = e.target.name;
    var value = e.target.value;
    setActiveItem({...activeItem, title: value})
    // console.log(activeItem)
  }

  const handleSubmit = (e) => {
    let csrftoken = getCookie('csrftoken')
    e.preventDefault();
    // var url = 'http://127.0.0.1:8000/api/task-create/'
    var url = 'https://ibkreactdjango.herokuapp.com/api/task-create/'

    if (editing === true) {
      // url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
      url = `https://ibkreactdjango.herokuapp.com/api/task-update/${activeItem.id}/`
      setEditing(false)
    }

    axios.post(url, activeItem, {headers: {'X-CSRFTOKEN': csrftoken}},)
    .then(() =>{ 
      fetchTask()
      setActiveItem({id: null, title: '', completed:false} )
      // console.log(res)
    }).catch(err => console.log(err))
    // fetch(url, {
    //   method: 'POST',
    //   headers:{
    //     'Content-type':'application/json',
    //     'X-CSRFToken':csrftoken,
    //   },
    //   body: JSON.stringify(activeItem)
    // }).then(res => {
    //   fetchTask()
    //   setActiveItem({id: null, title: '', completed:false})
    //   console.log(res)
    // }).catch(err => console.log(err))

    document.getElementById('form').reset()
  }

  const startEdit = task =>{
    setActiveItem(task)
    setEditing(true)
    // console.log('start item: ',activeItem)
    // console.log('editing: ', editing)
  }

  const deleteItem =task => {
    let csrftoken = getCookie('csrftoken')
    // let url = `http://127.0.0.1:8000/api/task-delete/${task.id}/`
    let url = `https://ibkreactdjango.herokuapp.com/api/task-delete/${task.id}/`
    axios.delete(url, {headers: {'X-CSRFTOKEN': csrftoken}}, )
    .then(() => {
      fetchTask();
      // console.log(res)
    })
    .catch(err => console.log(err))
  }

  const strikeUnstrike = task => {
    task.completed = !task.completed;
    let csrftoken = getCookie('csrftoken')
    // let url = `http://127.0.0.1:8000/api/task-update/${task.id}/`
    let url = `https://ibkreactdjango.herokuapp.com/api/task-update/${task.id}/`
    let taskUpdate = {
      title: task.title,
      completed: task.completed
    }
    axios.post(url, taskUpdate, {headers: {'X-CSRFTOKEN': csrftoken}},)
    .then(() => {
      fetchTask();
      // console.log(res)
    })
  }

  return (
    <div className="container">
      <div id="task-container">
        <div  id="form-wrapper">
          <form onSubmit={handleSubmit} id="form">
            <div className="flex-wrapper">
              <div style={{flex: 6}}>
                  <input onChange={handleChange} className="form-control" id="title" value={activeItem.title}  type="text" name="title" placeholder="Add task.." />
                </div>

                <div style={{flex: 1}}>
                  <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                </div>
            </div>
          </form>
      
        </div>
        <div id="list-wrapper">
          {todoList.map((task, index) => {
            return(
              <div key={index} className="task-wrapper flex-wrapper">
                <div onClick={() => strikeUnstrike(task)} style={{flex:7}}>
                  {task.completed === false ? (<span>{task.title}</span>) : (<strike>{task.title}</strike>)}
                </div>
                <div style={{flex:1}}>
                  <button onClick={() => startEdit(task)}  className="btn btn-sm btn-outline-info">Edit</button>
                </div>

                <div style={{flex:1}}>
                    <button onClick={() => deleteItem(task)} className="btn btn-sm btn-outline-dark delete">del</button>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
