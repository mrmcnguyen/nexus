'use client'

import React, { useState } from "react";
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

export const Sidebar = ({width}) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

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
        />
        <Option
          Icon={FiUsers}
          title="Members"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiCalendar}
          title="Meetings"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiBarChart}
          title="Sectors"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiGrid}
          title="Eisenhower Matrix"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiMap}
          title="Kanban Board"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiSettings}
          title="Settings"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      {/* <ToggleClose open={open} setOpen={setOpen} /> */}
      <a className="absolute w-full bottom-0 left-0 p-3 text-gray-600 text-center">
      Nexus 2024 © 
      </a>
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-gray-600 text-[#91C8FF]" : "text-gray-400 hover:bg-gray-600"}`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
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
          className="absolute right-2 top-1/2 size-4 rounded bg-[#63abf1] text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
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