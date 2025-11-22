import logo from '../assets/artLogo.png';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt='art logo'></img>
      </div>
      <h1>Artist Portfolio Portal</h1>
    </header>
  );
}

export default Header;
