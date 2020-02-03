import Link from 'next/link';
import "./style.scss";

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div className="Header">
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/reports">
      <a style={linkStyle}>Reports</a>
    </Link>
  </div>
);

export default Header;
