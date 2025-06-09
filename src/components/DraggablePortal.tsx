import ReactDOM from 'react-dom';

export const DraggablePortal = ({ children }: { children: React.ReactNode }) => {
  const el = document.getElementById('drag-root');
  return el ? ReactDOM.createPortal(children, el) : null;
}; 