import ChatWidget from './ChatWidget';

export default function App() {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <h1
          style={{
            position: 'relative',
            zIndex: 1,
            color: '#1c1c1c',
            fontSize: '2rem',
            fontWeight: 700,
            margin: 0,
            marginBottom: '8px',
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '0.02em',
            borderBottom: '4px solid #E91E63',
            paddingBottom: '12px',
          }}
        >
          Dr. Jhonny Salomon
        </h1>
        <p
          style={{
            margin: 0,
            color: '#333',
            fontSize: '1rem',
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          The Plastic Surgery and Med Spa
        </p>
      </div>
      <footer
        style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        © 2026 Dr. Jhonny Salomon Plastic Surgery & Med Spa
      </footer>
      <ChatWidget />
    </div>
  );
}
