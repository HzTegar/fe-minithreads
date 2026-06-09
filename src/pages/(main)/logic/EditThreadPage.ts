export const useEditThreadPage = () => {
  // Mock initial data
  const initialData = {
    title: 'Welcome to MiniThreads!',
    content: 'This is a simple forum built with React and TypeScript. Start by creating a new thread!',
    category: 'General',
    tags: ['welcome', 'react'],
  };

  const handleSubmit = (data: any) => {
    console.log('Updating thread:', data);
  };

  return {
    initialData,
    handleSubmit
  };
};

