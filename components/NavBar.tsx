import Link from 'next/link'

const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg bg-light'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='#'>
          LSS
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <Link href='/learner'>learner view</Link>
            </li>

            <li className='nav-item'>
              <Link href='/teacher'>teacher view</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
