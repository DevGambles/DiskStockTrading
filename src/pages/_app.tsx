import '@/styles/globals.css'
import Header from "@/components/Header/Header"
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, RefObject, Ref } from 'react';
import { useSpring, to } from "react-spring";
import Sidebar from '@/components/Sidebar/Sidebar';
import Home from './index'
import { animated } from "react-spring";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'bootstrap/dist/css/bootstrap.css';
import LoadingBar from 'react-top-loading-bar'
config.autoAddCss = false

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  const DEFAULT_WIDTH = 300;
  const router = useRouter();
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const loadingBarRef: RefObject<any> = useRef(null);

  let role = "user";
  if (session)
    role = session.user.role;
  let allowed = true;
  if (router.pathname.startsWith("/admin") && role !== "admin") {
    allowed = false;
  }
  const ComponentToRender = allowed ? Component : Home; 
  
  function toggleOpen() {
    setIsHeaderOpen(!isHeaderOpen);
  }

  function hideSidebar() {
    // if (isHeaderOpen) {
    //   toggleOpen();
    // }
  }

  function useAnimation(isHeaderOpen: any) {
    const { translate } = useSpring({
      translate: [isHeaderOpen ? 0 : -100],
    });
    const sidebar = {
      transform: to(translate, x => `translateX(${x}%)`),
      width: DEFAULT_WIDTH,
    };
    const main = useSpring({
      marginLeft: isHeaderOpen ? DEFAULT_WIDTH : 0,
    });

    return { sidebar, main };
  }

  const styles = useAnimation(isHeaderOpen);

  useEffect(() => {
    if (router.pathname.startsWith("/admin") && role !== "admin") {
      router.replace("/");
    }
    if (!session || !session.user) {
      router.replace("/auth");
    }
  }, [router.pathname]);

  useEffect(() => {
    const handleRouterStart = (url: any) => {
      console.log(`Loading: ${url}`);
      loadingBarRef.current?.staticStart()
    }
    
    const handleRouterStop = () => {
      loadingBarRef.current?.complete()
    }

    router.events.on('routeChangeStart', handleRouterStart);
    router.events.on('routeChangeComplete', handleRouterStop);
    router.events.on('routeChangeError', handleRouterStop);

    return () => {
      router.events.off('routeChangeStart', handleRouterStart);
      router.events.off('routeChangeComplete', handleRouterStop);
      router.events.off('routeChangeError', handleRouterStop);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <style jsx>{`
        a {
          margin: 0 10px 0 0;
        }
      `}</style>
      <div className="flex flex-column relative w-full h-screen overflow-hidden">
        <LoadingBar color="#052094" className="loading-bar" ref={loadingBarRef} />
        <div className="flex flex-row relative">
          {router.pathname != '/auth' && <Sidebar hideSidebar={hideSidebar} style={styles.sidebar}/>}
          <animated.div className="flex-1 overflow-x-scroll" style={router.pathname != '/auth'?styles.main:{}}>
            <ToastContainer
              className="mt-20"
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <div className='flex flex-col'>
              {router.pathname != '/auth' && <Header isHeaderOpen={isHeaderOpen} toggleOpen={toggleOpen} />}
              <ComponentToRender {...pageProps}>
              </ComponentToRender>
            </div>
          </animated.div>
        </div>
      </div>
    </SessionProvider>
  )
}