import React, { useState } from 'react';
import { StudentsPage } from './pages/StudentsPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { GradesPage } from './pages/GradesPage';

type Page = 'students' | 'subjects' | 'grades';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('students');

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <button
            className={`nav-link ${activePage === 'students' ? 'active' : ''}`}
            onClick={() => setActivePage('students')}
          >
            Студенты
          </button>
          <button
            className={`nav-link ${activePage === 'subjects' ? 'active' : ''}`}
            onClick={() => setActivePage('subjects')}
          >
            Предметы
          </button>
          <button
            className={`nav-link ${activePage === 'grades' ? 'active' : ''}`}
            onClick={() => setActivePage('grades')}
          >
            Оценки
          </button>
        </nav>
      </header>
      <main className="main">
        {activePage === 'students' && <StudentsPage />}
        {activePage === 'subjects' && <SubjectsPage />}
        {activePage === 'grades' && <GradesPage />}
      </main>
    </div>
  );
};

export default App;
