
// Fix the specific line with the type error
updateTaskStatus: async (taskId: number, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
  try {
    const updateData: any = { status };
    
    // If changing to in_progress and no start_time, set it
    if (status === 'in_progress') {
      const { data: task } = await supabase
        .from('tasks')
        .select('start_time')
        .eq('task_id', taskId)
        .single();
      
      if (!task.start_time) {
        updateData.start_time = new Date().toISOString();
      }
    }
    
    // If completing task, set end_time
    if (status === 'completed') {
      updateData.end_time = new Date().toISOString();
      
      // Calculate actual time
      const { data: task } = await supabase
        .from('tasks')
        .select('start_time')
        .eq('task_id', taskId)
        .single();
      
      if (task.start_time) {
        const startTime = new Date(task.start_time);
        const endTime = new Date();
        const diffInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        updateData.actual_time = Math.round(diffInHours * 10) / 10; // Round to 1 decimal place
      }
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('task_id', taskId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating task status:', error);
    // Use status parameter directly rather than passing it inside an object
    return apiRequest(`/tasks/${taskId}/status`, 'put', { status }, {});
  }
}
