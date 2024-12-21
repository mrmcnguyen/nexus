'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FiBarChart,
  FiCalendar,
  FiChevronsRight,
  FiSettings,
  FiHome,
  FiMap,
  FiGrid,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const Sidebar = ({width}) => {
  const id = useParams();
  const pathname = usePathname();
  console.log("ID SIDEBAR IS ", id);
  const [open, setOpen] = useState(true);
  
  // Get the current page from the pathname
  const getCurrentPage = (pathname) => {
    const path = pathname.split('/');
    const lastSegment = path[path.length - 1];
    
    // If we're at the root project page, return "Dashboard"
    if (lastSegment === id.id) return "Dashboard";
    
    // Convert URL segment to title case for matching
    const pageTitle = {
      'sectors': 'Sectors',
      'members': 'Members',
      'meetings': 'Meetings',
      'eMatrix': 'Eisenhower Matrix',
      'kanban': 'Kanban Board',
      'settings': 'Settings'
    }[lastSegment] || lastSegment;

    return pageTitle;
  };

  const [selected, setSelected] = useState(getCurrentPage(pathname));

  // Update selected when pathname changes
  useEffect(() => {
    setSelected(getCurrentPage(pathname));
  }, [pathname]);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-gray-700 bg-[#171717] p-2"
      style={{
        width: open ? '225px' : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
          id={id}
          page=""
        />
        <Option
          Icon={FiUsers}
          title="Members"
          selected={selected}
          setSelected={setSelected}
          open={open}
          id={id}
          page="members"
        />
        <Option
          Icon={FiCalendar}
          title="Meetings"
          selected={selected}
          setSelected={setSelected}
          open={open}
          id={id}
          page="meetings"
        />
        <Option
          Icon={FiBarChart}
          title="Sectors"
          selected={selected}
          setSelected={setSelected}
          open={open}
          id={id}
          page="sectors"
        />
        <Option
          Icon={FiGrid}
          title="Eisenhower Matrix"
          selected={selected}
          setSelected={setSelected}
          open={open}
          id={id}
          page="eMatrix"
        />
        <Option
          Icon={FiMap}
          title="Kanban Board"
          selected={selected}
          setSelected={setSelected}
          open={open}
          id={id}
          page="kanban"
        />
        <Option
          Icon={FiSettings}
          title="Settings"
          selected={selected}
          setSelected={setSelected}
          open={open}
          id={id}
          page="settings"
        />
      </div>

      {/* <ToggleClose open={open} setOpen={setOpen} /> */}
      <a className="absolute w-full bottom-0 left-0 p-3 text-gray-600 text-center">
      Nexus 2024 © 
      </a>
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs, id, page }) => {

  let fullPath = page === "" ? `../${id.id}` : `../projects/${id.id}/${page}`;

  if (selected !== "Dashboard"){
    fullPath = `../${id.id}/${page}`;
  }

  return (
    <Link href={fullPath}>
      <motion.button
        layout
        onClick={() => setSelected(title)}
        className={`relative flex h-10 md:h-12 w-full mb-2 items-center rounded-md transition-colors ${
          selected === title ? "bg-gray-600 text-[#91C8FF]" : "text-gray-400 hover:bg-gray-600"
        }`}
      >
        <motion.div
          layout
          className="grid h-full w-10 md:w-12 place-content-center text-lg md:text-xl"
        >
          <Icon />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs md:text-sm font-medium"
          >
            {title}
          </motion.span>
        )}

        {notifs && open && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            style={{ y: "-50%" }}
            transition={{ delay: 0.5 }}
            className="absolute right-2 top-1/2 size-4 rounded bg-[#63abf1] text-xs md:text-sm text-white"
          >
            {notifs}
          </motion.span>
        )}
      </motion.button>
      </Link>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-gray-700 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors">
        <div className="flex items-center gap-2">
          <Link href={'../../dashboard'}><Logo /></Link>
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">Kevin's Workspace</span>
              <span className="block text-xs text-slate-500">Nexus</span>
            </motion.div>
          )}
        </div>
        {/* {open && <FiChevronDown className="mr-2" />} */}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md"
    >
      <Image
      src={'/nexusN.png'}
      alt={'Nexus Logo'}
      width={30}
      height={30}
      >

      </Image>
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-500 transition-colors hover:bg-gray-700"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

const ExampleContent = () => <div className="h-[200vh] w-full"></div>;