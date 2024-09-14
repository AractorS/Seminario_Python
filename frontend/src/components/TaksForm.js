import React, { useState, useEffect } from 'react';
import api from '../api';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]); // Guardar las categorías
  const [category, setCategory] = useState('');     // Categoría seleccionada
  const [completed, setCompleted] = useState(false); // Estado completado

  useEffect(() => {
    fetchCategories(); // Cargar las categorías al cargar el componente
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTask = { title, description, category, completed };

    api.post('tasks/', newTask)
      .then(response => {
        onTaskAdded(response.data);  // Notificar que la tarea se ha añadido
        setTitle('');  // Limpiar el formulario
        setDescription('');
        setCategory('');  // Reiniciar la selección de categoría
        setCompleted(false); // Reiniciar el estado de completado
      })
      .catch(error => {
        console.error("Error al crear la tarea:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Categoría</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Seleccione una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          ¿Completada?
        </label>
      </div>
      <button type="submit">Agregar Tarea</button>
    </form>
  );
};

export default TaskForm;