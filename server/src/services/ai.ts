export const suggestPriority = async (tasks: any[]) => {
    // @TODO integrate AI to fetch the tasks priority
    return tasks.map(t => ({ ...t, priority: 'medium' }));
  };
  