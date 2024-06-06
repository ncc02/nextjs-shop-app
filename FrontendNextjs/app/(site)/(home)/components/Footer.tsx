import Link from 'next/link'
import { FaDribbble, FaFacebookMessenger, FaGithub, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="relative bg-slate-200 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap text-left lg:text-left">
          <div className="w-full lg:w-6/12 px-4">
            <h4 className="text-3xl fonat-semibold text-slate-700">Let&apos;s keep in touch!</h4>
            <h5 className="text-lg mt-0 mb-2 text-slate-600">
              Find us on any of these platforms, we respond 1-2 business days.
            </h5>
            <div className="mt-6 lg:mb-0 mb-6 flex">
              <div className="bg-white flex text-blue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                <FaTwitter />
              </div>
              <div className="bg-white flex text-blue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                <FaFacebookMessenger />
              </div>
              <div className="bg-white flex text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                <FaDribbble />
              </div>
              <div className="bg-white flex text-gray-800 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                <FaGithub />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-4 ml-auto">
                <span className="block uppercase text-slate-500 text-sm font-semibold mb-2">
                  Useful Links
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      Github
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      Free Products
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <span className="block uppercase text-slate-500 text-sm font-semibold mb-2">
                  Other Resources
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      MIT License
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
                      href={''}
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-slate-300" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <div className="text-sm text-slate-500 font-semibold py-1">
              <Link href={''} className="text-slate-500 hover:text-gray-800" target="_blank" />{' '}
              Notus JS by
              <Link className="text-slate-500 hover:text-slate-800" href={''}>
                Creative TTCN1
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
