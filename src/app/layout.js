import { DM_Sans } from "next/font/google";
import { NotificationProvider } from '../../contexts/NotificationContext';
import { NotificationContainer } from '../../components/NotificationContainer';
import { NotificationHandler } from '../../components/NotificationHandler';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus - Transform Your Project Management",
  description: "Nexus is the all-in-one platform that brings teams together with powerful project management tools, real-time collaboration, and intelligent workflows.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased bg-[#171717]`}>
        <NotificationProvider>
          {children}
          <NotificationContainer />
          <NotificationHandler />
          <Toaster />
        </NotificationProvider>
      </body>
    </html>
  );
}