'use client';

import { useState, useEffect } from 'react';

export default function Test2() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [theme, setTheme] = useState('light');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save theme to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const tabs = [
    { id: 'tab1', label: 'Todo List', content: 'tab1' },
    { id: 'tab2', label: 'Settings', content: 'tab2' },
    { id: 'tab3', label: 'About', content: 'tab3' }
  ];

  return (
    <div className={`min-h-screen p-8 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-purple-900' 
        : 'bg-gradient-to-br from-purple-50 to-pink-100'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Test Page 2 - Advanced Components
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Testing tabs, modals, local storage, and theme switching
          </p>
          
          {/* Theme Toggle */}
          <div className="mt-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Tab 1: Todo List */}
            {activeTab === 'tab1' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Todo List (with Local Storage)
                </h3>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Add a new todo..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={addTodo}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-800 dark:text-white'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {todos.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No todos yet. Add one above!</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Settings */}
            {activeTab === 'tab2' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <button
                      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Open Modal Test
                  </button>
                  
                  <button
                    onClick={() => {
                      localStorage.clear();
                      setTodos([]);
                      setTheme('light');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: About */}
            {activeTab === 'tab3' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  About This Test Page
                </h3>
                <div className="text-gray-600 dark:text-gray-300 space-y-3">
                  <p>This page demonstrates:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tab navigation</li>
                    <li>Local storage persistence</li>
                    <li>Theme switching</li>
                    <li>Modal dialogs</li>
                    <li>Todo list functionality</li>
                    <li>Responsive design</li>
                  </ul>
                  <p className="mt-4">
                    Built with Next.js 15, React 19, and Tailwind CSS 4.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Home
          </a>
          <a
            href="/test1"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Test Page 1
          </a>
          <a
            href="/network-test"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Network Test
          </a>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Modal Test
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This is a test modal. It demonstrates overlay functionality and can be closed by clicking the button below or outside the modal.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 