import React, { useState, useEffect } from 'react';
import '../styles.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', completed: false, category: '' });
  const [categories, setCategories] = useState([]);
  const [newComment, setNewComment] = useState({ taskId: '', content: '' });
  const [editingTask, setEditingTask] = useState(null); // Para gestionar el estado de edición

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tasks/');
      const data = await response.json();
      setTasks(data);
      console.log('Tasks fetched from API:', data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/categories/');
      const data = await response.json();
      setCategories(data);
      console.log('Categories fetched from API:', data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleTaskInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    if (editingTask) {
      handleUpdateTask();
    } else {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });
        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask({ title: '', description: '', completed: false, category: '' });
        console.log('Task created:', data);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await fetch('http://127.0.0.1:8000/api/task/${taskId}/', {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      console.log('Task deleted:', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateComment = async (taskId) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskId, content: newComment.content }),
      });
      const data = await response.json();
      console.log('Comment created:', data);
      setNewComment({ taskId: '', content: '' });
      fetchTasks(); // Refresh the task list to show the new comment
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleEditTask = (task) => {
    setNewTask({ title: task.title, description: task.description, completed: task.completed, category: task.category });
    setEditingTask(task);
  };

  const handleUpdateTask = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tasks/${editingTask.id}/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks(tasks.map((task) => (task.id === editingTask.id ? data : task)));
      setNewTask({ title: '', description: '', completed: false, category: '' });
      setEditingTask(null);
      console.log('Task updated:', data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>

      {/* Formulario para agregar o editar una tarea */}
      <h2>{editingTask ? 'Editar Tarea' : 'Agregar Tarea'}</h2>
      <input
        type="text"
        name="title"
        placeholder="Título"
        value={newTask.title}
        onChange={handleTaskInputChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Descripción"
        value={newTask.description}
        onChange={handleTaskInputChange}
      />
      <select name="category" value={newTask.category} onChange={handleTaskInputChange}>
        <option value="">Seleccione Categoría</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={handleCreateTask}>
        {editingTask ? 'Actualizar Tarea' : 'Agregar Tarea'}
      </button>

      {/* Listado de Tareas */}
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className='task-item ${task.completed ? '>
              {task.title} - {task.completed ? 'Completada' : 'Pendiente'}
              <button className="btn btn-danger" onClick={() => handleTaskDelete(task.id)}>Eliminar</button>
              <button className="btn btn-primary" onClick={() => handleEditTask(task)}>Editar</button>

              {/* Comentarios de la Tarea */}
              {task.comments && task.comments.length > 0 ? (
                <ul className="comment-section">
                  {task.comments.map((comment) => (
                    <li key={comment.id} className="comment">
                      {comment.content} - {new Date(comment.created_at).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay comentarios para esta tarea</p>
              )}

              {/* Formulario para agregar comentarios */}
              <input
                type="text"
                placeholder="Agregar comentario"
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              />
              <button className="btn btn-secondary" onClick={() => handleCreateComment(task.id)}>Agregar Comentario</button>
            </li>
          ))
        ) : (
          <p>No hay tareas disponibles</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;