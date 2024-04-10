import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import { animated } from "react-spring";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard } from '@fortawesome/free-solid-svg-icons/faDashboard';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { faCalculator } from '@fortawesome/free-solid-svg-icons/faCalculator';
import { faTrademark } from '@fortawesome/free-solid-svg-icons/faTrademark';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { faTools } from '@fortawesome/free-solid-svg-icons/faTools';
import { faDivide } from '@fortawesome/free-solid-svg-icons/faDivide';
import Image from 'next/image';
import { faFileCircleCheck } from '@fortawesome/free-solid-svg-icons/faFileCircleCheck';

const Sidebar = ({style, hideSidebar}: any) => {
  const router = useRouter();
  const { data: session } = useSession();
  const sidebar = useRef(null);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (sidebar.current) {
        let rect = (sidebar.current as HTMLElement).getBoundingClientRect();
        if (rect.x <= e.x && e.x <= rect.x + rect.width && rect.y <= e.y && e.y <= rect.y + rect.height) {
          console.log("in");
        }
        else {
          console.log("out");
          hideSidebar();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebar]);

  return (
    <animated.div className='sidebar flex flex-col' style={style} ref={sidebar}>
      <Image src="/left_top_back.svg" className='left_top_back' alt="logo" width={250}  height={200} objectFit='cover'/>
      <div className='logo text-center flex flex-nowrap items-center pl-8'>
        <Link href="/" style={{display: 'flex', alignItems: 'center'}}>
          <Image src="/logo.png" alt="logo" width={48}  height={48}/>
          <span className='text-nowrap'>&nbsp;D I S K</span>
        </Link>
      </div>
      <ul className='navbar flex flex-row overflow-y-auto w-100'>
        <li className='link'>
          <Link href="/" className={router.pathname === '/' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faDashboard}
            ></FontAwesomeIcon>
            Dashboard
          </Link>
        </li>
        <li className='link'>
          <Link href="/verify" className={router.pathname === '/verify' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faFileCircleCheck}
            ></FontAwesomeIcon>
            Verify
          </Link>
        </li>
        <li className='link'>
          <Link href="/logbook" className={router.pathname === '/logbook' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faBook}
            ></FontAwesomeIcon>
            LogBook
          </Link>
        </li>
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/tradebook" className={router.pathname === '/tradebook' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faTrademark}
            ></FontAwesomeIcon>
            TradeBook
          </Link>
        </li>}
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/admin" className={router.pathname === '/admin' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faDashboard}
            ></FontAwesomeIcon>
            Admin Dashboard
          </Link>
        </li>}
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/admin/user" className={router.pathname === '/admin/user' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faUsers}
            ></FontAwesomeIcon>
            User Management
          </Link>
        </li>}
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/disk_settings" className={router.pathname === '/disk_settings' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faFloppyDisk}
            ></FontAwesomeIcon>
            DISK Settings
          </Link>
        </li>}
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/invest" className={router.pathname === '/invest' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faDollarSign}
            ></FontAwesomeIcon>
            Invest
          </Link>
        </li>}
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/cal" className={router.pathname === '/cal' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faCalculator}
            ></FontAwesomeIcon>
            CAL(A)
          </Link>
        </li>}
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/mis" className={router.pathname === '/mis' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faInfo}
            ></FontAwesomeIcon>
            MIS
          </Link>
        </li>}
        {session?.user.role == "admin" && <li className='link'>
          <Link href="/settings" className={router.pathname === '/settings' ? 'active' : ''}>
            <FontAwesomeIcon
              className="mr-4"
              icon={faTools}
            ></FontAwesomeIcon>
            Settings
          </Link>
        </li>}
      </ul>
    </animated.div>
  );
};

export default Sidebar;