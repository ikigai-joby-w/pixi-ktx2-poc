import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const linkStyle = (path: string) => ({
    padding: '8px 16px',
    backgroundColor: location.pathname === path ? '#0088cc' : '#333',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  });

  return (
    <nav style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      gap: '10px'
    }}>
      <Link
        to="/bunny"
        onClick={() => {
          window.location.href = '/bunny';
        }}
        style={linkStyle('/bunny')}
      >
        Bunny Game
      </Link>
      <Link
        to="/win"
        onClick={() => {
          window.location.href = '/win';
        }}
        style={linkStyle('/win')}
      >
        Win Effect
      </Link>
    </nav>
  );
};

export default Navigation; 