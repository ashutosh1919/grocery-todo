import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);

  const publishLatest = () => {
    axios.get('http://localhost:3000/get-todos')
    .then(function (response) {
      console.log(response.data.data);
      setTodos(response.data.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  }

  useEffect(() => {
    publishLatest();
  }, [])


  const addTodo = todo => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append('item_name', todo.text);
    axios({
      method: "post",
      url: "http://localhost:3000/add-todo",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        publishLatest();
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });

    // const newTodos = [todo, ...todos];

    // setTodos(newTodos);
    // console.log(...todos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append('item_id', todoId);
    bodyFormData.append('item_name', newValue.text);
    axios({
      method: "post",
      url: "http://localhost:3000/update-todo",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        publishLatest();
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
    // setTodos(prev => prev.map(item => (item.id === todoId ? newValue : item)));
  };

  const removeTodo = id => {
    // const removedArr = [...todos].filter(todo => todo.id == id);
    // setTodos(removedArr);
    var bodyFormData = new FormData();
    bodyFormData.append('item_id', id);
    axios({
      method: "post",
      url: "http://localhost:3000/remove-todo",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        publishLatest();
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;
