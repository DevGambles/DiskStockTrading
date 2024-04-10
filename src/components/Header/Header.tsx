import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut, getSession, SessionProvider } from "next-auth/react";

const Header = ({isOpen, toggleOpen}: any) => {

  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(session?.user.image);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const OnSignOut = async () => {
    await signOut({redirect: true, callbackUrl: "/auth"});
  };

  const onAlarm = async () => {
    // await signOut({redirect: true, callbackUrl: "/auth"});
  };

  const onInfo = async () => {
    // await signOut({redirect: true, callbackUrl: "/auth"});
  };

  return (
    <header className='header shadow-md'>
      <nav className='navbar w-100 flex flex-nowrap'>
        <button onClick={toggleOpen} className="flex flex-col justify-center items-center">
          <span className={`bg-main block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} >
          </span>
          <span className={`bg-main block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}> 
          </span>
          <span className={`bg-main block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}>
          </span>
        </button>
        <div className="relative ml-4">
          <input type="text" className="border border-gray-300 bg-gray-100 h-10 px-5 pr-10 rounded-full text-md focus:outline-none" placeholder="Search"/>
          <button type="submit" className="absolute left-0 top-0 mt-2 ml-4">
            <Image src="/ic_search.svg" alt="logo" width={24}  height={24}/>
          </button>
        </div>
        <div className="navbar-right">
          <div className="py-2 px-3 flex items-center">
            <button onClick={onAlarm} className="mr-8">
              <Image src="/ic_alarm.svg" alt="logo" width={24}  height={24}/>
            </button>
            <button onClick={onInfo} className="mr-8">
              <Image src="/ic_info.svg" alt="logo" width={24}  height={24}/>
            </button>
            <span className="text-[16px] mr-auto block pr-3">
              <b>{session?.user.name}</b>
            </span>
            <div className="dropdown">
              <button onClick={toggleMenu}>
                <Image className="rounded-full" src={imgSrc? imgSrc : "/avatar.png"} alt="logo" width={32}  height={32}/>
                <div className='avatar-notify'></div>
              </button>
              {isMenuOpen && (
                <div className="dropdown-content text-nowrap rounded-lg shadow-md border border-grey cursor-pointer">
                  <div
                    onClick={OnSignOut}
                    className="border border-white hover:bg-gray-300 text-xs uppercase font-bold px-8 py-2 rounded-md ease-linear transition-all duration-150"
                  >
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;