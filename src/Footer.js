import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>© {currentYear} Eero Timonen</p>
        <div className="footer-links">
            <a href="https://github.com/ETimonen" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://fi.linkedin.com/in/etimonen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <div className="footer-links">
            <p>Säädata <a href="https://open-meteo.com/">Open-Meteo</a></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
