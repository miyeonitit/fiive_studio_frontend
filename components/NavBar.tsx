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
              <Link href='/'>
                <a className='nav-link'>Home</a>
              </Link>
            </li>

            <li className='nav-item'>
              <Link href='/ivs'>
                <a className='nav-link'>IVS Video</a>
              </Link>
            </li>

            <li className='nav-item'>
              <Link href='/chime'>
                <a className='nav-link'>Chime meeting</a>
              </Link>
            </li>

            <li className='nav-item'>
              <Link href='/student'>
                <a className='nav-link'>Student view</a>
              </Link>
            </li>

            <li className='nav-item'>
              <Link href='/learner'>
                <a className='nav-link'>Teacher view</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
