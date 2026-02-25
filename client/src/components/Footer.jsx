import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-brand">
          <span className="footer-copyright" aria-hidden="true">©</span> PizzaWizza
        </p>
        <p className="footer-dev">
          Developed by{' '}
          <a
            href="https://www.linkedin.com/in/piyush-sinha-91702a378"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            PIYUSH SINHA
          </a>
        </p>
      </div>
    </footer>
  )
}
