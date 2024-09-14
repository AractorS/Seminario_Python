import React, { useState } from 'react';
import api from '../api';

const TaskEditForm = ({ task, onTaskUpdated, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSubmit = (event) => {
    event.preventDefault();
    api.put('task/${task.id}/',{ title, description })
      .then(response => {
        onTaskUpdated(response.data);
      })
      .catch(error => {
        console.error("Error al actualizar la tarea:", error);
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
        />
      </div>
      <div>
        <label>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Actualizar Tarea</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default TaskEditForm;