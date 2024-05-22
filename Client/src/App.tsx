import React from 'react';
import './assets/scss/themes.scss';
import ParrainRouteIndex from 'Parrain/Routes/Index';




import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'




function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <ParrainRouteIndex />
    </DndProvider>
  );
}

export default App;
